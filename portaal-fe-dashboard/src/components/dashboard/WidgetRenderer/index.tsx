import React from 'react';
import { Widget, WidgetData, DashboardWidgetType } from '../../../types/widget.types';
import { DashboardUserConfig } from '../../../types/dashboard.types';
import { EmptyState, EmptyStateIcons } from '../../common';
import { WidgetErrorBoundary } from '../../common/WidgetErrorBoundary';
import { AsyncBoundaryWrapper } from '../../common/AsyncErrorBoundary';
import { debugLogger } from '../../../utils/debugLogger';

// Import widget components
import { KPICard } from '../../widgets/KPICard';
import { LineChart } from '../../widgets/LineChart';
import { BarChart } from '../../widgets/BarChart';
import { PieChart } from '../../widgets/PieChart';
import { DonutChart } from '../../widgets/DonutChart';
import { AreaChart } from '../../widgets/AreaChart';
import { Table } from '../../widgets/Table';
import { Gauge } from '../../widgets/Gauge';
import { DynamicChartRenderer, ChartErrorBoundary } from '../../widgets/DynamicChartRenderer';
import { LegacyHtmlChartWidget } from '../../widgets/LegacyHtmlChartWidget';
import { DeclarativeChartWidget } from '../../widgets/DeclarativeChartWidget';
import { ProblematicWidgetAdapter } from '../../widgets/charts';

interface WidgetRendererProps {
  widget: Widget;
  data?: WidgetData;
  config?: DashboardUserConfig;
  currentFilters?: Record<string, any>;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  data,
  config,
  currentFilters
}) => {
  debugLogger.debug('WidgetRenderer', `Rendering widget ${widget.id} - ${widget.name}`, { 
    widgetType: widget.widgetType,
    hasData: !!data,
    dataType: data ? typeof data : 'undefined'
  }, widget.id.toString());
  if (!data) {
    return (
      <EmptyState
        icon={EmptyStateIcons.NoData}
        title="Nessun dato disponibile"
        description="I dati per questo widget non sono ancora disponibili."
      />
    );
  }

  const renderWidget = () => {
    // Special handling for problematic widgets 14 and 16
    if ((widget.id === 14 || widget.id === 16) && data.chart && typeof data.chart === 'string') {
      debugLogger.info('WidgetRenderer', `Using ProblematicWidgetAdapter for widget ${widget.id}`, {
        widgetId: widget.id,
        widgetName: widget.name
      });
      return (
        <ProblematicWidgetAdapter
          widgetId={widget.id}
          widgetName={widget.name}
          htmlContent={data.chart}
          data={data}
        />
      );
    }

    // First, check if data has the new declarative format
    const chartData = data as any;
    if (chartData.chartType && chartData.chartData) {
      debugLogger.info('WidgetRenderer', 'Using new declarative chart format', {
        widgetId: widget.id,
        chartType: chartData.chartType
      });
      return (
        <DeclarativeChartWidget
          widget={widget}
          data={data}
          loading={false}
          error={null}
          currentFilters={currentFilters}
        />
      );
    }

    // Check if data contains HTML chart content (legacy format)
    if (data.chart && typeof data.chart === 'string' && data.chart.includes('<canvas')) {
      debugLogger.info('WidgetRenderer', 'Detected legacy HTML chart content with canvas', null, widget.id.toString());
      // Try to use DeclarativeChartWidget first, it will handle legacy data transformation
      return (
        <DeclarativeChartWidget
          widget={widget}
          data={data}
          loading={false}
          error={null}
          currentFilters={currentFilters}
        />
      );
    }
    
    // Check if data contains the new chart template format (XML-based)
    if (data.chart && typeof data.chart === 'string') {
      debugLogger.info('WidgetRenderer', 'Detected template-based chart content', null, widget.id.toString());
      // Use dynamic renderer for template-based charts
      return (
        <ChartErrorBoundary widgetId={widget.id}>
          <DynamicChartRenderer
            widgetId={widget.id}
            widgetName={widget.name}
            data={data}
            loading={false}
            error={null}
            widget={widget}
            currentFilters={currentFilters}
          />
        </ChartErrorBoundary>
      );
    }

    // Fall back to traditional widget components
    const widgetProps = {
      widget,
      data,
      loading: false,
      error: null,
      currentFilters
    };

    debugLogger.debug('WidgetRenderer', `Using traditional widget component for type: ${widget.widgetType}`, null, widget.id.toString());
    
    switch (widget.widgetType) {
      case DashboardWidgetType.KPI_CARD:
        return <KPICard {...widgetProps} />;

      case DashboardWidgetType.CHART_LINE:
        return <LineChart {...widgetProps} />;

      case DashboardWidgetType.CHART_BAR:
        return <BarChart {...widgetProps} />;

      case DashboardWidgetType.CHART_PIE:
        return <PieChart {...widgetProps} />;

      case DashboardWidgetType.CHART_DONUT:
        return <DonutChart {...widgetProps} />;

      case DashboardWidgetType.CHART_AREA:
        return <AreaChart {...widgetProps} />;

      case DashboardWidgetType.TABLE:
        return <Table {...widgetProps} />;

      case DashboardWidgetType.GAUGE:
        return <Gauge {...widgetProps} />;

      default:
        return (
          <EmptyState
            icon={EmptyStateIcons.Error}
            title="Tipo widget non supportato"
            description={`Il tipo di widget "${widget.widgetType}" non è ancora supportato.`}
          />
        );
    }
  };

  return (
    <div className="widget-renderer">
      <AsyncBoundaryWrapper 
        widgetId={widget.id.toString()} 
        widgetName={widget.name}
        maxRetries={3}
        retryDelay={1000}
        onError={(error, errorInfo) => {
          debugLogger.critical('WidgetRenderer', `Widget ${widget.id} (${widget.name}) crashed at render level`, {
            error: error.toString(),
            errorInfo
          }, widget.id.toString());
          console.error(`Widget ${widget.id} (${widget.name}) crashed:`, error);
        }}
      >
        {renderWidget()}
      </AsyncBoundaryWrapper>
    </div>
  );
};