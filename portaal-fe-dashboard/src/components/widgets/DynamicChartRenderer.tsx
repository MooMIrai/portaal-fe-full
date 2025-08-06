import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { chartTemplateParser } from '../../services/chartTemplate/ChartTemplateParser';
import { LoadingSpinner, ErrorMessage } from '../common';
import { formatParametersDisplay } from '../../utils/parameterFormatters';
import { useResponsiveChart } from '../../hooks/useResponsiveChart';
import '@progress/kendo-theme-default/dist/all.css';
import './DynamicChartRenderer.css';

export interface DynamicChartData {
  data: any[];
  chart: string;
  widget?: {
    type: string;
    config?: any;
  };
}

interface DynamicChartRendererProps {
  widgetId: number;
  widgetName: string;
  data: DynamicChartData | null;
  loading?: boolean;
  error?: Error | null;
  widget?: any;
  currentFilters?: Record<string, any>;
}

export const DynamicChartRenderer: React.FC<DynamicChartRendererProps> = ({
  widgetId,
  widgetName,
  data,
  loading,
  error,
  widget,
  currentFilters
}) => {
  const [renderError, setRenderError] = useState<Error | null>(null);
  
  // Use responsive chart hook
  const { deviceInfo, getChartHeight } = useResponsiveChart();

  // Parse and render the chart with responsive configuration
  const chartElement = useMemo(() => {
    if (!data?.chart || !data?.data) {
      return null;
    }

    try {
      setRenderError(null);
      // Pass device info to the chart parser for responsive rendering
      const element = chartTemplateParser.parse(data.chart, {
        ...data,
        responsive: {
          isMobile: deviceInfo.isMobile,
          isTablet: deviceInfo.isTablet,
          isDesktop: deviceInfo.isDesktop,
          width: deviceInfo.width,
          height: getChartHeight()
        }
      });
      return element;
    } catch (err) {
      console.error(`Error rendering chart for widget ${widgetId}:`, err);
      setRenderError(err as Error);
      return null;
    }
  }, [data, widgetId, deviceInfo, getChartHeight]);

  // Loading state
  if (loading) {
    return (
      <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardBody className="flex items-center justify-center" style={{ flex: 1 }}>
          <LoadingSpinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  // Error state
  const displayError = error || renderError;
  if (displayError) {
    return (
      <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardBody className="flex items-center justify-center" style={{ flex: 1 }}>
          <ErrorMessage
            title="Errore nel caricamento del grafico"
            message={displayError.message}
            variant="error"
          />
        </CardBody>
      </Card>
    );
  }

  // No data state
  if (!data || !chartElement) {
    return (
      <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardBody className="flex items-center justify-center" style={{ flex: 1 }}>
          <div className="text-gray-500">Nessun dato disponibile</div>
        </CardBody>
      </Card>
    );
  }

  // Format parameters for display
  const formattedParameters = widget && currentFilters 
    ? formatParametersDisplay(currentFilters, widget.parameters) 
    : null;

  // Render the dynamic chart
  return (
    <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader className="bg-gray-50" style={{ flexShrink: 0, padding: '12px 16px' }}>
        <h3 className="text-lg font-semibold">{widgetName}</h3>
        {formattedParameters && (
          <div className="text-sm text-gray-600 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody style={{ flex: 1, minHeight: 0, padding: deviceInfo.isMobile ? '8px' : '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div 
          style={{ 
            flex: 1, 
            width: '100%', 
            height: '100%', 
            minHeight: `${getChartHeight()}px`,
            maxHeight: deviceInfo.isMobile ? '300px' : '100%'
          }} 
          className="dynamic-chart-wrapper"
        >
          {chartElement || <div>Chart element is null</div>}
        </div>
      </CardBody>
    </Card>
  );
};

// Error boundary specific for chart rendering
export class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; widgetId: number },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; widgetId: number }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Chart rendering error for widget ${this.props.widgetId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card style={{ width: '100%', height: '100%' }}>
          <CardBody className="flex items-center justify-center">
            <ErrorMessage
              title="Errore di rendering"
              message={this.state.error?.message || 'Si è verificato un errore durante il rendering del grafico'}
              variant="error"
            />
          </CardBody>
        </Card>
      );
    }

    return this.props.children;
  }
}