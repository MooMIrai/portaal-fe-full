import React, { useMemo, useRef, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  ChartOptions, 
  ChartData,
  PieController
} from 'chart.js';
import { ChartStyleContext } from '../../../contexts/ChartStyleContext';
import { mergeChartOptions } from '../../../utils/deepMerge';
import { debugLogger } from '../../../utils/debugLogger';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

interface DeclarativePieChartProps {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
  widgetId: number;
  widgetName: string;
}

// Default options for pie charts
const defaultPieOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed;
          const dataset = context.dataset;
          const total = dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  // Ensure arc elements have default options to prevent spacing errors
  elements: {
    arc: {
      spacing: 0,
      borderWidth: 1,
      borderAlign: 'center' as const,
      offset: 0
    }
  }
};

export const DeclarativePieChart: React.FC<DeclarativePieChartProps> = ({ 
  data, 
  options = {}, 
  widgetId,
  widgetName
}) => {
  const chartRef = useRef<ChartJS<'pie'>>(null);
  const styleContext = useContext(ChartStyleContext);
  const styleSystem = styleContext?.styleSystem;
  const currentStyle = styleContext?.currentStyle;

  // Debug log for style changes
  React.useEffect(() => {
    debugLogger.info('DeclarativePieChart', `Widget ${widgetId} style changed to: ${currentStyle}`);
  }, [currentStyle, widgetId]);

  debugLogger.info('DeclarativePieChart', `Rendering pie chart for widget ${widgetId} - ${widgetName}`, {
    datasetCount: data.datasets?.length || 0,
    labelsCount: data.labels?.length || 0,
    currentStyle
  });

  // Merge options with style-aware options
  const chartOptions = useMemo(() => {
    let mergedOptions = defaultPieOptions;

    // Apply style system options if available
    if (styleSystem && currentStyle) {
      const styleOptions = styleSystem.getStyleOptions();
      mergedOptions = mergeChartOptions(mergedOptions, styleOptions);
      
      debugLogger.debug('DeclarativePieChart', `Applied style "${currentStyle}" to widget ${widgetId}`, {
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
          debugLogger.info('DeclarativePieChart', `Pie slice clicked in widget ${widgetId}`, {
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
      // Apply pie colors from style if not already set
      if (!dataset.backgroundColor || 
          (Array.isArray(dataset.backgroundColor) && dataset.backgroundColor.length === 0)) {
        if (styleDefinition.pieColors && Array.isArray(styleDefinition.pieColors)) {
          dataset.backgroundColor = styleDefinition.pieColors;
        } else {
          // Default colors
          dataset.backgroundColor = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
          ];
        }
      }

      // Apply border styles
      if (styleDefinition.pieBorderColor && !dataset.borderColor) {
        dataset.borderColor = styleDefinition.pieBorderColor;
      }
      if (styleDefinition.pieBorderWidth !== undefined && dataset.borderWidth === undefined) {
        dataset.borderWidth = styleDefinition.pieBorderWidth;
      }

      // Ensure spacing is always defined
      if (dataset.spacing === undefined) {
        dataset.spacing = 0;
      }

      return dataset;
    });

    return clonedData;
  }, [data, styleSystem]);

  // Log any data issues
  if (!data.labels || data.labels.length === 0) {
    debugLogger.warn('DeclarativePieChart', `Widget ${widgetId} has no labels`);
  }

  if (!data.datasets || data.datasets.length === 0 || 
      !data.datasets[0].data || data.datasets[0].data.length === 0) {
    debugLogger.warn('DeclarativePieChart', `Widget ${widgetId} has no data`);
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Pie 
        ref={chartRef} 
        data={styledData} 
        options={chartOptions}
        key={`pie-${widgetId}-${currentStyle}`} // Force re-render on style change
      />
    </div>
  );
};