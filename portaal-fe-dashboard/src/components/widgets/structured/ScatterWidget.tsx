import React, { useRef } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, LinearScale, PointElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { WidgetProps, ScatterConfig } from '../../../types/widgetConfig.types';

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, Title, Tooltip, Legend);

export const ScatterWidget: React.FC<WidgetProps<ScatterConfig>> = ({ data, config, computed }) => {
  const chartRef = useRef<ChartJS<'scatter'>>(null);
  
  // Group data by color field if specified
  const groupedData = config.colorField 
    ? data.reduce((acc, item) => {
        const key = item[config.colorField!] || 'Default';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>)
    : { 'Data': data };

  // Default colors palette
  const defaultColors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
  ];

  // Prepare datasets for Chart.js
  const datasets = Object.entries(groupedData).map(([label, items], index) => ({
    label,
    data: items.map(item => ({
      x: item[config.xField],
      y: item[config.yField],
      r: config.sizeField ? Math.sqrt(item[config.sizeField]) * 5 : 5
    })),
    backgroundColor: defaultColors[index % defaultColors.length] + '80', // Add transparency
    borderColor: defaultColors[index % defaultColors.length],
    borderWidth: 1,
  }));

  // Chart data
  const chartData: ChartData<'scatter'> = {
    datasets
  };

  // Chart options
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.showLegend !== false && Object.keys(groupedData).length > 1,
        position: config.legendPosition || 'bottom',
      },
      tooltip: {
        enabled: config.showTooltip !== false,
        callbacks: {
          label: (context) => {
            const point = context.raw as any;
            const dataItem = data[context.dataIndex];
            let label = `${config.xAxis?.title || config.xField}: ${point.x}, ${config.yAxis?.title || config.yField}: ${point.y}`;
            
            if (config.sizeField && dataItem[config.sizeField]) {
              label += `, ${config.sizeField}: ${dataItem[config.sizeField]}`;
            }
            
            if (config.tooltipFormat) {
              // Simple template replacement
              return config.tooltipFormat
                .replace('{x}', point.x)
                .replace('{y}', point.y)
                .replace('{' + config.xField + '}', point.x)
                .replace('{' + config.yField + '}', point.y);
            }
            
            return label;
          }
        }
      },
      title: {
        display: !!config.title,
        text: config.title,
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: !!config.xAxis?.title,
          text: config.xAxis?.title || config.xField,
        },
        min: config.xAxis?.min,
        max: config.xAxis?.max,
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: !!config.yAxis?.title,
          text: config.yAxis?.title || config.yField,
        },
        min: config.yAxis?.min,
        max: config.yAxis?.max,
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
    <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader className="bg-gray-50" style={{ flexShrink: 0, padding: '12px 16px' }}>
        <h3 className="text-lg font-semibold">{config.title}</h3>
        {config.description && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
      </CardHeader>
      <CardBody style={{ flex: 1, minHeight: 0, padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}>
          <Scatter ref={chartRef} data={chartData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};