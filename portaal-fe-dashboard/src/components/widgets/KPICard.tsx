import React from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { WidgetProps } from '../../types/widget.types';
import { formatNumber } from '../../utils/formatters';
import { formatParametersDisplay } from '../../utils/parameterFormatters';

export const KPICard: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
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

  // Handle both object and array data structures
  const dataItem = Array.isArray(data?.data) ? data.data[0] : data?.data;
  
  if (!dataItem) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center">
          <div>Nessun dato disponibile</div>
        </CardBody>
      </Card>
    );
  }
  
  const config = widget.config || {};
  
  // Get value field name from config or use default
  const valueField = config.valueField || 'value';
  const value = dataItem[valueField] || 0;
  
  // Get other fields
  const label = config.label || widget.name;
  const unit = config.unit || '';
  const format = config.format || 'number';
  
  // Trend configuration
  const trendField = config.trendField || 'trend';
  const trend = dataItem[trendField];
  
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
        <div className="text-4xl font-bold text-primary">
          {formatNumber(value, format)}
          {unit && <span className="text-2xl ml-1">{unit}</span>}
        </div>
        {config.showTrend && trend !== undefined && (
          <div className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
        {config.subtitle && dataItem[config.subtitle] && (
          <div className="text-sm text-gray-600 mt-2">
            {dataItem[config.subtitle]}
          </div>
        )}
      </CardBody>
    </Card>
  );
};