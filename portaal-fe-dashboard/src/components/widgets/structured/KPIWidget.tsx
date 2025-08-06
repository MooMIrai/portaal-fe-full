import React, { useMemo, useRef } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartOptions, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WidgetProps } from '../../../types/widgetConfig.types';
import { KPIConfig } from '../../../types/widgetConfig.types';

// Register Chart.js components for sparkline
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface KPIData {
  current: number;
  previous?: number;
  target?: number;
  trend?: Array<{ month: string; value: number; }>;
}

export const KPIWidget: React.FC<WidgetProps<KPIConfig>> = ({ data, config, computed }) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const kpiData = data as unknown as KPIData;
  
  const percentageChange = useMemo(() => {
    if (!kpiData.previous || kpiData.previous === 0) return 0;
    return ((kpiData.current - kpiData.previous) / kpiData.previous) * 100;
  }, [kpiData.current, kpiData.previous]);
  
  const percentageOfTarget = useMemo(() => {
    if (!kpiData.target || kpiData.target === 0) return 0;
    return (kpiData.current / kpiData.target) * 100;
  }, [kpiData.current, kpiData.target]);
  
  const formatValue = (value: number, format: string = config.format || '{0}') => {
    // Simple format implementation
    if (format.includes('€')) {
      return format.replace('{0:n0}', value.toLocaleString('it-IT'));
    }
    if (format.includes('%')) {
      return format.replace('{0:+0.0%}', `${value > 0 ? '+' : ''}${value.toFixed(1)}%`);
    }
    return format.replace('{0}', value.toString());
  };
  
  const trendColor = percentageChange >= 0 ? config.trend?.positiveColor || '#27ae60' : config.trend?.negativeColor || '#e74c3c';
  
  // Sparkline data and options
  const sparklineData: ChartData<'line'> = {
    labels: kpiData.trend?.map(t => t.month) || [],
    datasets: [{
      data: kpiData.trend?.map(t => t.value) || [],
      borderColor: config.sparkline?.color || '#3498db',
      backgroundColor: config.sparkline?.type === 'area' 
        ? `${config.sparkline?.color || '#3498db'}33` 
        : 'transparent',
      borderWidth: 2,
      fill: config.sparkline?.type === 'area',
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 0,
    }]
  };

  const sparklineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      }
    }
  };
  
  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50 px-4 py-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {config.icon && <i className={config.icon} />}
          {config.title}
        </h3>
      </CardHeader>
      <CardBody className="p-4">
        <div className="flex flex-col h-full">
          {/* Main Value */}
          <div className="flex-1">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {formatValue(kpiData.current)}
            </div>
            
            {/* Trend */}
            {kpiData.previous !== undefined && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">vs periodo precedente:</span>
                <span className={`text-lg font-semibold`} style={{ color: trendColor }}>
                  {percentageChange > 0 && '↑'}
                  {percentageChange < 0 && '↓'}
                  {percentageChange === 0 && '→'}
                  {Math.abs(percentageChange).toFixed(1)}%
                </span>
              </div>
            )}
            
            {/* Target Comparison */}
            {kpiData.target !== undefined && config.comparison && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{config.comparison.label || 'Obiettivo'}</span>
                  <span className="text-sm font-medium">
                    {formatValue(percentageOfTarget, config.comparison.format || '{0:0%}')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentageOfTarget, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Sparkline */}
          {kpiData.trend && kpiData.trend.length > 0 && config.sparkline && (
            <div className="h-16 -mx-4 -mb-4">
              <Line ref={chartRef} data={sparklineData} options={sparklineOptions} />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};