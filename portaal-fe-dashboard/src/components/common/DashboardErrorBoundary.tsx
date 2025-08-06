import React, { Component, ErrorInfo, ReactNode } from 'react';
import { debugLogger } from '../../utils/debugLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    debugLogger.critical('DashboardErrorBoundary', 'DASHBOARD LEVEL ERROR - Entire dashboard crashed!', {
      error: error.toString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorCount: this.state.errorCount
    });
    
    console.error('Dashboard Error Boundary caught an error:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Increment error count
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }));

    // Store error in sessionStorage for debugging
    try {
      const errors = JSON.parse(sessionStorage.getItem('dashboardErrors') || '[]');
      errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        componentStack: errorInfo.componentStack
      });
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.shift();
      }
      sessionStorage.setItem('dashboardErrors', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to store error in sessionStorage:', e);
    }
  }

  handleReset = () => {
    debugLogger.info('DashboardErrorBoundary', `Attempting dashboard reset (error count: ${this.state.errorCount})`);
    
    this.setState({ 
      hasError: false, 
      error: undefined 
    });
    // Reload the page if too many errors
    if (this.state.errorCount > 5) {
      debugLogger.warn('DashboardErrorBoundary', 'Too many errors, forcing page reload');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">
              Si è verificato un errore
            </h2>
            
            <p className="mt-2 text-sm text-center text-gray-600">
              La dashboard ha riscontrato un problema imprevisto. 
              Puoi provare a ricaricare la pagina o contattare il supporto se il problema persiste.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Riprova
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Ricarica la pagina
              </button>
            </div>

            {/* Error details for developers */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Dettagli errore (solo sviluppo)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {this.state.errorCount > 3 && (
              <p className="mt-4 text-xs text-center text-orange-600">
                Errori multipli rilevati ({this.state.errorCount}). 
                Considera di ricaricare la pagina.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}