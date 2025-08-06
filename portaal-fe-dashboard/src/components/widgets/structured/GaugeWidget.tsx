import React from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { RadialGauge, RadialGaugeScale, RadialGaugePointer, RadialGaugeArcGaugeScale } from '@progress/kendo-react-gauges';
import { WidgetProps } from '../../../types/widgetConfig.types';
import { GaugeConfig } from '../../../types/widgetConfig.types';

interface GaugeData {
  value: number;
  label?: string;
}

export const GaugeWidget: React.FC<WidgetProps<GaugeConfig>> = ({ data, config }) => {
  const gaugeData = data as unknown as GaugeData;
  
  // Create color ranges if provided
  const scaleRanges = config.colors?.map(color => ({
    from: color.from,
    to: color.to,
    color: color.color
  })) || [];
  
  const gaugeValue = gaugeData.value;
  const min = config.min || 0;
  const max = config.max || 100;
  
  // Calculate percentage for display
  const percentage = ((gaugeValue - min) / (max - min)) * 100;
  
  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50 px-4 py-3">
        <h3 className="text-lg font-semibold">{config.title}</h3>
      </CardHeader>
      <CardBody className="p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <div style={{ width: '100%', maxWidth: '300px', height: '200px' }}>
            <RadialGauge
              style={{ width: '100%', height: '100%' }}
              scale={{
                min: min,
                max: max,
                majorUnit: (max - min) / 5,
                minorUnit: (max - min) / 20,
                labels: {
                  visible: config.labels?.visible !== false,
                  position: config.labels?.position || 'inside',
                  format: config.format || '{0}'
                },
                majorTicks: {
                  visible: config.majorTicks?.visible !== false,
                  size: config.majorTicks?.size || 10
                },
                minorTicks: {
                  visible: true,
                  size: 5
                },
                ranges: scaleRanges,
                rangeSize: 10,
                rangePlaceholderColor: '#e8e8e8'
              }}
              pointer={[{
                value: gaugeValue,
                color: config.pointer?.color || '#34495e',
                length: 0.8,
                cap: {
                  size: 0.15,
                  color: config.pointer?.color || '#34495e'
                }
              }]}
            />
          </div>
          
          {/* Value Display */}
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-gray-800">
              {config.format ? config.format.replace('{0}', gaugeValue.toString()) : gaugeValue}
            </div>
            {gaugeData.label && (
              <div className="text-lg text-gray-600 mt-1">
                {gaugeData.label}
              </div>
            )}
          </div>
          
          {/* Progress Bar (optional visual) */}
          <div className="w-full max-w-xs mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: scaleRanges.find(r => gaugeValue >= r.from && gaugeValue <= r.to)?.color || '#3498db'
                }}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};