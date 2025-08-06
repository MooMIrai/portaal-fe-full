import React, { useMemo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Widget } from '../../../types/widget.types';
import { DashboardUserConfig } from '../../../types/dashboard.types';
import { useDashboard } from '../../../contexts/DashboardContext';
import { useStructuredWidgetData } from '../../../hooks/useStructuredWidgetData';
import { WidgetHeader } from '../WidgetHeader';
import { WidgetRenderer } from '../WidgetRenderer';
import { StructuredWidgetRenderer } from '../WidgetRenderer/StructuredWidgetRenderer';
import { LoadingSpinner, ErrorMessage } from '../../common';
import './styles.css';

interface EnhancedWidgetContainerProps {
  widget: Widget;
  userConfig?: DashboardUserConfig;
}

export const EnhancedWidgetContainer: React.FC<EnhancedWidgetContainerProps> = ({
  widget,
  userConfig
}) => {
  const {
    widgetData,
    loadingWidgetData,
    widgetErrors,
    loadWidgetData,
    refreshWidget,
    toggleWidgetVisibility,
    saveWidgetConfig
  } = useDashboard();
  
  // Check if widget uses structured data format
  const useStructuredFormat = widget.config?.useStructuredFormat || false;
  
  // Initialize filters with default values from widget parameters
  const defaultFilters = useMemo(() => {
    // Try to load saved filters from localStorage
    const storageKey = `widget_filters_${widget.id}`;
    const savedFilters = localStorage.getItem(storageKey);
    
    if (savedFilters) {
      try {
        return JSON.parse(savedFilters);
      } catch (e) {
        console.error('Error parsing saved filters:', e);
      }
    }
    
    // If no saved filters, use default values
    const defaults: Record<string, any> = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    
    widget.parameters?.forEach(param => {
      // Check if parameter is ANNO (year) or MESE (month)
      if (param.name === 'ANNO') {
        defaults[param.name] = param.default_value ?? currentYear;
      } else if (param.name === 'MESE') {
        defaults[param.name] = param.default_value ?? currentMonth;
      } else if (param.default_value !== null && param.default_value !== undefined) {
        defaults[param.name] = param.default_value;
      }
    });
    return defaults;
  }, [widget.parameters, widget.id]);
  
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>(defaultFilters);

  // Use structured data hook if enabled
  const structuredDataResult = useStructuredWidgetData(
    useStructuredFormat ? widget : null,
    currentFilters
  );

  // Determine which data source to use
  const isLoading = useStructuredFormat 
    ? structuredDataResult.loading 
    : loadingWidgetData[widget.id];
    
  const error = useStructuredFormat 
    ? structuredDataResult.error 
    : widgetErrors[widget.id];
    
  const data = useStructuredFormat 
    ? structuredDataResult.data 
    : widgetData[widget.id];
  
  // Save default filters to localStorage if they haven't been saved yet
  useEffect(() => {
    const storageKey = `widget_filters_${widget.id}`;
    const savedFilters = localStorage.getItem(storageKey);
    
    // If no saved filters exist and we have default filters with values, save them
    if (!savedFilters && Object.keys(defaultFilters).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(defaultFilters));
    }
  }, [widget.id, defaultFilters]);
  
  // Load widget data on mount or when filters change (only for old format)
  useEffect(() => {
    if (!useStructuredFormat && !data && !isLoading && !error) {
      loadWidgetData(widget.id, currentFilters);
    }
  }, [widget.id, data, isLoading, error, loadWidgetData, currentFilters, useStructuredFormat]);

  const containerClasses = useMemo(() => {
    const sizeClass = userConfig?.size || widget.config.defaultSize || 'normal';
    return clsx(
      'widget-container',
      'bg-white',
      'rounded-lg',
      'shadow-sm',
      'overflow-hidden',
      'transition-all',
      'duration-300',
      {
        'widget-container--normal': sizeClass === 'normal',
        'widget-container--wide': sizeClass === 'wide',
        'widget-container--full': sizeClass === 'full',
        'widget-container--loading': isLoading,
        'widget-container--error': error
      }
    );
  }, [widget.config.defaultSize, userConfig?.size, isLoading, error]);

  const handleRefresh = () => {
    if (useStructuredFormat) {
      structuredDataResult.refetch();
    } else {
      loadWidgetData(widget.id, currentFilters);
    }
  };

  const handleHide = () => {
    toggleWidgetVisibility(widget.id, true);
  };

  const handleExport = async () => {
    // Export functionality will be implemented in Phase 6
    console.log('Export widget:', widget.id);
  };

  const handleCustomize = () => {
    // Customization dialog will be implemented in Phase 5
    console.log('Customize widget:', widget.id);
  };
  
  const handleFilterApply = (filters: Record<string, any>) => {
    setCurrentFilters(filters);
    // Save filters to localStorage
    const storageKey = `widget_filters_${widget.id}`;
    localStorage.setItem(storageKey, JSON.stringify(filters));
    
    if (useStructuredFormat) {
      // Structured format will refetch automatically due to dependency on currentFilters
    } else {
      loadWidgetData(widget.id, filters);
    }
  };
  
  const handleFilterReset = () => {
    setCurrentFilters({});
    // Remove saved filters from localStorage
    const storageKey = `widget_filters_${widget.id}`;
    localStorage.removeItem(storageKey);
    
    if (useStructuredFormat) {
      // Structured format will refetch automatically
    } else {
      loadWidgetData(widget.id, {});
    }
  };

  return (
    <div className={containerClasses}>
      <WidgetHeader
        widget={widget}
        onRefresh={handleRefresh}
        onHide={handleHide}
        onExport={handleExport}
        onCustomize={handleCustomize}
        onFilterApply={handleFilterApply}
        onFilterReset={handleFilterReset}
        currentFilters={currentFilters}
        isLoading={isLoading}
      />

      <div className="widget-container__body p-4">
        {error ? (
          <ErrorMessage
            title="Errore nel caricamento"
            message={error.message}
            onRetry={handleRefresh}
            variant="error"
          />
        ) : isLoading ? (
          <div className="widget-container__loading flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          useStructuredFormat ? (
            <StructuredWidgetRenderer
              widget={widget}
              data={data}
              loading={isLoading}
              error={error}
              currentFilters={currentFilters}
            />
          ) : (
            <WidgetRenderer
              widget={widget}
              data={data}
              config={userConfig}
              currentFilters={currentFilters}
            />
          )
        )}
      </div>
    </div>
  );
};