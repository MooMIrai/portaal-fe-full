import React, { useRef } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { WidgetProps } from '../../../types/widgetConfig.types';
import { PieConfig } from '../../../types/widgetConfig.types';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieWidget: React.FC<WidgetProps<PieConfig>> = ({ data, config }) => {
  const chartRef = useRef<ChartJS<'pie'>>(null);
  
  // Default colors for pie slices
  const defaultColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
    'rgba(255, 99, 255, 0.8)',
    'rgba(99, 255, 132, 0.8)',
  ];
  
  const colors = config.colors || defaultColors;
  
  // Prepare data for Chart.js
  const chartJSData: ChartData<'pie'> = {
    labels: data.map((item: any) => item[config.categoryField || 'category']),
    datasets: [{
      data: data.map((item: any) => item[config.valueField || 'value']),
      backgroundColor: colors.slice(0, data.length),
      borderColor: colors.slice(0, data.length).map(color => color.replace('0.8', '1')),
      borderWidth: 1,
    }]
  };

  // Chart options
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.legend?.visible !== false,
        position: config.legend?.position || 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            if (config.showPercentage) {
              return `${label}: ${percentage}%`;
            }
            
            if (config.valueFormat) {
              const formattedValue = config.valueFormat.replace('{0}', value.toString());
              return `${label}: ${formattedValue} (${percentage}%)`;
            }
            
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: config.showLabels ? {
        display: true,
        color: '#fff',
        formatter: (value: any, context: any) => {
          if (config.showPercentage) {
            const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          }
          return value;
        }
      } : undefined,
    },
    onClick: (event, elements) => {
      console.log("CLICK FUNZIONA!", elements);
      // Ensure elements have options to prevent spacing error
      if (elements && elements.length > 0) {
        elements.forEach((element: any) => {
          if (element?.element && !element.element.options) {
            element.element.options = {
              spacing: 0,
              borderWidth: 1
            };
          }
        });
      }
    },
    onHover: (event, elements) => {
      console.log("HOVER FUNZIONA!", elements);
      // Ensure elements have options to prevent spacing error
      if (elements && elements.length > 0) {
        elements.forEach((element: any) => {
          if (element?.element && !element.element.options) {
            element.element.options = {
              spacing: 0,
              borderWidth: 1
            };
          }
        });
      }
    }
  };

  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50 px-4 py-3">
        <h3 className="text-lg font-semibold">{config.title}</h3>
        {config.description && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
      </CardHeader>
      <CardBody className="p-4">
        <div style={{ height: '100%', position: 'relative', minHeight: '300px' }}>
          <Pie ref={chartRef} data={chartJSData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};