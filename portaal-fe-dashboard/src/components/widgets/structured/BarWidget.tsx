import React, { useRef } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { WidgetProps } from '../../../types/widgetConfig.types';
import { BarConfig } from '../../../types/widgetConfig.types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarWidget: React.FC<WidgetProps<BarConfig>> = ({ data, config }) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  
  // Handle multiple value fields (for grouped bars)
  const valueFields = Array.isArray(config.valueField) ? config.valueField : [config.valueField];
  const colors = Array.isArray(config.color) ? config.color : [config.color || '#3498db'];
  
  // Extract categories
  const categories = data.map((item: any) => item[config.categoryField || 'category']);
  
  // Prepare data for Chart.js
  const chartJSData: ChartData<'bar'> = {
    labels: categories,
    datasets: valueFields.map((field, index) => ({
      label: config.legend?.labels?.[index] || field,
      data: data.map((item: any) => item[field]),
      backgroundColor: colors[index] || colors[0],
      borderColor: colors[index] || colors[0],
      borderWidth: 1,
    }))
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: config.orientation === 'horizontal' ? 'y' : 'x',
    plugins: {
      legend: {
        display: config.legend?.visible !== false && valueFields.length > 1,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
      datalabels: config.showValueLabels ? {
        display: true,
        anchor: 'end',
        align: 'end',
        formatter: (value: any) => {
          if (config.valueFormat) {
            return config.valueFormat.replace('{0}', value);
          }
          return value;
        }
      } : undefined,
    },
    scales: {
      x: {
        stacked: config.stacked,
        ticks: {
          autoSkip: false,
          maxRotation: config.orientation === 'horizontal' ? 0 : 45,
          minRotation: config.orientation === 'horizontal' ? 0 : 45,
        }
      },
      y: {
        stacked: config.stacked,
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
          <Bar ref={chartRef} data={chartJSData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};