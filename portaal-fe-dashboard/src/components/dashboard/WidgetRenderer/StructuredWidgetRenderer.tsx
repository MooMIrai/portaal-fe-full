import React from 'react';
import { Widget } from '../../../types/widget.types';
import { WidgetData, WidgetType } from '../../../types/widgetConfig.types';
import { EmptyState, EmptyStateIcons, LoadingSpinner, ErrorMessage } from '../../common';
import { Card, CardBody } from '@progress/kendo-react-layout';

// Import widget components
import { GanttWidget } from '../../widgets/structured/GanttWidget';
import { PieWidget } from '../../widgets/structured/PieWidget';
import { BarWidget } from '../../widgets/structured/BarWidget';
import { LineWidget } from '../../widgets/structured/LineWidget';
import { AreaWidget } from '../../widgets/structured/AreaWidget';
import { DonutWidget } from '../../widgets/structured/DonutWidget';
import { TableWidget } from '../../widgets/structured/TableWidget';
import { KPIWidget } from '../../widgets/structured/KPIWidget';
import { GaugeWidget } from '../../widgets/structured/GaugeWidget';
import { ScatterWidget } from '../../widgets/structured/ScatterWidget';
import { HeatmapWidget } from '../../widgets/structured/HeatmapWidget';
import { TimelineWidget } from '../../widgets/structured/TimelineWidget';

interface StructuredWidgetRendererProps {
  widget: Widget;
  data?: WidgetData;
  loading?: boolean;
  error?: Error | null;
  currentFilters?: Record<string, any>;
}

export const StructuredWidgetRenderer: React.FC<StructuredWidgetRendererProps> = ({
  widget,
  data,
  loading = false,
  error = null,
  currentFilters
}) => {
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
  if (error) {
    return (
      <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardBody className="flex items-center justify-center" style={{ flex: 1 }}>
          <ErrorMessage
            title="Errore nel caricamento del widget"
            message={error.message}
            variant="error"
          />
        </CardBody>
      </Card>
    );
  }

  // No data state
  if (!data) {
    return (
      <EmptyState
        icon={EmptyStateIcons.NoData}
        title="Nessun dato disponibile"
        description="I dati per questo widget non sono ancora disponibili."
      />
    );
  }

  // Render widget based on type
  const renderWidget = () => {
    const commonProps = {
      widget,
      data: data.data,
      config: data.config,
      computed: data.computed,
      metadata: data.metadata,
      currentFilters
    };

    switch (data.widgetType) {
      case WidgetType.GANTT:
        return <GanttWidget {...commonProps} />;
      
      case WidgetType.PIE:
        return <PieWidget {...commonProps} />;
      
      case WidgetType.DONUT:
        return <DonutWidget {...commonProps} />;
      
      case WidgetType.BAR:
        return <BarWidget {...commonProps} />;
      
      case WidgetType.LINE:
        return <LineWidget {...commonProps} />;
      
      case WidgetType.AREA:
        return <AreaWidget {...commonProps} />;
      
      case WidgetType.TABLE:
        return <TableWidget {...commonProps} />;
      
      case WidgetType.KPI:
        return <KPIWidget {...commonProps} />;
      
      case WidgetType.GAUGE:
        return <GaugeWidget {...commonProps} />;
      
      case WidgetType.SCATTER:
        return <ScatterWidget {...commonProps} />;
      
      case WidgetType.HEATMAP:
        return <HeatmapWidget {...commonProps} />;
      
      case WidgetType.TIMELINE:
        return <TimelineWidget {...commonProps} />;
      
      default:
        return (
          <EmptyState
            icon={EmptyStateIcons.Error}
            title="Tipo widget non supportato"
            description={`Il tipo di widget "${data.widgetType}" non è ancora supportato.`}
          />
        );
    }
  };

  return (
    <div className="structured-widget-renderer">
      {renderWidget()}
    </div>
  );
};