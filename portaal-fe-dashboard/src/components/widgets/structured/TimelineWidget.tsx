import React, { useRef, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, BarElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { WidgetProps, TimelineConfig } from '../../../types/widgetConfig.types';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, TimeScale, BarElement, Title, Tooltip, Legend);

export const TimelineWidget: React.FC<WidgetProps<TimelineConfig>> = ({ data, config, computed }) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  
  // Group data by type/category if specified
  const groupedData = useMemo(() => {
    if (config.groupBy && config.typeField) {
      return data.reduce((acc, item) => {
        const key = item[config.typeField!] || 'Default';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    }
    return { 'Timeline': data };
  }, [data, config.groupBy, config.typeField]);

  // Default colors for different types
  const defaultColors = config.colors || {
    milestone: '#3498db',
    task: '#2ecc71',
    event: '#e74c3c',
    business: '#f39c12',
    achievement: '#9b59b6',
    default: '#95a5a6'
  };

  // Get color for item type
  const getColor = (type: string) => {
    return defaultColors[type] || defaultColors.default || '#95a5a6';
  };

  // Sort data by start date
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a[config.startField]).getTime();
      const dateB = new Date(b[config.startField]).getTime();
      return dateA - dateB;
    });
  }, [data, config.startField]);

  // Get categories (for vertical timeline)
  const categories = sortedData.map(item => 
    item[config.labelField || config.categoryField] || 'Event'
  );

  // Prepare datasets for Chart.js
  const datasets = Object.entries(groupedData).map(([groupName, items]) => {
    return {
      label: groupName,
      data: sortedData.map(item => {
        if (!items.includes(item)) return null;
        
        const start = new Date(item[config.startField]);
        const end = new Date(item[config.endField]);
        
        // For horizontal bar chart representing timeline
        if (config.orientation === 'horizontal') {
          return {
            x: [start.getTime(), end.getTime()],
            y: item[config.categoryField]
          };
        } else {
          // For vertical timeline, return duration
          return end.getTime() - start.getTime();
        }
      }),
      backgroundColor: sortedData.map(item => {
        const type = item[config.typeField || ''] || 'default';
        return getColor(type);
      }),
      borderColor: sortedData.map(item => {
        const type = item[config.typeField || ''] || 'default';
        return getColor(type);
      }),
      borderWidth: 2,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    };
  });

  // Chart data
  const chartData: ChartData<'bar'> = {
    labels: categories,
    datasets: datasets.filter(ds => ds.data.some(d => d !== null))
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: config.orientation === 'horizontal' ? 'y' : 'x',
    plugins: {
      legend: {
        display: config.groupBy ? true : false,
        position: 'bottom',
      },
      tooltip: {
        enabled: config.showTooltip !== false,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const item = sortedData[index];
            return item[config.labelField || config.categoryField] || 'Event';
          },
          label: (context) => {
            const index = context.dataIndex;
            const item = sortedData[index];
            const start = parseISO(item[config.startField]);
            const end = parseISO(item[config.endField]);
            
            const dateFormat = config.dateFormat || 'dd/MM/yyyy';
            const labels = [
              `Inizio: ${format(start, dateFormat, { locale: it })}`,
              `Fine: ${format(end, dateFormat, { locale: it })}`
            ];
            
            if (config.descriptionField && item[config.descriptionField]) {
              labels.push(`${item[config.descriptionField]}`);
            }
            
            if (config.tooltipFormat) {
              return config.tooltipFormat
                .replace('{start}', format(start, dateFormat, { locale: it }))
                .replace('{end}', format(end, dateFormat, { locale: it }))
                .replace('{' + config.categoryField + '}', item[config.categoryField]);
            }
            
            return labels;
          }
        }
      },
      title: {
        display: !!config.title,
        text: config.title,
      },
    },
    scales: config.orientation === 'horizontal' ? {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM yyyy'
          }
        },
        title: {
          display: true,
          text: 'Timeline'
        }
      },
      y: {
        type: 'category',
        title: {
          display: false
        },
        ticks: {
          autoSkip: false,
        }
      }
    } : {
      x: {
        type: 'category',
        title: {
          display: false
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        type: 'linear',
        display: false, // Hide y-axis for vertical timeline
        stacked: true,
      }
    }
  };

  // Custom plugin to draw timeline connectors
  const plugins = config.showConnectors ? [{
    id: 'timelineConnectors',
    afterDatasetsDraw: (chart: ChartJS) => {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      
      if (meta.data.length > 1) {
        ctx.save();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Draw connecting lines between timeline items
        for (let i = 0; i < meta.data.length - 1; i++) {
          const current = meta.data[i];
          const next = meta.data[i + 1];
          
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }
  }] : [];

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
          <Bar 
            ref={chartRef} 
            data={chartData} 
            options={options}
            plugins={plugins}
          />
        </div>
        {/* Timeline legend for event types */}
        {config.typeField && (
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {Object.entries(defaultColors).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: color,
                  borderRadius: '2px'
                }} />
                <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};