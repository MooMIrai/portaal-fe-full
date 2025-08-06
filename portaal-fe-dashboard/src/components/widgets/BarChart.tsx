import React, { useRef, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';
import { useChartStyle } from '../../hooks/useChartStyle';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [chartKey, setChartKey] = useState(0);
  
  // Use chart style hook
  const { applyBarStyle, mergeOptions, getPlugins, currentStyle } = useChartStyle(chartRef);
  
  // Force re-render of chart when style changes
  useEffect(() => {
    if (currentStyle !== undefined) {
      setChartKey(prev => prev + 1);
    }
  }, [currentStyle]);

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
  
  if (isPreformattedData) {
    // Data is already formatted as series
    chartSeries = data.data;
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
      gap: s.gap,
      spacing: s.spacing,
      data: chartData.map(item => ({ value: item[s.field], dataItem: item }))
    }));
  }
  
  // Axis configurations
  const xAxisConfig = config.xAxis || config.categoryAxis || {};
  const yAxisConfig = config.yAxis || config.valueAxis || {};
  
  // Legend configuration
  const legendConfig = config.legend || { position: 'bottom' };
  
  // Tooltip configuration
  const tooltipConfig = config.tooltip || { visible: true };
  
  // Chart type - can be 'column' or 'bar'
  const chartType = config.chartType === 'bar' ? 'bar' : 'column';
  
  // Format parameters for display
  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  // Prepare data for Chart.js with style system
  const chartJSData: ChartData<'bar'> = {
    labels: categories,
    datasets: chartSeries.map((s: any, index: number) => {
      const dataset = {
        label: s.name,
        data: s.data.map(item => item.value),
        backgroundColor: s.color || 'rgba(54, 162, 235, 0.5)',
        borderColor: s.color || 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      };
      
      // Apply style from hook
      return applyBarStyle(dataset, index);
    })
  };

  // Chart options with style system integration
  const baseOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartType === 'bar' ? 'y' : 'x',
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
              const dataItem = chartSeries[seriesIndex]?.data[dataIndex]?.dataItem || {};
              
              // Simple template replacement
              let html = tooltipConfig.template;
              
              // Replace all #= expressions #
              html = html.replace(/#=\s*([^#]+?)\s*#/g, (match, expression) => {
                const expr = expression.trim();
                
                if (expr.startsWith('dataItem.')) {
                  const property = expr.substring(9);
                  return dataItem[property] || '';
                }
                
                if (expr === 'value') {
                  return context.parsed.y;
                }
                
                return match;
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
  
  // Merge with style options using hook
  const options = mergeOptions(baseOptions);

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
          <Bar key={chartKey} ref={chartRef} data={chartJSData} options={options} plugins={getPlugins()} />
        </div>
      </CardBody>
    </Card>
  );
};