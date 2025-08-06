import React, { useMemo, useRef, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ChartOptions, 
  ChartData,
  LineController,
  Filler
} from 'chart.js';
import { ChartStyleContext } from '../../../contexts/ChartStyleContext';
import { mergeChartOptions } from '../../../utils/deepMerge';
import { debugLogger } from '../../../utils/debugLogger';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler
);

interface DeclarativeLineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  widgetId: number;
  widgetName: string;
}

// Default options for line charts
const defaultLineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  },
  // Ensure line elements have default options
  elements: {
    line: {
      tension: 0.1,
      borderWidth: 2
    },
    point: {
      radius: 3,
      hitRadius: 10,
      hoverRadius: 5
    }
  }
};

export const DeclarativeLineChart: React.FC<DeclarativeLineChartProps> = ({ 
  data, 
  options = {}, 
  widgetId,
  widgetName
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const styleContext = useContext(ChartStyleContext);
  const styleSystem = styleContext?.styleSystem;
  const currentStyle = styleContext?.currentStyle;

  debugLogger.info('DeclarativeLineChart', `Rendering line chart for widget ${widgetId} - ${widgetName}`, {
    datasetCount: data.datasets?.length || 0,
    labelsCount: data.labels?.length || 0,
    currentStyle
  });

  // Merge options with style-aware options
  const chartOptions = useMemo(() => {
    let mergedOptions = defaultLineOptions;

    // Apply style system options if available
    if (styleSystem && currentStyle) {
      const styleOptions = styleSystem.getStyleOptions();
      mergedOptions = mergeChartOptions(mergedOptions, styleOptions);
      
      debugLogger.debug('DeclarativeLineChart', `Applied style "${currentStyle}" to widget ${widgetId}`, {
        hasStyleOptions: !!styleOptions
      });
    }

    // Apply widget-specific options last (highest priority)
    if (options && Object.keys(options).length > 0) {
      mergedOptions = mergeChartOptions(mergedOptions, options);
    }

    // Ensure critical options are always present
    if (!mergedOptions.onClick) {
      mergedOptions.onClick = (event, elements) => {
        if (elements && elements.length > 0) {
          debugLogger.info('DeclarativeLineChart', `Point clicked in widget ${widgetId}`, {
            elementIndex: elements[0].index,
            datasetIndex: elements[0].datasetIndex
          });
        }
      };
    }

    return mergedOptions;
  }, [options, currentStyle, styleSystem, widgetId]);

  // Apply style-specific colors to datasets
  const styledData = useMemo(() => {
    if (!styleSystem || !data.datasets) return data;

    const styleDefinition = styleSystem.getCurrentStyleDefinition();
    const clonedData = JSON.parse(JSON.stringify(data));

    clonedData.datasets = clonedData.datasets.map((dataset: any, index: number) => {
      // Apply line colors from style if not already set
      if (!dataset.borderColor) {
        if (styleDefinition.lineColor) {
          dataset.borderColor = styleDefinition.lineColor;
        } else {
          // Default colors
          const defaultColors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
          ];
          dataset.borderColor = defaultColors[index % defaultColors.length];
        }
      }

      // Apply background color for filled areas
      if (!dataset.backgroundColor) {
        if (styleDefinition.lineBgColor) {
          dataset.backgroundColor = styleDefinition.lineBgColor;
        } else if (dataset.borderColor) {
          // Create a semi-transparent version of the border color
          dataset.backgroundColor = dataset.borderColor.replace('rgb', 'rgba').replace(')', ', 0.1)');
        }
      }

      // Apply other style properties
      if (styleDefinition.lineBorderWidth !== undefined && dataset.borderWidth === undefined) {
        dataset.borderWidth = styleDefinition.lineBorderWidth;
      }
      if (styleDefinition.lineTension !== undefined && dataset.tension === undefined) {
        dataset.tension = styleDefinition.lineTension;
      }
      if (styleDefinition.linePointRadius !== undefined && dataset.pointRadius === undefined) {
        dataset.pointRadius = styleDefinition.linePointRadius;
      }

      // Set fill property based on style
      if (dataset.fill === undefined) {
        dataset.fill = !!styleDefinition.lineBgColor;
      }

      // Apply point colors
      if (!dataset.pointBackgroundColor) {
        dataset.pointBackgroundColor = dataset.borderColor;
      }
      if (!dataset.pointBorderColor) {
        dataset.pointBorderColor = dataset.borderColor;
      }

      return dataset;
    });

    return clonedData;
  }, [data, styleSystem]);

  // Log any data issues
  if (!data.labels || data.labels.length === 0) {
    debugLogger.warn('DeclarativeLineChart', `Widget ${widgetId} has no labels`);
  }

  if (!data.datasets || data.datasets.length === 0) {
    debugLogger.warn('DeclarativeLineChart', `Widget ${widgetId} has no datasets`);
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Line 
        ref={chartRef} 
        data={styledData} 
        options={chartOptions}
        key={`line-${widgetId}-${currentStyle}`} // Force re-render on style change
      />
    </div>
  );
};