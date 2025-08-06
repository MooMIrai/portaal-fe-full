import React, { useRef } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const LineChart: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const chartDataRef = useRef<any[]>([]);

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

  // Check if data is already formatted as series
  const isPreformattedData = data?.data && Array.isArray(data.data) && data.data[0]?.data && Array.isArray(data.data[0].data);
  
  let chartSeries = [];
  let categories = [];
  const config = data?.widget?.config || widget.config || {};
  
  // Store chart data for tooltip access
  chartDataRef.current = [];
  
  if (isPreformattedData) {
    // Data is already formatted as series
    chartSeries = data.data;
    // Store all data items for tooltip access
    chartDataRef.current = chartSeries;
    // Get categories from the first series data items
    if (chartSeries[0]?.data?.length > 0) {
      const categoryField = config.categoryAxis?.field || 'data_formattata';
      categories = chartSeries[0].data.map(item => item.dataItem?.[categoryField] || '');
    }
  } else {
    // Data is a flat array that needs transformation
    const chartData = data?.data || [];
    const categoryField = config.categoryField || config.categoryAxis?.field || 'category';
    categories = chartData.map(item => item[categoryField] || '');
    
    // Get series configuration
    const seriesConfig = config.series || [{ field: 'value', name: 'Valore' }];
    chartSeries = seriesConfig.map(s => ({
      name: s.name,
      color: s.color,
      dashType: s.dashType,
      markers: s.markers,
      data: chartData.map(item => ({ value: item[s.field], dataItem: item }))
    }));
    chartDataRef.current = chartSeries;
  }
  
  // Axis configurations
  const xAxisConfig = config.xAxis || config.categoryAxis || {};
  const yAxisConfig = config.yAxis || config.valueAxis || {};
  
  // Legend configuration
  const legendConfig = config.legend || { position: 'bottom' };
  
  // Tooltip configuration
  const tooltipConfig = config.tooltip || { visible: true };
  
  // Format parameters for display
  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  // Map dash types from Kendo to Chart.js
  const getDashStyle = (dashType?: string) => {
    switch (dashType) {
      case 'dash':
        return [5, 5];
      case 'dot':
        return [2, 2];
      case 'longDash':
        return [10, 5];
      case 'dashDot':
        return [5, 5, 2, 5];
      default:
        return [];
    }
  };

  // Prepare data for Chart.js
  const chartJSData: ChartData<'line'> = {
    labels: categories,
    datasets: chartSeries.map((s: any) => ({
      label: s.name,
      data: s.data.map(item => item.value),
      borderColor: s.color || 'rgba(75, 192, 192, 1)',
      backgroundColor: s.color || 'rgba(75, 192, 192, 0.2)',
      borderDash: getDashStyle(s.dashType),
      tension: 0,
      pointRadius: s.markers?.visible === false ? 0 : (s.markers?.size || 3),
      pointHoverRadius: s.markers?.visible === false ? 0 : (s.markers?.size || 3) + 2,
    }))
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: legendConfig !== false,
        position: legendConfig.position || 'bottom',
      },
      tooltip: {
        enabled: tooltipConfig.visible !== false,
        callbacks: tooltipConfig.template ? {
          label: function(context) {
            if (tooltipConfig.template) {
              const dataIndex = context.dataIndex;
              const seriesIndex = context.datasetIndex;
              const dataItem = chartDataRef.current[seriesIndex]?.data[dataIndex]?.dataItem || {};
              
              // Simple template replacement
              let html = tooltipConfig.template;
              
              // Replace all #= expressions #
              html = html.replace(/#=\s*([^#]+?)\s*#/g, (match, expression) => {
                const expr = expression.trim();
                
                if (expr.startsWith('dataItem.')) {
                  const property = expr.substring(9);
                  const val = dataItem[property];
                  return val !== undefined && val !== null ? String(val) : '';
                }
                
                if (expr === 'value') {
                  return context.parsed.y !== undefined ? String(context.parsed.y) : '';
                }
                
                if (expr === 'series.name') {
                  return context.dataset.label || '';
                }
                
                return '';
              });
              
              return html;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        } : undefined,
      },
    },
    scales: {
      x: {
        title: {
          display: !!xAxisConfig.title?.text || !!xAxisConfig.label,
          text: xAxisConfig.title?.text || xAxisConfig.label,
        },
        ticks: {
          autoSkip: false,
          maxRotation: xAxisConfig.labels?.rotation || xAxisConfig.rotation || 0,
          minRotation: xAxisConfig.labels?.rotation || xAxisConfig.rotation || 0,
        }
      },
      y: {
        min: yAxisConfig.min,
        max: yAxisConfig.max,
        title: {
          display: !!yAxisConfig.title?.text || !!yAxisConfig.label,
          text: yAxisConfig.title?.text || yAxisConfig.label,
        },
      }
    }
  };

  return (
    <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader className="bg-gray-50" style={{ flexShrink: 0, padding: '12px 16px' }}>
        <h3 className="text-lg font-semibold">
          {widget.name}
          <span className="ml-2 text-sm text-gray-500">(ID: {widget.id})</span>
        </h3>
        {formattedParameters && (
          <div className="text-sm text-gray-600 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody style={{ flex: 1, minHeight: 0, padding: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Line ref={chartRef} data={chartJSData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};