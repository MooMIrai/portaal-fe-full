import React from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { CircularGauge } from '@progress/kendo-react-gauges';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';

export const Gauge: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  if (loading) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center">
          <div className="k-loading-indicator k-loading-indicator-large"></div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center text-red-500">
          <div>Errore nel caricamento dei dati</div>
        </CardBody>
      </Card>
    );
  }

  const value = data?.data?.[0]?.value || 0;
  const min = widget.config?.min || 0;
  const max = widget.config?.max || 100;
  const label = widget.config?.label || widget.name;

  // Calculate color based on value ranges
  const getColor = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 33) return '#dc2626'; // red
    if (percentage < 66) return '#f59e0b'; // yellow
    return '#10b981'; // green
  };
  
  // Format parameters for display
  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50">
        <h3 className="text-lg font-semibold">
          {label}
          <span className="ml-2 text-sm text-gray-500">(ID: {widget.id})</span>
        </h3>
        {formattedParameters && (
          <div className="text-sm text-gray-600 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center">
        <CircularGauge
          value={value}
          scale={{ min, max }}
          style={{ width: '200px', height: '200px' }}
          pointer={{ color: getColor() }}
          centerTemplate={() => (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {value}
              </div>
              {widget.config?.unit && (
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {widget.config.unit}
                </div>
              )}
            </div>
          )}
        />
      </CardBody>
    </Card>
  );
};