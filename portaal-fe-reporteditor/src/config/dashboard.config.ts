// Dashboard configuration based on environment variables
export const dashboardConfig = {
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3334/api/v1',
    tenant: process.env.REACT_APP_TENANT || 'NEXA',
  },
  
  features: {
    export: process.env.REACT_APP_ENABLE_EXPORT === 'true',
    widgetCustomization: process.env.REACT_APP_ENABLE_WIDGET_CUSTOMIZATION === 'true',
    realtimeUpdates: process.env.REACT_APP_ENABLE_REALTIME_UPDATES === 'true',
  },
  
  refresh: {
    defaultInterval: parseInt(process.env.REACT_APP_DEFAULT_REFRESH_INTERVAL || '300', 10),
    minInterval: parseInt(process.env.REACT_APP_MIN_REFRESH_INTERVAL || '30', 10),
  },
  
  limits: {
    maxWidgetsPerDashboard: parseInt(process.env.REACT_APP_MAX_WIDGETS_PER_DASHBOARD || '20', 10),
    maxChartDataPoints: parseInt(process.env.REACT_APP_MAX_CHART_DATA_POINTS || '100', 10),
  },
  
  debug: {
    enabled: process.env.REACT_APP_DEBUG_MODE === 'true',
    logApiCalls: process.env.REACT_APP_LOG_API_CALLS === 'true',
  },
} as const;

// Export type for use in components
export type DashboardConfig = typeof dashboardConfig;