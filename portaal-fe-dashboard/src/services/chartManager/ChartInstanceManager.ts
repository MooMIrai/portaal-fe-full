import { Chart as ChartJS } from 'chart.js';
import { debugLogger } from '../../utils/debugLogger';

interface ChartMetadata {
  widgetId: string;
  widgetName?: string;
  createdAt: Date;
  lastUpdated: Date;
  errorCount: number;
  updateCount: number;
  isHealthy: boolean;
  consecutiveUpdateErrors: number;
  lastUpdateError?: Date;
  isUpdateDisabled: boolean;
}

interface ChartRecord {
  instance: ChartJS;
  metadata: ChartMetadata;
  healthCheckInterval?: NodeJS.Timeout;
}

/**
 * Centralized manager for Chart.js instances
 * Provides health monitoring, automatic cleanup, and error recovery
 */
export class ChartInstanceManager {
  private static instance: ChartInstanceManager;
  private charts: Map<string, ChartRecord> = new Map();
  private globalHealthCheckInterval?: NodeJS.Timeout;
  private readonly maxErrorsBeforeDisable = 5;
  private readonly healthCheckIntervalMs = 10000; // 10 seconds
  
  private constructor() {
    this.startGlobalHealthCheck();
    this.setupMemoryMonitoring();
  }
  
  static getInstance(): ChartInstanceManager {
    if (!ChartInstanceManager.instance) {
      ChartInstanceManager.instance = new ChartInstanceManager();
    }
    return ChartInstanceManager.instance;
  }
  
  /**
   * Register a new chart instance
   */
  registerChart(chartId: string, chart: ChartJS, widgetId: string, widgetName?: string): void {
    try {
      // Clean up existing chart if present
      if (this.charts.has(chartId)) {
        this.unregisterChart(chartId);
      }
      
      const metadata: ChartMetadata = {
        widgetId,
        widgetName,
        createdAt: new Date(),
        lastUpdated: new Date(),
        errorCount: 0,
        updateCount: 0,
        isHealthy: true,
        consecutiveUpdateErrors: 0,
        isUpdateDisabled: false
      };
      
      // Store original update method to intercept calls safely
      const originalUpdate = chart.update.bind(chart);
      chart.update = (mode?: any) => {
        try {
          const record = this.charts.get(chartId);
          if (record) {
            // Check if updates are disabled due to too many errors
            if (record.metadata.isUpdateDisabled) {
              return undefined;
            }
            
            // Check for rapid consecutive errors (more than 5 in last second)
            if (record.metadata.lastUpdateError) {
              const timeSinceLastError = Date.now() - record.metadata.lastUpdateError.getTime();
              if (timeSinceLastError < 1000 && record.metadata.consecutiveUpdateErrors >= 5) {
                record.metadata.isUpdateDisabled = true;
                debugLogger.error('ChartInstanceManager', `Disabling updates for chart ${chartId} - too many rapid errors`);
                window.dispatchEvent(new CustomEvent('chartUpdateDisabled', {
                  detail: { chartId, widgetId: record.metadata.widgetId, reason: 'Too many update errors' }
                }));
                return undefined;
              }
            }
            
            record.metadata.updateCount++;
            record.metadata.lastUpdated = new Date();
          }
          
          // Check for maximum call stack before proceeding
          const stackDepth = (new Error().stack?.split('\n').length || 0);
          if (stackDepth > 50) {
            console.warn(`Chart update ${chartId}: Stack depth ${stackDepth} - skipping to prevent overflow`);
            debugLogger.warn('ChartInstanceManager', `Chart update ${chartId} skipped due to deep stack`, { stackDepth });
            if (record) {
              record.metadata.consecutiveUpdateErrors++;
              record.metadata.lastUpdateError = new Date();
            }
            return undefined;
          }
          
          // Safely call original update without data manipulation
          try {
            const result = originalUpdate(mode);
            // Reset consecutive error count on successful update
            if (record) {
              record.metadata.consecutiveUpdateErrors = 0;
              // Re-enable updates if they were disabled and now working
              if (record.metadata.isUpdateDisabled) {
                record.metadata.isUpdateDisabled = false;
                debugLogger.info('ChartInstanceManager', `Re-enabled updates for chart ${chartId} after successful update`);
              }
            }
            return result;
          } catch (updateError) {
            const errorString = updateError?.toString() || '';
            
            if (record) {
              record.metadata.consecutiveUpdateErrors++;
              record.metadata.lastUpdateError = new Date();
            }
            
            // Detect specific proxy recursion errors
            if (errorString.includes('Maximum call stack size exceeded') || 
                errorString.includes('Object.set')) {
              console.warn(`Chart ${chartId}: Proxy recursion detected, skipping update to prevent crash`);
              debugLogger.error('ChartInstanceManager', `Chart ${chartId} proxy recursion prevented`, updateError);
              if (record) {
                record.metadata.isUpdateDisabled = true;
              }
              return undefined;
            }
            
            console.warn(`Chart update failed for ${chartId}, preventing crash:`, updateError);
            this.handleChartError(chartId, updateError);
            return undefined;
          }
        } catch (error) {
          console.warn(`Chart update wrapper error for ${chartId}:`, error);
          this.handleChartError(chartId, error);
          return undefined;
        }
      };
      
      // Store and wrap the resize method
      const originalResize = chart.resize.bind(chart);
      chart.resize = (width?: number, height?: number) => {
        try {
          return originalResize(width, height);
        } catch (error) {
          console.warn(`Chart resize failed for ${chartId}:`, error);
          this.handleChartError(chartId, error);
          return undefined;
        }
      };
      
      // Store and wrap the render method if it exists
      if (chart.render) {
        const originalRender = chart.render.bind(chart);
        chart.render = () => {
          try {
            return originalRender();
          } catch (error) {
            console.warn(`Chart render failed for ${chartId}:`, error);
            this.handleChartError(chartId, error);
            return undefined;
          }
        };
      }
      
      // Store and wrap the draw method if it exists
      if (chart.draw) {
        const originalDraw = chart.draw.bind(chart);
        chart.draw = () => {
          try {
            return originalDraw();
          } catch (error) {
            console.warn(`Chart draw failed for ${chartId}:`, error);
            this.handleChartError(chartId, error);
            return undefined;
          }
        };
      }
      
      // Store original destroy method to clean up our tracking
      const originalDestroy = chart.destroy.bind(chart);
      (chart as any)._originalDestroy = originalDestroy;
      (chart as any)._isRegistered = true;
      chart.destroy = () => {
        // Prevent recursive calls
        if ((chart as any)._isDestroying) {
          return;
        }
        (chart as any)._isDestroying = true;
        
        // Unregister from manager (this will call the original destroy)
        this.unregisterChart(chartId);
      };
      
      this.charts.set(chartId, {
        instance: chart,
        metadata
      });
      
      debugLogger.info('ChartInstanceManager', `Registered chart ${chartId} for widget ${widgetId}`, {
        totalCharts: this.charts.size
      });
      
    } catch (error) {
      debugLogger.error('ChartInstanceManager', `Failed to register chart ${chartId}`, error);
    }
  }
  
  /**
   * Unregister and cleanup a chart instance
   */
  unregisterChart(chartId: string): void {
    const record = this.charts.get(chartId);
    if (record) {
      try {
        // Clear health check interval if exists
        if (record.healthCheckInterval) {
          clearInterval(record.healthCheckInterval);
        }
        
        // Remove from registry first to prevent any further operations
        this.charts.delete(chartId);
        
        // Destroy chart if not already destroyed
        if (!record.instance.destroyed && !(record.instance as any)._isDestroying) {
          // Call the original destroy method if available
          if ((record.instance as any)._originalDestroy) {
            (record.instance as any)._originalDestroy();
          } else {
            // Fallback to regular destroy
            record.instance.destroy();
          }
        }
        
        debugLogger.info('ChartInstanceManager', `Unregistered chart ${chartId}`, {
          remainingCharts: this.charts.size
        });
      } catch (error) {
        debugLogger.error('ChartInstanceManager', `Error unregistering chart ${chartId}`, error);
        // Already removed from registry above
      }
    }
  }
  
  /**
   * Validate chart data structure
   */
  private validateChartData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.labels)) return false;
    if (!Array.isArray(data.datasets)) return false;
    
    // Check each dataset has basic structure
    for (const dataset of data.datasets) {
      if (!dataset || typeof dataset !== 'object') return false;
      if (!Array.isArray(dataset.data)) return false;
    }
    
    return true;
  }
  
  /**
   * Safe update chart data with validation - avoiding direct mutation
   */
  safeUpdateChartData(chartId: string, newData: any): boolean {
    const record = this.charts.get(chartId);
    if (!record) {
      debugLogger.warn('ChartInstanceManager', `Chart ${chartId} not found for data update`);
      return false;
    }
    
    try {
      // Validate new data
      if (!this.validateChartData(newData)) {
        debugLogger.error('ChartInstanceManager', `Invalid data structure for chart ${chartId}`, newData);
        return false;
      }
      
      // Avoid direct assignment to prevent proxy issues
      // Instead, create a new chart configuration and recreate if needed
      try {
        // Check if the chart is still valid before attempting update
        if (record.instance.destroyed) {
          debugLogger.warn('ChartInstanceManager', `Chart ${chartId} is destroyed, cannot update data`);
          return false;
        }
        
        // Use Chart.js's safe data update methods
        if (record.instance.data.labels !== undefined) {
          record.instance.data.labels.length = 0;
          record.instance.data.labels.push(...(newData.labels || []));
        }
        
        if (record.instance.data.datasets !== undefined) {
          record.instance.data.datasets.length = 0;
          record.instance.data.datasets.push(...(newData.datasets || []));
        }
        
        // Update with no animation to prevent proxy issues
        record.instance.update('none');
        record.metadata.lastUpdated = new Date();
        return true;
      } catch (updateError) {
        const errorString = updateError?.toString() || '';
        if (errorString.includes('Maximum call stack size exceeded')) {
          debugLogger.error('ChartInstanceManager', `Chart ${chartId} data update caused stack overflow - aborting`, updateError);
          return false;
        }
        debugLogger.error('ChartInstanceManager', `Update failed for chart ${chartId}`, updateError);
        throw updateError;
      }
    } catch (error) {
      debugLogger.error('ChartInstanceManager', `Failed to update chart ${chartId} data`, error);
      this.handleChartError(chartId, error);
      return false;
    }
  }
  
  /**
   * Get a chart instance by ID
   */
  getChart(chartId: string): ChartJS | undefined {
    return this.charts.get(chartId)?.instance;
  }
  
  /**
   * Get all charts for a specific widget
   */
  getWidgetCharts(widgetId: string): ChartJS[] {
    const charts: ChartJS[] = [];
    this.charts.forEach((record) => {
      if (record.metadata.widgetId === widgetId) {
        charts.push(record.instance);
      }
    });
    return charts;
  }
  
  /**
   * Handle chart errors and track health
   */
  private handleChartError(chartId: string, error: any): void {
    const record = this.charts.get(chartId);
    if (record) {
      record.metadata.errorCount++;
      record.metadata.isHealthy = false;
      
      debugLogger.error('ChartInstanceManager', `Chart ${chartId} error (count: ${record.metadata.errorCount})`, error);
      
      // Auto-disable chart after too many errors
      if (record.metadata.errorCount >= this.maxErrorsBeforeDisable) {
        debugLogger.critical('ChartInstanceManager', 
          `Chart ${chartId} exceeded error threshold. Disabling.`, 
          { errorCount: record.metadata.errorCount }
        );
        
        this.disableChart(chartId);
        
        // Emit event for UI notification
        window.dispatchEvent(new CustomEvent('chartDisabled', {
          detail: {
            chartId,
            widgetId: record.metadata.widgetId,
            reason: 'Too many errors',
            errorCount: record.metadata.errorCount
          }
        }));
      }
    }
  }
  
  /**
   * Disable a problematic chart
   */
  private disableChart(chartId: string): void {
    const record = this.charts.get(chartId);
    if (record) {
      try {
        // Clear the canvas
        const canvas = record.instance.canvas;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f87171';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Chart Disabled Due to Errors', canvas.width / 2, canvas.height / 2);
          }
        }
        
        // Destroy the chart instance
        if (!record.instance.destroyed) {
          record.instance.destroy();
        }
        
        // Keep metadata for debugging but mark as unhealthy
        record.metadata.isHealthy = false;
        
      } catch (error) {
        debugLogger.error('ChartInstanceManager', `Error disabling chart ${chartId}`, error);
      }
    }
  }
  
  /**
   * Start global health monitoring
   */
  private startGlobalHealthCheck(): void {
    this.globalHealthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckIntervalMs);
  }
  
  /**
   * Perform health check on all charts
   */
  private performHealthCheck(): void {
    const unhealthyCharts: string[] = [];
    
    this.charts.forEach((record, chartId) => {
      try {
        // Check if chart is destroyed
        if (record.instance.destroyed) {
          unhealthyCharts.push(chartId);
          return;
        }
        
        // Check if canvas is still in DOM
        const canvas = record.instance.canvas;
        if (!canvas || !canvas.isConnected) {
          unhealthyCharts.push(chartId);
          return;
        }
        
        // Check for stale charts (not updated in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (record.metadata.lastUpdated < fiveMinutesAgo) {
          debugLogger.warn('ChartInstanceManager', 
            `Chart ${chartId} appears stale (last updated: ${record.metadata.lastUpdated})`,
            { widgetId: record.metadata.widgetId }
          );
        }
        
        // Mark as healthy if all checks pass
        record.metadata.isHealthy = true;
        
      } catch (error) {
        debugLogger.error('ChartInstanceManager', `Health check failed for chart ${chartId}`, error);
        unhealthyCharts.push(chartId);
      }
    });
    
    // Clean up unhealthy charts
    unhealthyCharts.forEach(chartId => {
      debugLogger.info('ChartInstanceManager', `Removing unhealthy chart ${chartId}`);
      this.unregisterChart(chartId);
    });
    
    if (unhealthyCharts.length > 0) {
      debugLogger.info('ChartInstanceManager', `Health check completed. Removed ${unhealthyCharts.length} unhealthy charts`, {
        remainingCharts: this.charts.size
      });
    }
  }
  
  /**
   * Setup memory monitoring
   */
  private setupMemoryMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (performance as any)) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemoryMB = memory.usedJSHeapSize / 1048576;
        const totalMemoryMB = memory.totalJSHeapSize / 1048576;
        
        // Warn if memory usage is high
        if (usedMemoryMB > 500) {
          debugLogger.warn('ChartInstanceManager', `High memory usage detected`, {
            usedMemoryMB: usedMemoryMB.toFixed(2),
            totalMemoryMB: totalMemoryMB.toFixed(2),
            chartCount: this.charts.size
          });
          
          // Consider cleaning up old charts if memory is very high
          if (usedMemoryMB > 800) {
            this.cleanupOldCharts();
          }
        }
      }, 30000); // Check every 30 seconds
    }
  }
  
  /**
   * Clean up old or unused charts
   */
  private cleanupOldCharts(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const chartsToRemove: string[] = [];
    
    this.charts.forEach((record, chartId) => {
      // Remove charts not updated in the last hour
      if (record.metadata.lastUpdated < oneHourAgo) {
        chartsToRemove.push(chartId);
      }
    });
    
    if (chartsToRemove.length > 0) {
      debugLogger.info('ChartInstanceManager', `Cleaning up ${chartsToRemove.length} old charts`);
      chartsToRemove.forEach(chartId => this.unregisterChart(chartId));
    }
  }
  
  /**
   * Get statistics about managed charts
   */
  getStatistics(): {
    totalCharts: number;
    healthyCharts: number;
    unhealthyCharts: number;
    chartsByWidget: Map<string, number>;
    totalErrors: number;
  } {
    const stats = {
      totalCharts: this.charts.size,
      healthyCharts: 0,
      unhealthyCharts: 0,
      chartsByWidget: new Map<string, number>(),
      totalErrors: 0
    };
    
    this.charts.forEach((record) => {
      if (record.metadata.isHealthy) {
        stats.healthyCharts++;
      } else {
        stats.unhealthyCharts++;
      }
      
      const widgetCount = stats.chartsByWidget.get(record.metadata.widgetId) || 0;
      stats.chartsByWidget.set(record.metadata.widgetId, widgetCount + 1);
      
      stats.totalErrors += record.metadata.errorCount;
    });
    
    return stats;
  }
  
  /**
   * Cleanup all charts and stop monitoring
   */
  destroy(): void {
    // Stop health check
    if (this.globalHealthCheckInterval) {
      clearInterval(this.globalHealthCheckInterval);
    }
    
    // Unregister all charts
    const chartIds = Array.from(this.charts.keys());
    chartIds.forEach(chartId => this.unregisterChart(chartId));
    
    debugLogger.info('ChartInstanceManager', 'Manager destroyed');
  }
}

// Export singleton instance
export const chartManager = ChartInstanceManager.getInstance();