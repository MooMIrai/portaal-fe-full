import { useContext, useEffect, useMemo } from 'react';
import { ChartStyleContext } from '../contexts/ChartStyleContext';
import { ChartStyleSystem } from '../services/chartStyles';
import { ChartOptions, ChartData, Chart } from 'chart.js';

export interface UseChartStyleReturn {
  styleSystem: ChartStyleSystem;
  currentStyle: string | undefined;
  applyBarStyle: (dataset: any, index?: number) => any;
  applyLineStyle: (dataset: any) => any;
  applyPieStyle: (dataset: any) => any;
  getStyleOptions: () => Partial<ChartOptions>;
  mergeOptions: (baseOptions: ChartOptions) => ChartOptions;
  getPlugins: () => any[];
}

/**
 * Hook per gestire gli stili dei grafici
 * Fornisce metodi helper per applicare stili e opzioni
 */
export const useChartStyle = (chartRef?: React.RefObject<Chart | null>): UseChartStyleReturn => {
  // Get chart style context - use optional chaining in case context is not available
  const styleContext = useContext(ChartStyleContext);
  const styleSystem = styleContext?.styleSystem || ChartStyleSystem.getInstance();
  const currentStyle = styleContext?.currentStyle;
  
  // Re-render chart when style changes
  useEffect(() => {
    if (chartRef?.current && styleSystem) {
      chartRef.current.update();
    }
  }, [currentStyle, styleSystem, chartRef]);
  
  // Memoize helper functions
  const helpers = useMemo(() => ({
    applyBarStyle: (dataset: any, index?: number) => {
      // Don't use ctx and chartArea from ref as they might not be available yet
      // The style system will handle gradients on update
      return styleSystem.applyBarStyle(dataset, null, null, index);
    },
    
    applyLineStyle: (dataset: any) => {
      return styleSystem.applyLineStyle(dataset, null, null);
    },
    
    applyPieStyle: (dataset: any) => {
      return styleSystem.applyPieStyle(dataset, null, null);
    },
    
    getStyleOptions: () => styleSystem.getStyleOptions(),
    
    mergeOptions: (baseOptions: ChartOptions): ChartOptions => {
      const styleOptions = styleSystem.getStyleOptions();
      
      return {
        ...baseOptions,
        ...styleOptions,
        plugins: {
          ...baseOptions.plugins,
          ...styleOptions.plugins,
          legend: {
            ...baseOptions.plugins?.legend,
            ...styleOptions.plugins?.legend
          },
          // Keep original tooltip configuration if exists
          tooltip: baseOptions.plugins?.tooltip || styleOptions.plugins?.tooltip
        },
        // Use style scales if hideScales is true, otherwise keep base scales
        scales: styleOptions.scales || baseOptions.scales
      };
    },
    
    getPlugins: () => styleSystem.getRequiredPlugins()
  }), [styleSystem, chartRef]);
  
  return {
    styleSystem,
    currentStyle,
    ...helpers
  };
};