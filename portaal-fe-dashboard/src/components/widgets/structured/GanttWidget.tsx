import React, { useMemo } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { GanttConfig, ComputedData, isGanttConfig } from '../../../types/widgetConfig.types';
import { Widget } from '../../../types/widget.types';

interface GanttWidgetProps {
  widget: Widget;
  data: any[];
  config: GanttConfig;
  computed?: ComputedData;
  metadata?: any;
  currentFilters?: Record<string, any>;
}

export const GanttWidget: React.FC<GanttWidgetProps> = ({
  widget,
  data,
  config,
  computed,
  metadata,
  currentFilters
}) => {
  // Validate config
  if (!isGanttConfig(config)) {
    console.error('Invalid gantt configuration', config);
    return <div>Configurazione widget non valida</div>;
  }

  // Format parameters display
  const formattedParameters = useMemo(() => {
    if (!currentFilters || Object.keys(currentFilters).length === 0) {
      return null;
    }
    
    return Object.entries(currentFilters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
  }, [currentFilters]);

  return (
    <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader className="bg-gray-50" style={{ flexShrink: 0, padding: '12px 16px' }}>
        <h3 className="text-lg font-semibold">{config.title || widget.name}</h3>
        {config.description && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
        {formattedParameters && (
          <div className="text-sm text-gray-500 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody style={{ flex: 1, minHeight: 0, padding: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Gantt Chart non ancora supportato con Chart.js</p>
            <p className="text-sm text-gray-500">
              I grafici Gantt richiedono una libreria specializzata. 
              Considerare l'uso di librerie come gantt-chart-react o simili.
            </p>
          </div>
        </div>
        
        {computed?.summary && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
            <div className="grid grid-cols-3 gap-4">
              {computed.summary.totalItems && (
                <div>
                  <span className="text-gray-600">Totale attività:</span>
                  <span className="ml-2 font-semibold">{computed.summary.totalItems}</span>
                </div>
              )}
              {metadata?.lastUpdated && (
                <div>
                  <span className="text-gray-600">Ultimo aggiornamento:</span>
                  <span className="ml-2 font-semibold">
                    {new Date(metadata.lastUpdated).toLocaleString('it-IT')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};