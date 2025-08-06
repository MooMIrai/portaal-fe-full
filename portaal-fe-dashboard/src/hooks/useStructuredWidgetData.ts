import { useState, useEffect, useCallback } from 'react';
import { WidgetData } from '../types/widgetConfig.types';
import { Widget } from '../types/widget.types';
import { dashboardApi } from '../services/api/dashboardApi';

interface UseStructuredWidgetDataResult {
  data: WidgetData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useStructuredWidgetData = (
  widget: Widget,
  parameters?: Record<string, any>
): UseStructuredWidgetDataResult => {
  const [data, setData] = useState<WidgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!widget?.id) {
      setError(new Error('Widget ID is required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if widget has structured endpoint
      const endpoint = widget.config?.structuredEndpoint || 
                      `/report-operativo/${widget.widgetId}/structured`;
      
      const response = await dashboardApi.post(endpoint, {
        ...widget.defaultParameters,
        ...parameters
      });

      // Validate response structure
      if (!response.data || !response.data.widgetType) {
        throw new Error('Invalid widget data structure');
      }

      setData(response.data);
    } catch (err) {
      console.error('Error fetching structured widget data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch widget data'));
    } finally {
      setLoading(false);
    }
  }, [widget, parameters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh if configured
  useEffect(() => {
    if (widget.config?.refreshInterval && widget.config.refreshInterval > 0) {
      const interval = setInterval(fetchData, widget.config.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [widget.config?.refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};