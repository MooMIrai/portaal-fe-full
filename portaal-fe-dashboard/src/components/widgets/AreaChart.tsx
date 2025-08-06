import React, { useRef } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartOptions, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';

// Register Chart.js components (including Filler for area charts)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const AreaChart: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

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

  const chartData = data?.data || [];
  const categories = chartData.map(item => item.category || item.label || '');
  const series = widget.config?.series || [{ field: 'value', name: 'Valore' }];
  
  // Format parameters for display
  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  // Default colors for series
  const defaultColors = [
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(153, 102, 255, 0.7)',
  ];

  // Prepare data for Chart.js
  const chartJSData: ChartData<'line'> = {
    labels: categories,
    datasets: series.map((s: any, index: number) => ({
      label: s.name,
      data: chartData.map(item => item[s.field] || 0),
      borderColor: s.color || defaultColors[index % defaultColors.length],
      backgroundColor: s.color || defaultColors[index % defaultColors.length],
      fill: true,
      tension: 0.3,
    }))
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: widget.config?.showLegend !== false,
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: !!widget.config?.xAxis?.title,
          text: widget.config?.xAxis?.title,
        }
      },
      y: {
        display: true,
        title: {
          display: !!widget.config?.yAxis?.title,
          text: widget.config?.yAxis?.title,
        }
      }
    }
  };

  return (
    <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader className="bg-gray-50" style={{ flexShrink: 0 }}>
        <h3 className="text-lg font-semibold">
          {widget.name}
          <span className="ml-2 text-sm text-gray-500">(ID: {widget.id})</span>
        </h3>
        {formattedParameters && (
          <div className="text-sm text-gray-600 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody style={{ flex: 1, minHeight: 0, padding: '16px' }}>
        <div style={{ width: '100%', height: '300px' }}>
          <Line ref={chartRef} data={chartJSData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};