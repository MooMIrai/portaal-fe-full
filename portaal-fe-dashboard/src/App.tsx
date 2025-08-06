import React from "react";
import Routes from 'common/Routes';
import { Dashboard } from "./pages/Dashboard/component";
import { errorHandler } from "./utils/errorHandler";
import { debugLogger } from "./utils/debugLogger";

// Dashboard-specific error boundary
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Dashboard] App error:', error, errorInfo);
    debugLogger.error('App', 'Dashboard app crashed', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-3">
              Errore Dashboard
            </h2>
            <p className="text-red-700 mb-4">
              Si è verificato un errore nel modulo Dashboard.
            </p>
            {this.state.error && (
              <pre className="bg-red-100 p-3 rounded text-xs text-red-800 overflow-auto mb-4">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Riprova
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize global error handler and debug logger
if (typeof window !== 'undefined') {
  try {
    console.log('Dashboard error handler initialized');
    debugLogger.info('App', 'Dashboard application starting');
    
    // Enable debug mode if in development or if debug flag is set
    const urlParams = new URLSearchParams(window.location.search);
    if (process.env.NODE_ENV === 'development' || urlParams.get('debug') === 'true') {
      debugLogger.enableDebugMode();
    }
  } catch (error) {
    console.error('[Dashboard] Initialization error:', error);
    // Continue anyway - app can work without these features
  }
}

const App = () => {
  return (
    <DashboardErrorBoundary>
      <Routes data={[
        {
          path: "/dashboard",
          element: <Dashboard />,
          permissions: [] // Empty array means accessible to all authenticated users
        },
        {
          path: "/dashboard/*",
          element: <Dashboard />,
          permissions: []
        }
      ]}/>
    </DashboardErrorBoundary>
  );
};

export default App;