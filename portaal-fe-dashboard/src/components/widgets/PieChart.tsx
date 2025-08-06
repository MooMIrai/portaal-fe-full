import React, { useRef } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  const chartRef = useRef<ChartJS<'pie'>>(null);

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
  const config = widget.config || {};
  const valueField = config.valueField || 'value';
  const categoryField = config.categoryField || 'category';
  
  // Format parameters for display
  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  // Prepare data for Chart.js
  const chartJSData: ChartData<'pie'> = {
    labels: chartData.map(item => item[categoryField] || ''),
    datasets: [{
      data: chartData.map(item => item[valueField] || 0),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
        'rgba(255, 99, 255, 0.6)',
        'rgba(99, 255, 132, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(255, 99, 255, 1)',
        'rgba(99, 255, 132, 1)',
      ],
      borderWidth: 1,
    }]
  };

  // Chart options
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
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
    },
    plugins: {
      legend: {
        display: config.showLegend !== false,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
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
      <CardBody style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
          <Pie ref={chartRef} data={chartJSData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};