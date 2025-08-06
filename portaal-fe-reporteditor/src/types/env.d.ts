/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    // API Configuration
    REACT_APP_API_BASE_URL: string;
    REACT_APP_TENANT: string;

    // Feature Flags
    REACT_APP_ENABLE_EXPORT: string;
    REACT_APP_ENABLE_WIDGET_CUSTOMIZATION: string;
    REACT_APP_ENABLE_REALTIME_UPDATES: string;

    // Refresh Intervals
    REACT_APP_DEFAULT_REFRESH_INTERVAL: string;
    REACT_APP_MIN_REFRESH_INTERVAL: string;

    // Widget Limits
    REACT_APP_MAX_WIDGETS_PER_DASHBOARD: string;
    REACT_APP_MAX_CHART_DATA_POINTS: string;

    // Development Settings
    REACT_APP_DEBUG_MODE: string;
    REACT_APP_LOG_API_CALLS: string;

    // Node environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}