/**
 * Chart.js Error Prevention System
 * Intercepts and prevents Chart.js errors from crashing the application
 */

import { Chart as ChartJS } from 'chart.js';
import { debugLogger } from './debugLogger';

export class ChartErrorPrevention {
  private static instance: ChartErrorPrevention;
  private originalRAF?: typeof window.requestAnimationFrame;
  private isInitialized = false;
  private arcElementPatched = false;
  
  private constructor() {}
  
  static getInstance(): ChartErrorPrevention {
    if (!ChartErrorPrevention.instance) {
      ChartErrorPrevention.instance = new ChartErrorPrevention();
    }
    return ChartErrorPrevention.instance;
  }
  
  /**
   * Initialize error prevention for Chart.js
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    this.wrapRequestAnimationFrame();
    this.wrapChartPrototype();
    this.interceptArcElementErrors();
    // Removed wrapChartConstructor - was causing infinite recursion
    this.isInitialized = true;
    
    debugLogger.info('ChartErrorPrevention', 'Chart.js error prevention initialized');
  }
  
  /**
   * Intercept ArcElement errors specifically for spacing issues
   */
  private interceptArcElementErrors(): void {
    // Try immediately
    this.patchArcElement();
    
    // Also try after a delay in case Chart.js loads later
    setTimeout(() => this.patchArcElement(), 1000);
    setTimeout(() => this.patchArcElement(), 3000);
  }
  
  private patchArcElement(): void {
    if (this.arcElementPatched) {
      return; // Already patched
    }
    
    if (typeof ChartJS === 'undefined' || !ChartJS.elements?.ArcElement) {
      debugLogger.warn('ChartErrorPrevention', 'Chart.js ArcElement not available for patching');
      return;
    }
    
    const ArcElement = ChartJS.elements.ArcElement;
    const originalInRange = ArcElement.prototype.inRange;
    
    if (!originalInRange) {
      debugLogger.warn('ChartErrorPrevention', 'ArcElement.inRange not found');
      return;
    }
    
    this.arcElementPatched = true;
    
    ArcElement.prototype.inRange = function(chartX: number, chartY: number, useFinalPosition?: boolean) {
      try {
        // Check if options.spacing exists
        if (!this.options || typeof this.options.spacing === 'undefined') {
          const error = new Error('Spacing undefined');
          const stackLines = error.stack?.split('\n') || [];
          
          // Extract meaningful stack trace
          const relevantStack = stackLines.filter(line => 
            !line.includes('chartErrorPrevention') && 
            !line.includes('ArcElement.prototype.inRange') &&
            (line.includes('HtmlChartWidget') || 
             line.includes('Widget') || 
             line.includes('Dashboard') ||
             line.includes('chart.js'))
          ).slice(0, 10);
          
          console.error('[ChartErrorPrevention] ⚠️ SPACING UNDEFINED DETECTED!', {
            element: this,
            options: this.options,
            chartPosition: { x: chartX, y: chartY },
            fullStack: error.stack,
            relevantStack: relevantStack.join('\n'),
            chartInstance: (this as any)._chart || (this as any).chart,
            timestamp: new Date().toISOString()
          });
          
          // Log to window for easier access
          if (typeof window !== 'undefined') {
            (window as any).__lastSpacingError = {
              element: this,
              options: this.options,
              stack: error.stack,
              timestamp: new Date().toISOString()
            };
          }
          
          // Provide default value to prevent crash
          if (!this.options) {
            this.options = {};
          }
          this.options.spacing = 0;
          
          debugLogger.error('ChartErrorPrevention', 'Fixed missing spacing in ArcElement', {
            element: this.constructor.name,
            options: this.options,
            relevantStack: relevantStack.join('\n')
          });
        }
        
        return originalInRange.call(this, chartX, chartY, useFinalPosition);
      } catch (error) {
        console.error('[ChartErrorPrevention] Error in ArcElement.inRange:', error);
        debugLogger.error('ChartErrorPrevention', 'ArcElement.inRange error', error);
        
        // Return false as safe default to prevent crash
        return false;
      }
    };
    
    debugLogger.info('ChartErrorPrevention', 'ArcElement.inRange wrapped for spacing error prevention');
  }
  
  /**
   * Wrap requestAnimationFrame to catch Chart.js errors
   */
  private wrapRequestAnimationFrame(): void {
    if (typeof window === 'undefined') return;
    
    this.originalRAF = window.requestAnimationFrame;
    
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      const wrappedCallback: FrameRequestCallback = (time) => {
        try {
          callback(time);
        } catch (error) {
          // Check if this is a Chart.js error
          const errorString = error?.toString() || '';
          const stackString = (error as any)?.stack || '';
          
          if (stackString.includes('chart.js') || 
              stackString.includes('Chart') ||
              errorString.includes('datasets') ||
              errorString.includes('labels')) {
            console.warn('Chart.js error caught in requestAnimationFrame:', error);
            debugLogger.error('ChartErrorPrevention', 'Chart.js animation frame error suppressed', error);
            
            // Emit event for monitoring
            window.dispatchEvent(new CustomEvent('chartAnimationError', {
              detail: { error, timestamp: new Date().toISOString() }
            }));
            
            // Don't re-throw - prevent crash
            return;
          }
          
          // Re-throw non-Chart.js errors
          throw error;
        }
      };
      
      return this.originalRAF!.call(window, wrappedCallback);
    };
  }
  
  /**
   * REMOVED: Chart.js prototype wrapping to prevent recursive proxy issues
   * The ChartInstanceManager handles individual chart instance wrapping more safely
   */
  private wrapChartPrototype(): void {
    // Prototype wrapping removed to prevent recursive proxy issues with Chart.js internal setters
    // Individual chart instances are wrapped safely in ChartInstanceManager instead
    debugLogger.info('ChartErrorPrevention', 'Prototype wrapping disabled - using instance-level protection');
  }
  
  /**
   * Restore original functions
   */
  destroy(): void {
    if (this.originalRAF) {
      window.requestAnimationFrame = this.originalRAF;
    }
    this.isInitialized = false;
  }
}

// Export singleton instance
export const chartErrorPrevention = ChartErrorPrevention.getInstance();