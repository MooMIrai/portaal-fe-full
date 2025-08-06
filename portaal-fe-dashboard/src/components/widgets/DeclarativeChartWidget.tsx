import React, { useContext } from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { WidgetProps } from '../../types/widget.types';
import { formatParametersDisplay } from '../../utils/parameterFormatters';
import { debugLogger } from '../../utils/debugLogger';
import { 
  DeclarativePieChart, 
  DeclarativeBarChart, 
  DeclarativeLineChart,
  DeclarativeChartType 
} from './charts';
import { ChartStyleContext } from '../../contexts/ChartStyleContext';

// Extended interface for data with chart structure
interface DeclarativeChartData {
  chartType?: DeclarativeChartType | string;
  chartData?: any;
  chartOptions?: any;
  // Legacy format support
  chart?: string;
  data?: any;
  [key: string]: any;
}

/**
 * DeclarativeChartWidget - A dispatcher component that renders the appropriate
 * declarative chart component based on the data structure.
 * 
 * This replaces the imperative HtmlChartWidget approach with a fully
 * React-declarative approach, eliminating DOM manipulation and script execution.
 */
export const DeclarativeChartWidget: React.FC<WidgetProps> = ({ 
  widget, 
  data, 
  loading, 
  error, 
  currentFilters 
}) => {
  const chartData = data as DeclarativeChartData;
  
  // Get current style from context to trigger re-renders
  const styleContext = useContext(ChartStyleContext);
  const currentStyle = styleContext?.currentStyle;
  
  debugLogger.info('DeclarativeChartWidget', `Rendering widget ${widget.id} - ${widget.name}`, { 
    widgetId: widget.id,
    widgetName: widget.name,
    hasChartType: !!chartData?.chartType,
    hasChartData: !!chartData?.chartData,
    hasLegacyChart: !!chartData?.chart,
    dataKeys: chartData ? Object.keys(chartData) : []
  });

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
          <div>Error loading chart: {error.message}</div>
        </CardBody>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center text-gray-500">
          <div>No data available</div>
        </CardBody>
      </Card>
    );
  }

  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  // Helper function to render the appropriate chart
  const renderChart = () => {
    // Check if we have the new declarative format
    if (chartData.chartType && chartData.chartData) {
      debugLogger.info('DeclarativeChartWidget', `Using declarative chart type: ${chartData.chartType}`, {
        widgetId: widget.id
      });

      const commonProps = {
        data: chartData.chartData,
        options: chartData.chartOptions || {},
        widgetId: widget.id,
        widgetName: widget.name
      };

      // Add key with current style to force re-render on style change
      const chartKey = `${widget.id}-${chartData.chartType}-${currentStyle || 'default'}`;

      switch (chartData.chartType.toLowerCase()) {
        case DeclarativeChartType.PIE:
          return <DeclarativePieChart key={chartKey} {...commonProps} />;
        
        case DeclarativeChartType.BAR:
          return <DeclarativeBarChart key={chartKey} {...commonProps} />;
        
        case DeclarativeChartType.LINE:
          return <DeclarativeLineChart key={chartKey} {...commonProps} />;
        
        case DeclarativeChartType.DOUGHNUT:
          // For now, use pie chart with doughnut options
          return <DeclarativePieChart 
            key={chartKey}
            {...commonProps} 
            options={{
              ...commonProps.options,
              cutout: '50%'
            }}
          />;
        
        case DeclarativeChartType.AREA:
          // Area chart is a line chart with fill
          return <DeclarativeLineChart 
            key={chartKey}
            {...commonProps}
            data={{
              ...commonProps.data,
              datasets: commonProps.data.datasets?.map((ds: any) => ({
                ...ds,
                fill: true
              }))
            }}
          />;
        
        default:
          debugLogger.warn('DeclarativeChartWidget', `Unsupported chart type: ${chartData.chartType}`, {
            widgetId: widget.id
          });
          return (
            <div className="flex items-center justify-center h-full text-amber-600">
              <div className="text-center">
                <p>Chart type "{chartData.chartType}" is not yet supported</p>
                <p className="text-sm text-gray-500 mt-2">Using declarative rendering</p>
              </div>
            </div>
          );
      }
    }

    // Check if we can infer chart type from legacy data structure
    if (chartData.data || chartData.Query) {
      // Try to infer chart type from widget configuration or data patterns
      const inferredType = inferChartType(widget, chartData);
      
      if (inferredType) {
        debugLogger.info('DeclarativeChartWidget', `Inferred chart type: ${inferredType}`, {
          widgetId: widget.id
        });

        // Transform legacy data to new format
        const transformedData = transformLegacyData(chartData, inferredType);
        
        if (transformedData) {
          const commonProps = {
            data: transformedData,
            options: widget.config || {},
            widgetId: widget.id,
            widgetName: widget.name
          };

          // Add key with current style to force re-render on style change
          const legacyChartKey = `${widget.id}-${inferredType}-${currentStyle || 'default'}`;

          switch (inferredType) {
            case DeclarativeChartType.PIE:
              return <DeclarativePieChart key={legacyChartKey} {...commonProps} />;
            case DeclarativeChartType.BAR:
              return <DeclarativeBarChart key={legacyChartKey} {...commonProps} />;
            case DeclarativeChartType.LINE:
              return <DeclarativeLineChart key={legacyChartKey} {...commonProps} />;
          }
        }
      }
    }

    // If we still have legacy HTML format, show migration message
    if (chartData.chart && typeof chartData.chart === 'string') {
      debugLogger.warn('DeclarativeChartWidget', `Widget ${widget.id} is using legacy HTML format`, {
        widgetId: widget.id,
        htmlLength: chartData.chart.length
      });
      
      return (
        <div className="flex items-center justify-center h-full text-amber-600">
          <div className="text-center p-4">
            <p className="font-semibold">Legacy Chart Format Detected</p>
            <p className="text-sm text-gray-600 mt-2">
              This widget needs to be migrated to the new declarative format.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Widget ID: {widget.id} - {widget.name}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div>No chart data available</div>
      </div>
    );
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
      <CardBody style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch' }}>
        {renderChart()}
      </CardBody>
    </Card>
  );
};

/**
 * Helper function to infer chart type from widget configuration or data patterns
 */
function inferChartType(widget: any, data: any): DeclarativeChartType | null {
  // Check widget type if available
  if (widget.widgetType) {
    const typeMap: Record<string, DeclarativeChartType> = {
      'CHART_PIE': DeclarativeChartType.PIE,
      'CHART_BAR': DeclarativeChartType.BAR,
      'CHART_LINE': DeclarativeChartType.LINE,
      'CHART_DONUT': DeclarativeChartType.DOUGHNUT,
      'CHART_AREA': DeclarativeChartType.AREA,
    };
    
    if (typeMap[widget.widgetType]) {
      return typeMap[widget.widgetType];
    }
  }

  // Check widget name patterns
  const nameLower = widget.name?.toLowerCase() || '';
  if (nameLower.includes('pie') || nameLower.includes('torta')) {
    return DeclarativeChartType.PIE;
  }
  if (nameLower.includes('bar') || nameLower.includes('barre')) {
    return DeclarativeChartType.BAR;
  }
  if (nameLower.includes('line') || nameLower.includes('linea')) {
    return DeclarativeChartType.LINE;
  }
  if (nameLower.includes('donut') || nameLower.includes('doughnut')) {
    return DeclarativeChartType.DOUGHNUT;
  }

  // Default to bar chart if we can't determine
  return DeclarativeChartType.BAR;
}

/**
 * Helper function to transform legacy data format to Chart.js format
 */
function transformLegacyData(data: any, chartType: DeclarativeChartType): any {
  try {
    const sourceData = data.data || data.Query || [];
    
    if (!Array.isArray(sourceData) || sourceData.length === 0) {
      return null;
    }

    // Extract labels and values from the data
    const labels: string[] = [];
    const values: number[] = [];
    
    // Try to determine label and value fields
    const firstItem = sourceData[0];
    const keys = Object.keys(firstItem);
    
    // Common patterns for label fields
    const labelFields = ['label', 'name', 'category', 'categoria', 'month', 'mese'];
    const valueFields = ['value', 'valore', 'amount', 'total', 'count'];
    
    let labelField = keys.find(k => labelFields.includes(k.toLowerCase())) || keys[0];
    let valueField = keys.find(k => valueFields.includes(k.toLowerCase())) || keys[1];
    
    sourceData.forEach(item => {
      labels.push(item[labelField] || '');
      values.push(parseFloat(item[valueField]) || 0);
    });

    return {
      labels,
      datasets: [{
        label: 'Dataset',
        data: values,
        // Let the individual chart components handle the styling
      }]
    };
  } catch (error) {
    debugLogger.error('DeclarativeChartWidget', 'Error transforming legacy data', error);
    return null;
  }
}