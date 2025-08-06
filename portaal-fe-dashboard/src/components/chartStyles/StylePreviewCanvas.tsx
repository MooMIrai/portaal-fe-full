import React, { useEffect, useRef, memo } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { chartStyles } from '../../services/chartStyles';

// Register Chart.js components once
Chart.register(...registerables);

interface StylePreviewCanvasProps {
  styleName: string;
  width?: number;
  height?: number;
}

/**
 * Componente per mostrare una mini preview dello stile del grafico
 * Usa memoization per evitare re-render non necessari
 */
export const StylePreviewCanvas = memo<StylePreviewCanvasProps>(({ 
  styleName, 
  width = 40, 
  height = 30 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    const style = chartStyles[styleName];
    if (!style) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Prepare mini data
    const data = [3, 7, 4, 6, 8];
    
    // Get first color from style
    let bgColor = style.barColors;
    if (Array.isArray(bgColor)) {
      bgColor = bgColor[0];
      // If it's a gradient array, use the middle color
      if (Array.isArray(bgColor)) {
        bgColor = bgColor[1] || bgColor[0];
      }
    }
    if (typeof bgColor === 'function') {
      // For data-driven colors, use a default
      bgColor = 'rgba(59, 130, 246, 0.8)';
    }
    
    // Create mini chart configuration
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['', '', '', '', ''],
        datasets: [{
          data: data,
          backgroundColor: bgColor,
          borderWidth: 0,
          borderRadius: style.barBorderRadius ? 
            (typeof style.barBorderRadius === 'number' ? style.barBorderRadius / 2 : 2) : 0,
          barPercentage: 0.7,
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        layout: {
          padding: 2
        }
      }
    };
    
    // Create the chart
    chartRef.current = new Chart(ctx, config);
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [styleName]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
});

StylePreviewCanvas.displayName = 'StylePreviewCanvas';