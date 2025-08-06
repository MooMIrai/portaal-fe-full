import React, { useEffect, useState, useContext } from 'react';
import { debugLogger } from '../../../utils/debugLogger';
import { DeclarativePieChart } from './DeclarativePieChart';
import { DeclarativeBarChart } from './DeclarativeBarChart';
import { ChartData } from 'chart.js';
import { ChartStyleContext } from '../../../contexts/ChartStyleContext';

interface ProblematicWidgetAdapterProps {
  widgetId: number;
  widgetName: string;
  htmlContent: string;
  data: any;
}

/**
 * Special adapter for widgets 14 and 16 that have issues with the legacy HTML approach.
 * This component extracts data from the HTML/script and renders it using declarative components.
 */
export const ProblematicWidgetAdapter: React.FC<ProblematicWidgetAdapterProps> = ({
  widgetId,
  widgetName,
  htmlContent,
  data
}) => {
  const [chartData, setChartData] = useState<ChartData<'pie' | 'bar'> | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  
  // Get current style from context to trigger re-renders
  const styleContext = useContext(ChartStyleContext);
  const currentStyle = styleContext?.currentStyle;

  useEffect(() => {
    debugLogger.info('ProblematicWidgetAdapter', `Adapting widget ${widgetId} - ${widgetName}`, {
      hasHtml: !!htmlContent,
      hasData: !!data
    });

    try {
      // Try to extract chart configuration from the HTML content
      const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      
      if (scriptMatch && scriptMatch[1]) {
        const scriptContent = scriptMatch[1];
        
        // Look for chart type
        if (scriptContent.includes("type: 'pie'") || scriptContent.includes('type: "pie"')) {
          setChartType('pie');
        } else if (scriptContent.includes("type: 'bar'") || scriptContent.includes('type: "bar"')) {
          setChartType('bar');
        }
        
        // Try to extract labels and data
        const labelsMatch = scriptContent.match(/labels:\s*\[(.*?)\]/s);
        const dataMatch = scriptContent.match(/data:\s*\[([\d,\s.]+)\]/);
        
        if (labelsMatch && dataMatch) {
          // Clean and parse labels
          const labelsString = labelsMatch[1];
          const labels = labelsString
            .split(',')
            .map(label => label.trim().replace(/['"]/g, ''))
            .filter(label => label.length > 0);
          
          // Parse data values
          const dataValues = dataMatch[1]
            .split(',')
            .map(val => parseFloat(val.trim()))
            .filter(val => !isNaN(val));
          
          if (labels.length > 0 && dataValues.length > 0) {
            setChartData({
              labels,
              datasets: [{
                label: widgetName,
                data: dataValues
              }]
            });
            
            debugLogger.info('ProblematicWidgetAdapter', `Extracted data for widget ${widgetId}`, {
              labelsCount: labels.length,
              dataCount: dataValues.length
            });
            
            return;
          }
        }
      }

      // Fallback: try to use data from props
      if (data?.data || data?.Query) {
        const sourceData = data.data || data.Query || [];
        
        if (Array.isArray(sourceData) && sourceData.length > 0) {
          const labels: string[] = [];
          const values: number[] = [];
          
          // Extract labels and values
          sourceData.forEach(item => {
            const keys = Object.keys(item);
            const labelKey = keys.find(k => ['label', 'name', 'category'].includes(k.toLowerCase())) || keys[0];
            const valueKey = keys.find(k => ['value', 'amount', 'total'].includes(k.toLowerCase())) || keys[1];
            
            if (labelKey && valueKey) {
              labels.push(String(item[labelKey]));
              values.push(Number(item[valueKey]) || 0);
            }
          });
          
          if (labels.length > 0 && values.length > 0) {
            setChartData({
              labels,
              datasets: [{
                label: widgetName,
                data: values
              }]
            });
            
            debugLogger.info('ProblematicWidgetAdapter', `Used fallback data for widget ${widgetId}`, {
              labelsCount: labels.length,
              dataCount: values.length
            });
          }
        }
      }
    } catch (error) {
      debugLogger.error('ProblematicWidgetAdapter', `Error adapting widget ${widgetId}`, error);
    }
  }, [widgetId, widgetName, htmlContent, data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p>Unable to extract chart data</p>
          <p className="text-sm mt-2">Widget {widgetId}</p>
        </div>
      </div>
    );
  }

  // Render using declarative component with key based on style
  const commonProps = {
    data: chartData,
    options: {},
    widgetId,
    widgetName
  };

  // Use currentStyle in key to force re-render when style changes
  const chartKey = `${widgetId}-${chartType}-${currentStyle || 'default'}`;

  if (chartType === 'bar') {
    return <DeclarativeBarChart key={chartKey} {...commonProps} />;
  }

  return <DeclarativePieChart key={chartKey} {...commonProps} />;
};