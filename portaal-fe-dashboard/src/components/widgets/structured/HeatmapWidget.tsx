import React, { useRef, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { WidgetProps, HeatmapConfig } from '../../../types/widgetConfig.types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

// Color schemes
const colorSchemes = {
  heat: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
  cool: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
  rainbow: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'],
  custom: [] // Will use colors from config
};

export const HeatmapWidget: React.FC<WidgetProps<HeatmapConfig>> = ({ data, config, computed }) => {
  const chartRef = useRef<ChartJS>(null);
  
  // Get unique x and y categories
  const xCategories = useMemo(() => {
    const categories = [...new Set(data.map(item => item[config.xField]))];
    return categories.sort();
  }, [data, config.xField]);
  
  const yCategories = useMemo(() => {
    const categories = [...new Set(data.map(item => item[config.yField]))];
    return categories.sort();
  }, [data, config.yField]);

  // Create value matrix
  const valueMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    
    // Initialize matrix
    yCategories.forEach(y => {
      matrix[y] = {};
      xCategories.forEach(x => {
        matrix[y][x] = 0;
      });
    });
    
    // Fill matrix with data
    data.forEach(item => {
      const x = item[config.xField];
      const y = item[config.yField];
      const value = item[config.valueField];
      if (matrix[y] && matrix[y][x] !== undefined) {
        matrix[y][x] = value;
      }
    });
    
    return matrix;
  }, [data, config, xCategories, yCategories]);

  // Get min and max values for color scaling
  const { minValue, maxValue } = useMemo(() => {
    const values = data.map(item => item[config.valueField]);
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values)
    };
  }, [data, config.valueField]);

  // Get color scheme
  const colors = config.colors || colorSchemes[config.colorScheme || 'heat'] || colorSchemes.heat;

  // Function to get color based on value
  const getColor = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const colorIndex = Math.floor(normalizedValue * (colors.length - 1));
    return colors[Math.min(colorIndex, colors.length - 1)];
  };

  // Prepare data for Chart.js - using a custom approach with bar chart
  const chartData: ChartData<'bar'> = {
    labels: xCategories,
    datasets: yCategories.map((yCategory, yIndex) => ({
      label: yCategory,
      data: xCategories.map((xCategory) => valueMatrix[yCategory][xCategory]),
      backgroundColor: xCategories.map((xCategory) => 
        getColor(valueMatrix[yCategory][xCategory])
      ),
      barPercentage: 1,
      categoryPercentage: 1,
      borderWidth: 1,
      borderColor: '#fff',
    }))
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Make it horizontal for heatmap effect
    plugins: {
      legend: {
        display: false, // Hide legend for heatmap
      },
      tooltip: {
        enabled: config.showTooltip !== false,
        callbacks: {
          title: (context) => {
            const xLabel = context[0].label;
            const yLabel = context[0].dataset.label;
            return `${config.xField}: ${xLabel}, ${config.yField}: ${yLabel}`;
          },
          label: (context) => {
            const value = context.parsed.x;
            if (config.tooltipFormat) {
              return config.tooltipFormat
                .replace('{value}', value.toString())
                .replace('{' + config.valueField + '}', value.toString());
            }
            return `${config.valueField}: ${config.valueFormat ? value.toLocaleString() : value}`;
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
        ticks: {
          display: false, // Hide ticks for heatmap
        },
        grid: {
          display: false,
        }
      },
      y: {
        type: 'category',
        position: 'left',
        title: {
          display: !!config.yAxis?.title,
          text: config.yAxis?.title || config.yField,
        },
        ticks: {
          autoSkip: false,
        },
        grid: {
          display: false,
        }
      }
    }
  };

  // Render value labels on the heatmap cells
  const plugins = [{
    id: 'heatmapValues',
    afterDatasetsDraw: (chart: ChartJS) => {
      if (!config.showValues) return;
      
      const ctx = chart.ctx;
      ctx.save();
      
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar: any, index) => {
          const value = dataset.data[index] as number;
          if (value !== null && value !== undefined) {
            const x = bar.x;
            const y = bar.y;
            
            ctx.fillStyle = value > (maxValue + minValue) / 2 ? '#fff' : '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              config.valueFormat ? value.toLocaleString() : value.toString(),
              x,
              y
            );
          }
        });
      });
      
      ctx.restore();
    }
  }];

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
          <Chart 
            ref={chartRef} 
            type='bar' 
            data={chartData} 
            options={options}
            plugins={plugins}
          />
        </div>
        {/* Color scale legend */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ marginRight: '8px', fontSize: '12px' }}>{minValue}</span>
          <div style={{ 
            width: '200px', 
            height: '20px', 
            background: `linear-gradient(to right, ${colors.join(', ')})`,
            borderRadius: '4px'
          }} />
          <span style={{ marginLeft: '8px', fontSize: '12px' }}>{maxValue}</span>
        </div>
      </CardBody>
    </Card>
  );
};