/**
 * Global error handler utilities for the dashboard
 */

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  source: string;
  widgetId?: string;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 50;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Enhanced widget error detection
      const errorPatterns = {
        chart: /chart\.js|Chart|spacing|canvas|getContext|destroyed|_chartjs/i,
        widget: /widget|HtmlChartWidget|WidgetRenderer|DynamicChartRenderer/i,
        render: /Cannot read properties|undefined|null|TypeError.*null/i,
        dashboard: /dashboard|grid|layout|container/i
      };
      
      const errorString = `${event.reason?.message || ''} ${event.reason?.stack || ''}`;
      
      const isChartError = errorPatterns.chart.test(errorString);
      const isWidgetError = errorPatterns.widget.test(errorString) || isChartError;
      const isRenderError = errorPatterns.render.test(errorString);
      const isDashboardError = errorPatterns.dashboard.test(errorString);
      
      // Determine error severity and handling
      if (isWidgetError || isChartError) {
        console.warn('Widget/Chart error caught and isolated to prevent cascade');
        
        // Try to extract widget ID from stack trace
        const widgetIdMatch = errorString.match(/widget[:\s]+(\d+)/i);
        const widgetId = widgetIdMatch ? widgetIdMatch[1] : 'unknown-widget';
        
        this.logError({
          message: `Widget Error (Isolated): ${event.reason?.message || event.reason}`,
          stack: event.reason?.stack,
          source: 'widget-unhandledrejection',
          timestamp: new Date().toISOString(),
          widgetId: widgetId
        });
        
        // Emit custom event for widget error monitoring
        window.dispatchEvent(new CustomEvent('widgetError', {
          detail: {
            widgetId,
            error: event.reason,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        this.logError({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          stack: event.reason?.stack,
          source: 'unhandledrejection',
          timestamp: new Date().toISOString()
        });
      }
      
      // Always prevent default to avoid console spam and potential crashes
      event.preventDefault();
      
      // Stop propagation for widget errors
      if (isWidgetError) {
        event.stopImmediatePropagation();
      }
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      // Check if this is a Chart.js error from requestAnimationFrame
      const isAnimationFrameError = event.error?.stack?.includes('requestAnimationFrame') || 
                                    event.message?.includes('requestAnimationFrame');
      const isChartJsError = event.filename?.includes('chart.js') || 
                             event.error?.stack?.includes('chart.js') ||
                             event.message?.includes('generateLabels') ||
                             event.message?.includes('datasets') ||
                             event.message?.includes('labels');
      
      if (isAnimationFrameError || isChartJsError) {
        console.warn('Chart.js animation frame error suppressed:', event.message);
        // Prevent these errors from crashing the app
        event.preventDefault();
        event.stopImmediatePropagation();
        
        // Log but don't crash
        this.logError({
          message: `Chart Animation Error (Suppressed): ${event.message}`,
          stack: event.error?.stack,
          source: 'chart-animation-frame',
          url: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno,
          timestamp: new Date().toISOString(),
          widgetId: 'chart-animation-error'
        });
        
        return; // Exit early, don't process further
      }
      
      console.error('Global error:', event.error);
      
      // Enhanced error categorization
      const errorPatterns = {
        chart: /chart\.js|Chart|spacing|canvas|getContext|destroyed|_chartjs/i,
        widget: /widget|HtmlChartWidget|WidgetRenderer|DynamicChartRenderer/i,
        script: /Script error|eval|Function|new Function/i,
        network: /fetch|xhr|ajax|network|cors/i,
        resource: /img|image|script|stylesheet|css|font/i
      };
      
      const errorString = `${event.message || ''} ${event.filename || ''} ${event.error?.stack || ''}`;
      
      const isChartError = errorPatterns.chart.test(errorString);
      const isWidgetError = errorPatterns.widget.test(errorString) || isChartError;
      const isScriptError = errorPatterns.script.test(errorString);
      const isNetworkError = errorPatterns.network.test(errorString);
      const isResourceError = errorPatterns.resource.test(errorString);
      
      // Determine error type and severity
      let errorType = 'general';
      let shouldPreventDefault = true;
      let shouldStopPropagation = false;
      
      if (isWidgetError || isChartError) {
        errorType = 'widget';
        shouldStopPropagation = true;
        console.warn('Widget/Chart error isolated - preventing cascade');
      } else if (isScriptError) {
        errorType = 'script';
        shouldStopPropagation = true;
        console.warn('Script execution error isolated');
      } else if (isNetworkError) {
        errorType = 'network';
        shouldPreventDefault = false; // Let network errors be handled normally
      } else if (isResourceError) {
        errorType = 'resource';
        shouldPreventDefault = false; // Let resource errors be handled normally
      }
      
      // Try to extract widget ID from various sources
      let widgetId: string | undefined;
      if (isWidgetError) {
        const stackMatch = event.error?.stack?.match(/widget[:\s]+(\d+)/i);
        const messageMatch = event.message?.match(/widget[:\s]+(\d+)/i);
        const filenameMatch = event.filename?.match(/widget[_-]?(\d+)/i);
        widgetId = stackMatch?.[1] || messageMatch?.[1] || filenameMatch?.[1] || 'unknown-widget';
      }
      
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        source: `window.error-${errorType}`,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: new Date().toISOString(),
        widgetId: widgetId
      });
      
      // Emit custom event for monitoring
      if (isWidgetError) {
        window.dispatchEvent(new CustomEvent('widgetError', {
          detail: {
            widgetId,
            error: event.error,
            message: event.message,
            timestamp: new Date().toISOString()
          }
        }));
      }
      
      // Handle error based on type
      if (shouldStopPropagation) {
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      
      if (shouldPreventDefault) {
        event.preventDefault();
      }
    });
    
    // Add listener for widget errors to track problematic widgets
    window.addEventListener('widgetError', (event: any) => {
      const { widgetId, error } = event.detail;
      
      // Track widget error frequency
      if (!this.widgetErrorCounts) {
        this.widgetErrorCounts = new Map();
      }
      
      const errorCount = (this.widgetErrorCounts.get(widgetId) || 0) + 1;
      this.widgetErrorCounts.set(widgetId, errorCount);
      
      // Auto-disable widget after too many errors
      if (errorCount >= 5) {
        console.error(`Widget ${widgetId} has failed ${errorCount} times. Consider disabling it.`);
        
        // Emit event to disable the widget
        window.dispatchEvent(new CustomEvent('disableWidget', {
          detail: { widgetId, reason: 'Too many errors', errorCount }
        }));
      }
    });
  }
  
  private widgetErrorCounts: Map<string, number> = new Map();

  logError(error: ErrorLog) {
    this.errorLogs.push(error);
    
    // Keep only the last N errors
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }

    // Store in sessionStorage for debugging
    try {
      sessionStorage.setItem('dashboardErrorLogs', JSON.stringify(this.errorLogs));
    } catch (e) {
      console.error('Failed to store error log:', e);
    }

    // Send to monitoring service if configured
    this.sendToMonitoring(error);
  }

  private sendToMonitoring(error: ErrorLog) {
    // This is where you would send errors to a monitoring service
    // like Sentry, LogRocket, etc.
    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Dashboard Error Logged');
      console.error(error);
      console.groupEnd();
    }
  }

  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  clearErrorLogs() {
    this.errorLogs = [];
    try {
      sessionStorage.removeItem('dashboardErrorLogs');
    } catch (e) {
      console.error('Failed to clear error logs:', e);
    }
  }

  // Helper to safely execute async operations
  async safeExecute<T>(
    operation: () => Promise<T>,
    context: { widgetId?: string; operation: string }
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.logError({
        message: `Error in ${context.operation}: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
        source: 'safeExecute',
        widgetId: context.widgetId,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  // Helper to wrap functions with error handling
  wrapWithErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    context: { widgetId?: string; functionName: string }
  ): T {
    return ((...args: Parameters<T>) => {
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result instanceof Promise) {
          return result.catch((error) => {
            this.logError({
              message: `Error in ${context.functionName}: ${error instanceof Error ? error.message : String(error)}`,
              stack: error instanceof Error ? error.stack : undefined,
              source: 'wrapWithErrorHandling',
              widgetId: context.widgetId,
              timestamp: new Date().toISOString()
            });
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        this.logError({
          message: `Error in ${context.functionName}: ${error instanceof Error ? error.message : String(error)}`,
          stack: error instanceof Error ? error.stack : undefined,
          source: 'wrapWithErrorHandling',
          widgetId: context.widgetId,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    }) as T;
  }
}

// Initialize the error handler on import
const errorHandler = ErrorHandler.getInstance();

export { errorHandler, ErrorHandler };
export type { ErrorLog };