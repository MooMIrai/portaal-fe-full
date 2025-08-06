import React, { useRef } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WidgetProps } from '../../../types/widgetConfig.types';
import { LineConfig } from '../../../types/widgetConfig.types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const LineWidget: React.FC<WidgetProps<LineConfig>> = ({ data, config }) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Handle multiple value fields
  const valueFields = Array.isArray(config.valueField) ? config.valueField : [config.valueField];
  const colors = Array.isArray(config.color) ? config.color : [config.color || '#2ecc71'];
  
  // Extract categories
  const categories = data.map((item: any) => item[config.categoryField || 'category']);
  
  // Prepare data for Chart.js
  const chartJSData: ChartData<'line'> = {
    labels: categories,
    datasets: valueFields.map((field, index) => ({
      label: config.legend?.labels?.[index] || field,
      data: data.map((item: any) => item[field]),
      borderColor: colors[index] || colors[0],
      backgroundColor: 'transparent',
      tension: config.smooth ? 0.4 : 0,
      pointRadius: config.showDataPoints ? 4 : 0,
      pointHoverRadius: config.showDataPoints ? 6 : 0,
      borderWidth: 2,
    }))
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.legend?.visible !== false && valueFields.length > 1,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: config.showGridLines !== false,
        },
      },
      y: {
        grid: {
          display: config.showGridLines !== false,
        },
        ticks: {
          callback: function(value) {
            if (config.valueFormat) {
              return config.valueFormat.replace('{0}', value);
            }
            return value;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
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
        <div style={{ height: '100%', position: 'relative' }}>
          <Line ref={chartRef} data={chartJSData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};