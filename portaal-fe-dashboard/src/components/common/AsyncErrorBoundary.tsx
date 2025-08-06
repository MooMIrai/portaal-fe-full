import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { debugLogger } from '../../utils/debugLogger';

interface Props {
  children: ReactNode;
  widgetId?: string;
  widgetName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  retryDelay?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  isRecovering: boolean;
}

// Hook to catch async errors in functional components
export const useAsyncError = () => {
  const [error, setError] = React.useState<Error | null>(null);
  
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
  
  return setError;
};

// Enhanced error boundary with async error handling and recovery
export class AsyncErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;
  private errorCount: Map<string, number> = new Map();
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorKey = `${error.message}-${error.stack?.substring(0, 100)}`;
    const currentCount = this.errorCount.get(errorKey) || 0;
    this.errorCount.set(errorKey, currentCount + 1);
    
    debugLogger.critical('AsyncErrorBoundary', `Widget crashed: ${this.props.widgetName || 'Unknown'}`, {
      error: error.toString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      widgetName: this.props.widgetName,
      errorCount: currentCount + 1,
      retryCount: this.state.retryCount
    }, this.props.widgetId);
    
    console.error('AsyncErrorBoundary caught an error:', {
      widgetId: this.props.widgetId,
      widgetName: this.props.widgetName,
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      errorOccurrences: currentCount + 1
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });

    // Auto-retry logic with exponential backoff
    const maxRetries = this.props.maxRetries ?? 3;
    if (this.state.retryCount < maxRetries && currentCount < 5) {
      const delay = (this.props.retryDelay ?? 1000) * Math.pow(2, this.state.retryCount);
      
      debugLogger.info('AsyncErrorBoundary', 
        `Scheduling auto-retry ${this.state.retryCount + 1}/${maxRetries} in ${delay}ms`, 
        null, this.props.widgetId);
      
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, delay);
    } else if (currentCount >= 5) {
      debugLogger.critical('AsyncErrorBoundary', 
        `Widget ${this.props.widgetName} has failed ${currentCount} times. Disabling auto-retry.`, 
        null, this.props.widgetId);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleReset = () => {
    debugLogger.info('AsyncErrorBoundary', `Manual reset for widget ${this.props.widgetName}`, null, this.props.widgetId);
    this.errorCount.clear();
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined, 
      retryCount: 0,
      isRecovering: false 
    });
  };

  handleRetry = () => {
    debugLogger.info('AsyncErrorBoundary', `Auto-retrying widget ${this.props.widgetName}`, null, this.props.widgetId);
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
      isRecovering: true
    }));
    
    // Clear recovering state after a short delay
    setTimeout(() => {
      this.setState({ isRecovering: false });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const maxRetries = this.props.maxRetries ?? 3;
      const showRetryButton = this.state.retryCount >= maxRetries;

      // Default error UI with enhanced features
      return (
        <Card style={{ width: '100%', height: '100%', border: '2px solid #ef4444' }}>
          <CardHeader className="bg-red-50" style={{ flexShrink: 0, padding: '12px 16px' }}>
            <h3 className="text-lg font-semibold text-red-700">
              Widget Error
              {this.props.widgetName && (
                <span className="ml-2 text-sm font-normal">- {this.props.widgetName}</span>
              )}
              {this.props.widgetId && (
                <span className="ml-2 text-sm text-red-500">(ID: {this.props.widgetId})</span>
              )}
            </h3>
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
              {/* Error Icon */}
              <div className="mb-4">
                <svg 
                  className="mx-auto h-12 w-12 text-red-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Errore nel caricamento del widget
              </h4>
              
              <p className="text-sm text-gray-600 mb-2">
                Si è verificato un errore durante il rendering di questo widget. 
                Il resto della dashboard continua a funzionare normalmente.
              </p>

              {/* Retry Status */}
              {this.state.retryCount > 0 && this.state.retryCount < maxRetries && (
                <p className="text-xs text-gray-500 mb-4">
                  Tentativo di ripristino automatico {this.state.retryCount}/{maxRetries}...
                </p>
              )}

              {/* Retry Button (only shown after max retries) */}
              {showRetryButton && (
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg 
                    className="mr-2 h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  Riprova Manualmente
                </button>
              )}

              {/* Error Details (Collapsible) */}
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Mostra dettagli tecnici
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-md">
                  <div className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                    <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
                    <br />
                    <strong>Retry Count:</strong> {this.state.retryCount}/{maxRetries}
                    {this.state.error?.stack && (
                      <>
                        <br /><br />
                        <strong>Stack trace:</strong>
                        <br />
                        {this.state.error.stack}
                      </>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        <br /><br />
                        <strong>Component stack:</strong>
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </div>
                </div>
              </details>
            </div>
          </CardBody>
        </Card>
      );
    }

    // Show recovering indicator
    if (this.state.isRecovering) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="k-loading-indicator k-loading-indicator-large"></div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to handle async errors in effects
export const AsyncBoundaryWrapper: React.FC<Props> = (props) => {
  const throwAsyncError = useAsyncError();
  
  // Provide error thrower to children via context or prop
  const childrenWithErrorHandler = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as any, { 
        onAsyncError: throwAsyncError 
      });
    }
    return child;
  });
  
  return (
    <AsyncErrorBoundary {...props}>
      {childrenWithErrorHandler}
    </AsyncErrorBoundary>
  );
};