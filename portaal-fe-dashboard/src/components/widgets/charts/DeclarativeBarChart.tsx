import React, { useMemo, useRef, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ChartOptions, 
  ChartData,
  BarController
} from 'chart.js';
import { ChartStyleContext } from '../../../contexts/ChartStyleContext';
import { mergeChartOptions } from '../../../utils/deepMerge';
import { debugLogger } from '../../../utils/debugLogger';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

interface DeclarativeBarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  widgetId: number;
  widgetName: string;
}

// Default options for bar charts
const defaultBarOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
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
  // Ensure bar elements have default options
  elements: {
    bar: {
      borderWidth: 0,
      borderRadius: 4
    }
  }
};

export const DeclarativeBarChart: React.FC<DeclarativeBarChartProps> = ({ 
  data, 
  options = {}, 
  widgetId,
  widgetName
}) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const styleContext = useContext(ChartStyleContext);
  const styleSystem = styleContext?.styleSystem;
  const currentStyle = styleContext?.currentStyle;

  debugLogger.info('DeclarativeBarChart', `Rendering bar chart for widget ${widgetId} - ${widgetName}`, {
    datasetCount: data.datasets?.length || 0,
    labelsCount: data.labels?.length || 0,
    currentStyle
  });

  // Merge options with style-aware options
  const chartOptions = useMemo(() => {
    let mergedOptions = defaultBarOptions;

    // Apply style system options if available
    if (styleSystem && currentStyle) {
      const styleOptions = styleSystem.getStyleOptions();
      mergedOptions = mergeChartOptions(mergedOptions, styleOptions);
      
      debugLogger.debug('DeclarativeBarChart', `Applied style "${currentStyle}" to widget ${widgetId}`, {
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
          debugLogger.info('DeclarativeBarChart', `Bar clicked in widget ${widgetId}`, {
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
      // Apply bar colors from style if not already set
      if (!dataset.backgroundColor) {
        if (styleDefinition.barColors && Array.isArray(styleDefinition.barColors)) {
          dataset.backgroundColor = styleDefinition.barColors[index % styleDefinition.barColors.length];
        } else {
          // Default colors
          const defaultColors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
          ];
          dataset.backgroundColor = defaultColors[index % defaultColors.length];
        }
      }

      // Apply border colors
      if (!dataset.borderColor) {
        if (styleDefinition.barBorderColors && Array.isArray(styleDefinition.barBorderColors)) {
          dataset.borderColor = styleDefinition.barBorderColors[index % styleDefinition.barBorderColors.length];
        } else if (dataset.backgroundColor) {
          dataset.borderColor = dataset.backgroundColor;
        }
      }

      // Apply other style properties
      if (styleDefinition.barBorderWidth !== undefined && dataset.borderWidth === undefined) {
        dataset.borderWidth = styleDefinition.barBorderWidth;
      }
      if (styleDefinition.barBorderRadius !== undefined && dataset.borderRadius === undefined) {
        dataset.borderRadius = styleDefinition.barBorderRadius;
      }

      return dataset;
    });

    return clonedData;
  }, [data, styleSystem]);

  // Log any data issues
  if (!data.labels || data.labels.length === 0) {
    debugLogger.warn('DeclarativeBarChart', `Widget ${widgetId} has no labels`);
  }

  if (!data.datasets || data.datasets.length === 0) {
    debugLogger.warn('DeclarativeBarChart', `Widget ${widgetId} has no datasets`);
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Bar 
        ref={chartRef} 
        data={styledData} 
        options={chartOptions}
        key={`bar-${widgetId}-${currentStyle}`} // Force re-render on style change
      />
    </div>
  );
};