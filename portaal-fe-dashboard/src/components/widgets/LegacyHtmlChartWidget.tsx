import React, { useEffect, useRef, useContext } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, Filler } from 'chart.js';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';
import { processPlaceholders, PlaceholderContext } from '../../utils/placeholderProcessor';
import { ChartStyleContext } from '../../contexts/ChartStyleContext';
import { ChartStyleSystem } from '../../services/chartStyles';
import { debugLogger, LogLevel } from '../../utils/debugLogger';
import { chartManager } from '../../services/chartManager/ChartInstanceManager';
import { mergeChartOptions, deepMerge } from '../../utils/deepMerge';

// Register Chart.js components locally
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Ensure Chart.js is available globally
if (typeof window !== 'undefined' && !(window as any).Chart) {
  (window as any).Chart = ChartJS;
}


/**
 * @deprecated This component uses an imperative approach that conflicts with React's declarative nature.
 * Use DeclarativeChartWidget instead for new implementations.
 * This component is kept for backward compatibility with legacy HTML-based charts from the backend.
 */
export const LegacyHtmlChartWidget: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstancesRef = useRef<ChartJS[]>([]);
  const cleanupTimeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const isMountedRef = useRef<boolean>(true);
  const isUpdatingStyleRef = useRef<boolean>(false);
  const previousDataRef = useRef<any>(null);
  
  debugLogger.info('HtmlChartWidget', `Rendering widget ${widget.id} - ${widget.name}`, { widget, data }, widget.id.toString());
  
  // Get chart style context
  const styleContext = useContext(ChartStyleContext);
  const styleSystem = styleContext?.styleSystem || ChartStyleSystem.getInstance();
  const currentStyle = styleContext?.currentStyle;
  
  // Store original options for each chart (using WeakMap for memory efficiency)
  const originalOptionsMap = useRef(new WeakMap<ChartJS, any>());
  
  // Function to safely apply styles to an existing chart
  const applyStylesToChart = (chart: ChartJS, styleSystem: ChartStyleSystem) => {
    try {
      const chartType = (chart.config as any).type;
      
      debugLogger.debug('HtmlChartWidget', `Applying styles to chart`, { 
        chartType: chartType,
        datasetsCount: chart?.data?.datasets?.length,
        hasData: !!chart?.data,
        widgetId: widget.id 
      }, widget.id.toString());
      
      // Validate chart instance
      if (!chart || (chart as any).destroyed) {
        debugLogger.warn('HtmlChartWidget', 'Chart instance is invalid or destroyed', null, widget.id.toString());
        return;
      }
      
      // Store original options if not already stored
      if (!originalOptionsMap.current.has(chart)) {
        // Deep clone the original options to preserve them
        const originalOptions = JSON.parse(JSON.stringify(chart.options || {}));
        originalOptionsMap.current.set(chart, originalOptions);
        debugLogger.info('HtmlChartWidget', `Stored original options for widget ${widget.id}`, null, widget.id.toString());
      }
      
      // Get the original options
      const originalOptions = originalOptionsMap.current.get(chart) || {};
      
      // Get style-specific options from the style system
      const styleOptions = styleSystem.getStyleOptions();
      const styleDefinition = styleSystem.getCurrentStyleDefinition();
      
      // Merge options intelligently: original options + style overrides
      const mergedOptions = mergeChartOptions(originalOptions, styleOptions);
      
      // Apply the merged options to the chart
      chart.options = mergedOptions;
      
      debugLogger.debug('HtmlChartWidget', `Applied merged options`, {
        hasOriginalOptions: !!originalOptions,
        hasStyleOptions: !!styleOptions,
        widgetId: widget.id
      }, widget.id.toString());
      
      // Apply styles to datasets without modifying data
      if (chart.data && Array.isArray(chart.data.datasets)) {
        chart.data.datasets.forEach((dataset: any, index: number) => {
          // Apply styles based on chart type
          if (chartType === 'bar' || chartType === 'horizontalBar') {
            // Only update visual properties, not data
            if (!Array.isArray(dataset.backgroundColor) || dataset.backgroundColor.length === 0) {
              if (Array.isArray(styleDefinition.barColors)) {
                dataset.backgroundColor = styleDefinition.barColors[index % styleDefinition.barColors.length];
                dataset.borderColor = styleDefinition.barBorderColors?.[index % styleDefinition.barBorderColors.length] || 
                                     styleDefinition.barColors[index % styleDefinition.barColors.length];
              }
            }
            dataset.borderWidth = styleDefinition.barBorderWidth ?? dataset.borderWidth ?? 1;
            dataset.borderRadius = styleDefinition.barBorderRadius ?? dataset.borderRadius ?? 0;
          } else if (chartType === 'line') {
            dataset.borderColor = styleDefinition.lineColor || dataset.borderColor || '#3b82f6';
            dataset.backgroundColor = styleDefinition.lineBgColor || dataset.backgroundColor || 'rgba(59, 130, 246, 0.1)';
            dataset.borderWidth = styleDefinition.lineBorderWidth ?? dataset.borderWidth ?? 2;
            dataset.tension = styleDefinition.lineTension ?? dataset.tension ?? 0.1;
            dataset.fill = styleDefinition.lineBgColor ? true : dataset.fill;
          } else if (chartType === 'pie' || chartType === 'doughnut') {
            // For pie/doughnut, only update colors if not already set
            if (!Array.isArray(dataset.backgroundColor) || dataset.backgroundColor.length === 0) {
              if (Array.isArray(styleDefinition.pieColors) && styleDefinition.pieColors.length > 0) {
                dataset.backgroundColor = styleDefinition.pieColors;
              } else {
                dataset.backgroundColor = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
              }
            }
            dataset.borderColor = styleDefinition.pieBorderColor || dataset.borderColor || '#fff';
            dataset.borderWidth = styleDefinition.pieBorderWidth ?? dataset.borderWidth ?? 1;
            
            // Ensure spacing is set to prevent undefined errors
            if (dataset.spacing === undefined) {
              dataset.spacing = 0;
            }
          }
        });
      }
      
      // Ensure chart options are properly initialized for pie/doughnut charts
      if ((chartType === 'pie' || chartType === 'doughnut') && chart.options) {
        if (!chart.options.elements) {
          chart.options.elements = {};
        }
        if (!chart.options.elements.arc) {
          chart.options.elements.arc = {
            spacing: 0,
            borderWidth: 1
          };
        } else {
          // Ensure spacing is defined
          if (chart.options.elements.arc.spacing === undefined) {
            chart.options.elements.arc.spacing = 0;
          }
        }
      }
      
      // Update the chart
      try {
        // Special handling for problematic widgets
        if (widget.id === 14 || widget.id === 16) {
          debugLogger.warn('HtmlChartWidget', `Widget ${widget.id} - About to call chart.update()`, {
            beforeUpdateDatasets: chart.data.datasets.length,
            beforeUpdateData: chart.data.datasets[0]?.data?.length || 0
          }, widget.id.toString());
          
          // For widgets 14 and 16, use regular update to ensure proper redraw
          chart.update();
          
          // Force canvas to be visible
          if (chart.canvas) {
            chart.canvas.hidden = false;
            chart.canvas.style.display = '';
            
            // Check parent container visibility
            const container = chart.canvas.parentElement;
            if (container && container.style.display === 'none') {
              container.style.display = '';
            }
            
            // Force a resize to ensure proper rendering
            setTimeout(() => {
              if (chart && !(chart as any).destroyed && chart.resize) {
                chart.resize();
                debugLogger.warn('HtmlChartWidget', `Widget ${widget.id} - Forced resize after style update`, null, widget.id.toString());
              }
            }, 100);
          }
        } else {
          chart.update('none');
        }
        
        debugLogger.info('HtmlChartWidget', `Widget ${widget.id} - Chart updated successfully`, {
          finalDatasetsCount: chart.data.datasets.length,
          finalFirstDatasetLength: chart.data.datasets[0]?.data?.length || 0,
          chartVisible: !chart.canvas.hidden,
          canvasWidth: chart.canvas.width,
          canvasHeight: chart.canvas.height
        }, widget.id.toString());
        
      } catch (updateError) {
        debugLogger.error('HtmlChartWidget', 'Error updating chart after style application', updateError, widget.id.toString());
      }
    } catch (error) {
      debugLogger.error('HtmlChartWidget', 'Error applying styles to chart', error, widget.id.toString());
      // Don't throw - just log the error to prevent chart destruction
    }
  };
  
  // Effect to reapply styles when style changes
  useEffect(() => {
    debugLogger.debug('HtmlChartWidget', `Style change detected: ${currentStyle}`, { currentStyle, chartCount: chartInstancesRef.current.length }, widget.id.toString());
    
    if (currentStyle && styleSystem && chartInstancesRef.current.length > 0) {
      isUpdatingStyleRef.current = true;
      
      // Apply styles with a small delay to ensure charts are fully initialized
      const timer = setTimeout(() => {
        debugLogger.info('HtmlChartWidget', `Applying style ${currentStyle} to ${chartInstancesRef.current.length} charts`, null, widget.id.toString());
        
        chartInstancesRef.current.forEach((chart, index) => {
          try {
            if (chart && !(chart as any).destroyed) {
              debugLogger.debug('HtmlChartWidget', `Applying style to chart ${index}`, null, widget.id.toString());
              applyStylesToChart(chart, styleSystem);
            }
          } catch (err) {
            debugLogger.error('HtmlChartWidget', `Failed to apply style to chart ${index}`, err, widget.id.toString());
          }
        });
        
        // Reset the flag after style update
        setTimeout(() => {
          isUpdatingStyleRef.current = false;
        }, 100);
      }, 300); // Slightly longer delay for stability
      
      return () => {
        clearTimeout(timer);
        isUpdatingStyleRef.current = false;
      };
    }
  }, [currentStyle, styleSystem]); // Include styleSystem in deps

  // Track component mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all pending timeouts on unmount
      cleanupTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      cleanupTimeoutsRef.current.clear();
    };
  }, []);
  
  // Main effect for chart initialization
  useEffect(() => {
    debugLogger.info('HtmlChartWidget', 'Initializing chart rendering', { hasData: !!data?.chart, hasContainer: !!containerRef.current }, widget.id.toString());
    
    // Special logging for problematic widgets
    if (widget.id === 14 || widget.id === 16) {
      debugLogger.warn('HtmlChartWidget', `Widget ${widget.id} - useEffect triggered`, {
        dataExists: !!data,
        chartHtml: data?.chart ? data.chart.substring(0, 200) + '...' : 'NO CHART HTML',
        dataKeys: data ? Object.keys(data) : [],
        containerExists: !!containerRef.current
      }, widget.id.toString());
    }
    
    // Check if data has actually changed meaningfully
    const currentDataString = JSON.stringify(data);
    const previousDataString = JSON.stringify(previousDataRef.current);
    const dataChanged = currentDataString !== previousDataString;
    
    // Check if it's just a timestamp or minor metadata change
    let isSignificantChange = dataChanged;
    if (dataChanged && data && previousDataRef.current) {
      // Compare the actual chart data, not metadata
      const currentChartData = data.chart;
      const previousChartData = previousDataRef.current.chart;
      
      // If the chart HTML is the same, it's not a significant change
      if (currentChartData === previousChartData) {
        isSignificantChange = false;
        debugLogger.debug('HtmlChartWidget', 'Chart HTML unchanged, skipping re-render', null, widget.id.toString());
      }
    }
    
    previousDataRef.current = data;
    
    // Skip re-initialization if we're just updating styles or data hasn't significantly changed
    if ((isUpdatingStyleRef.current || !isSignificantChange) && chartInstancesRef.current.length > 0) {
      debugLogger.debug('HtmlChartWidget', 'Skipping re-initialization, no significant changes', null, widget.id.toString());
      return;
    }
    
    // Only cleanup if there's a significant change and we have existing charts
    if (isSignificantChange && chartInstancesRef.current.length > 0) {
      debugLogger.info('HtmlChartWidget', 'Significant data change detected, recreating charts', null, widget.id.toString());
      chartInstancesRef.current.forEach((chart, index) => {
        try {
          debugLogger.debug('HtmlChartWidget', `Destroying previous chart instance ${index}`, null, widget.id.toString());
          chart.destroy();
        } catch (err) {
          debugLogger.warn('HtmlChartWidget', `Failed to destroy chart ${index}`, err, widget.id.toString());
        }
      });
      chartInstancesRef.current = [];
    }

    if (!data?.chart || !containerRef.current) {
      debugLogger.debug('HtmlChartWidget', 'No data or container, skipping chart creation', null, widget.id.toString());
      return;
    }
    
    // Check if data contains actual data arrays
    const hasValidData = data.data || (data as any).Query || ((data as any).datasets && Array.isArray((data as any).datasets));
    if (!hasValidData) {
      debugLogger.warn('HtmlChartWidget', `Widget ${widget.id} has no valid data structure`, { dataKeys: Object.keys(data) }, widget.id.toString());
    }

    // Only clear and rebuild if there's a significant change
    if (isSignificantChange && containerRef.current) {
      debugLogger.debug('HtmlChartWidget', 'Rebuilding chart container due to significant changes', null, widget.id.toString());
      containerRef.current.innerHTML = '';
      
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.chart;

      // Move all elements to the actual container
      while (tempDiv.firstChild) {
        containerRef.current.appendChild(tempDiv.firstChild);
      }
    } else if (!containerRef.current.hasChildNodes() && data?.chart) {
      // If container is empty but we have data, populate it
      debugLogger.debug('HtmlChartWidget', 'Populating empty container', null, widget.id.toString());
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.chart;
      while (tempDiv.firstChild) {
        containerRef.current.appendChild(tempDiv.firstChild);
      }
    }

    // Find all canvas elements and their associated scripts
    const canvases = containerRef.current.querySelectorAll('canvas');
    const scripts = containerRef.current.querySelectorAll('script');

    // Only process scripts if we have significant changes or no charts yet
    if (!isSignificantChange && chartInstancesRef.current.length > 0) {
      debugLogger.debug('HtmlChartWidget', 'Skipping script processing, charts already exist', null, widget.id.toString());
      return;
    }

    debugLogger.info('HtmlChartWidget', `Processing ${scripts.length} chart scripts`, null, widget.id.toString());
    
    // Special logging for widgets 14 and 16
    if (widget.id === 14 || widget.id === 16) {
      debugLogger.warn('HtmlChartWidget', `Widget ${widget.id} - Found ${scripts.length} scripts and ${canvases.length} canvases`, {
        canvasIds: Array.from(canvases).map((c: any) => c.id),
        scriptSnippets: Array.from(scripts).map((s: any) => s.textContent?.substring(0, 100) + '...')
      }, widget.id.toString());
    }
    
    scripts.forEach((script, scriptIndex) => {
      debugLogger.debug('HtmlChartWidget', `Processing script ${scriptIndex}`, { scriptLength: script.textContent?.length }, widget.id.toString());
      
      try {
        let scriptContent = script.textContent || '';
        
        // Create safe placeholder context with fallbacks
        const safeData = data || {};
        const queryData = safeData.data || (safeData as any).Query || [];
        
        // Ensure Query is always an array
        const context: PlaceholderContext = {
          ...safeData,
          Query: Array.isArray(queryData) ? queryData : [],
          data: safeData,
        };
        
        // Add debugging for missing data
        if (!queryData || (Array.isArray(queryData) && queryData.length === 0)) {
          debugLogger.warn('HtmlChartWidget', `Widget ${widget.id} has no data, using empty array`, null, widget.id.toString());
        }
        
        // Process placeholders in the script content
        scriptContent = processPlaceholders(scriptContent, context);
        
        // Execute the script in a safer way
        const executeScript = () => {
          try {
            debugLogger.debug('HtmlChartWidget', `Executing script ${scriptIndex} safely`, null, widget.id.toString());
            
            // Create a function with the script content
            const scriptFunction = new Function('Chart', 'document', 'window', 'console', scriptContent);
            
            // Execute with limited scope
            scriptFunction(
              ChartJS,
              {
                getElementById: (id: string) => containerRef.current?.querySelector(`#${id}`),
                querySelector: (selector: string) => containerRef.current?.querySelector(selector),
                querySelectorAll: (selector: string) => containerRef.current?.querySelectorAll(selector)
              },
              { Chart: ChartJS },
              console
            );
          } catch (error) {
            debugLogger.error('HtmlChartWidget', `Script execution error for script ${scriptIndex}`, error, widget.id.toString());
          }
        };
        
        executeScript();
        
      } catch (error) {
        debugLogger.error('HtmlChartWidget', `Error processing script ${scriptIndex}`, error, widget.id.toString());
      }
    });
    
    // After script execution, find and track chart instances
    const findChartTimeout = setTimeout(() => {
      const allCanvases = containerRef.current?.querySelectorAll('canvas') || [];
      
      allCanvases.forEach((canvas: HTMLCanvasElement) => {
        try {
          const chartInstance = ChartJS.getChart(canvas);
          if (chartInstance && !(chartInstance as any).destroyed) {
            const canvasId = canvas.id || `canvas-${Date.now()}`;
            
            debugLogger.info('HtmlChartWidget', `Found chart instance for ${canvasId}`, {
              chartType: (chartInstance.config as any).type,
              datasetsCount: chartInstance.data.datasets?.length || 0
            }, widget.id.toString());
            
            chartInstancesRef.current.push(chartInstance);
            
            // Register with centralized chart manager
            const chartKey = `${widget.id}-${canvasId}`;
            chartManager.registerChart(chartKey, chartInstance, widget.id.toString(), widget.name);
            
            // Apply initial style if available
            if (styleSystem && currentStyle) {
              debugLogger.debug('HtmlChartWidget', `Scheduling initial style application for ${canvasId}`, null, widget.id.toString());
              // Wait a bit more before applying initial style
              const styleTimeout = setTimeout(() => {
                if (isMountedRef.current && chartInstance && !(chartInstance as any).destroyed) {
                  applyStylesToChart(chartInstance, styleSystem);
                }
              }, 100);
              cleanupTimeoutsRef.current.add(styleTimeout);
            }
          }
        } catch (err) {
          debugLogger.error('HtmlChartWidget', `Failed to get chart from canvas`, err, widget.id.toString());
        }
      });
      
      debugLogger.info('HtmlChartWidget', `Total charts tracked: ${chartInstancesRef.current.length}`, null, widget.id.toString());
    }, 500); // Delay to ensure scripts have completed
    
    cleanupTimeoutsRef.current.add(findChartTimeout);
    
    // Cleanup function
    return () => {
      // Clear all timeouts
      cleanupTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      cleanupTimeoutsRef.current.clear();
      
      // Cleanup chart instances on unmount or re-render
      chartInstancesRef.current.forEach((chart, index) => {
        try {
          debugLogger.debug('HtmlChartWidget', `Destroying chart ${index} on cleanup`, null, widget.id.toString());
          chart.destroy();
        } catch (error) {
          debugLogger.error('HtmlChartWidget', `Error destroying chart ${index} on cleanup`, error, widget.id.toString());
        }
      });
      chartInstancesRef.current = [];
    };
  }, [data, widget.id, currentStyle, styleSystem]);

  if (loading) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center">
          <div className="k-loading-indicator k-loading-indicator-large"></div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center text-red-500">
          <div>Error loading chart: {error.message}</div>
        </CardBody>
      </Card>
    );
  }

  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  return (
    <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader className="bg-gray-50" style={{ flexShrink: 0 }}>
        <h3 className="text-lg font-semibold">
          {widget.name}
          <span className="ml-2 text-sm text-gray-500">(ID: {widget.id})</span>
        </h3>
        {formattedParameters && (
          <div className="text-sm text-gray-600 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
      </CardBody>
    </Card>
  );
};