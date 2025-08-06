import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Widget, WidgetData } from '../types/widget.types';
import { DashboardUserConfig, WidgetOrderUpdate } from '../types/dashboard.types';
import dashboardApi from '../services/api/dashboardApi';
import { dashboardConfig } from '../config/dashboard.config';

interface DashboardContextValue {
  // Widget state
  widgets: Widget[];
  widgetData: Record<number, WidgetData>;
  userConfigs: Record<number, DashboardUserConfig>;
  
  // Loading states
  isLoadingWidgets: boolean;
  loadingWidgetData: Record<number, boolean>;
  widgetErrors: Record<number, Error | null>;
  
  // Actions
  loadWidgets: () => Promise<void>;
  loadWidgetData: (widgetId: number, parameters?: Record<string, any>) => Promise<void>;
  refreshWidget: (widgetId: number) => Promise<void>;
  updateWidgetOrder: (updates: WidgetOrderUpdate[]) => Promise<void>;
  toggleWidgetVisibility: (widgetId: number, isHidden: boolean) => Promise<void>;
  saveWidgetConfig: (widgetId: number, config: Partial<DashboardUserConfig>) => Promise<void>;
  
  // Auto-refresh
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: (enabled: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const useDashboard = (): DashboardContextValue => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  // Widget state
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetData, setWidgetData] = useState<Record<number, WidgetData>>({});
  const [userConfigs, setUserConfigs] = useState<Record<number, DashboardUserConfig>>({});
  
  // Loading states
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);
  const [loadingWidgetData, setLoadingWidgetData] = useState<Record<number, boolean>>({});
  const [widgetErrors, setWidgetErrors] = useState<Record<number, Error | null>>({});
  
  // Auto-refresh state
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(dashboardConfig.refresh.defaultInterval);
  
  // Current filters for each widget
  const [widgetFilters, setWidgetFilters] = useState<Record<number, Record<string, any>>>({});

  // Load available widgets
  const loadWidgets = useCallback(async () => {
    setIsLoadingWidgets(true);
    try {
      // Skip loading if no auth token
      const authService = (await import('../services/auth/authService')).default;
      const token = authService.getToken();
      
      if (!token) {
        setIsLoadingWidgets(false);
        return;
      }
      
      const availableWidgets = await dashboardApi.getAvailableWidgets();
      
      setWidgets(availableWidgets);
      
      // No user configs for now - endpoint doesn't exist
      setUserConfigs({});
      
      // Don't load widget data automatically - let each widget load when ready
      // This is because widgets may need specific parameters that we don't have yet
    } catch (error) {
      console.error('Error loading widgets:', error);
    } finally {
      setIsLoadingWidgets(false);
    }
  }, []);

  // Load data for a specific widget
  const loadWidgetData = useCallback(async (
    widgetId: number,
    parameters?: Record<string, any>
  ) => {
    setLoadingWidgetData(prev => ({ ...prev, [widgetId]: true }));
    setWidgetErrors(prev => ({ ...prev, [widgetId]: null }));
    
    try {
      const widget = widgets.find(w => w.id === widgetId);
      if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
      }
      
      // Merge default parameters with provided ones
      // Build parameters from widget definition
      const defaultParams: Record<string, any> = {};
      widget.parameters?.forEach(param => {
        if (param.default_value) {
          defaultParams[param.name] = param.default_value;
        }
      });
      
      const mergedParameters = {
        ...defaultParams,
        ...userConfigs[widgetId]?.customParameters,
        ...parameters
      };
      
      // Save current filters if parameters were provided
      if (parameters && Object.keys(parameters).length > 0) {
        setWidgetFilters(prev => ({ ...prev, [widgetId]: parameters }));
      }
      
      console.log(`Loading widget ${widgetId} with parameters:`, mergedParameters);
      
      const data = await dashboardApi.getWidgetData(widgetId, mergedParameters);
      setWidgetData(prev => ({ ...prev, [widgetId]: data }));
    } catch (error) {
      console.error(`Error loading widget data for widget ${widgetId}:`, error);
      setWidgetErrors(prev => ({ ...prev, [widgetId]: error as Error }));
    } finally {
      setLoadingWidgetData(prev => ({ ...prev, [widgetId]: false }));
    }
  }, [widgets, userConfigs]);

  // Refresh a specific widget
  const refreshWidget = useCallback(async (widgetId: number) => {
    await loadWidgetData(widgetId);
  }, [loadWidgetData]);

  // Update widget order
  const updateWidgetOrder = useCallback(async (updates: WidgetOrderUpdate[]) => {
    try {
      await dashboardApi.updateWidgetOrder(updates);
      
      // Update local configs
      updates.forEach(update => {
        setUserConfigs(prev => ({
          ...prev,
          [update.widgetId]: {
            ...prev[update.widgetId],
            position: update.position
          }
        }));
      });
    } catch (error) {
      console.error('Error updating widget order:', error);
      throw error;
    }
  }, []);

  // Toggle widget visibility
  const toggleWidgetVisibility = useCallback(async (widgetId: number, isHidden: boolean) => {
    try {
      await dashboardApi.toggleWidgetVisibility(widgetId, isHidden);
      
      setUserConfigs(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          isHidden
        }
      }));
      
      // Load data if widget is now visible
      if (!isHidden && !widgetData[widgetId]) {
        await loadWidgetData(widgetId);
      }
    } catch (error) {
      console.error(`Error toggling widget visibility for widget ${widgetId}:`, error);
      throw error;
    }
  }, [widgetData, loadWidgetData]);

  // Save widget configuration
  const saveWidgetConfig = useCallback(async (
    widgetId: number,
    config: Partial<DashboardUserConfig>
  ) => {
    try {
      await dashboardApi.saveUserPreferences(widgetId, config);
      
      setUserConfigs(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          ...config
        }
      }));
      
      // Reload widget data if parameters changed
      if (config.customParameters) {
        await loadWidgetData(widgetId);
      }
    } catch (error) {
      console.error(`Error saving widget config for widget ${widgetId}:`, error);
      throw error;
    }
  }, [loadWidgetData]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefreshEnabled || refreshInterval <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const visibleWidgets = widgets.filter(
        widget => !userConfigs[widget.id]?.isHidden
      );
      
      Promise.all(
        visibleWidgets.map(widget => 
          // Pass the saved filters for each widget during refresh
          loadWidgetData(widget.id, widgetFilters[widget.id] || {})
        )
      );
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, refreshInterval, widgets, userConfigs, loadWidgetData, widgetFilters]);

  // Initial load
  useEffect(() => {
    loadWidgets();
  }, [loadWidgets]);

  const value: DashboardContextValue = {
    widgets,
    widgetData,
    userConfigs,
    isLoadingWidgets,
    loadingWidgetData,
    widgetErrors,
    loadWidgets,
    loadWidgetData,
    refreshWidget,
    updateWidgetOrder,
    toggleWidgetVisibility,
    saveWidgetConfig,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
    refreshInterval,
    setRefreshInterval
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;