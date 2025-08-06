import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { debugLogger } from '../../utils/debugLogger';

interface Props {
  children: ReactNode;
  widgetId?: string;
  widgetName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details with debug logger
    debugLogger.critical('WidgetErrorBoundary', `Widget crashed: ${this.props.widgetName || 'Unknown'}`, {
      error: error.toString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      widgetName: this.props.widgetName
    }, this.props.widgetId);
    
    console.error('Widget Error Boundary caught an error:', {
      widgetId: this.props.widgetId,
      widgetName: this.props.widgetName,
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo
    });
  }

  handleReset = () => {
    debugLogger.info('WidgetErrorBoundary', `Attempting to reset widget ${this.props.widgetName}`, null, this.props.widgetId);
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
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
              
              <p className="text-sm text-gray-600 mb-4">
                Si è verificato un errore durante il rendering di questo widget. 
                Il resto della dashboard continua a funzionare normalmente.
              </p>

              {/* Retry Button */}
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
                Riprova
              </button>

              {/* Error Details (Collapsible) */}
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Mostra dettagli tecnici
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-md">
                  <div className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                    <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
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

    return this.props.children;
  }
}