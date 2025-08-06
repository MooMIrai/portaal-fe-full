import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, PieController } from 'chart.js';

// Register required components
ChartJS.register(ArcElement, PieController);

export const TestSpacingError: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('🧪 TestSpacingError: Creating test chart to reproduce spacing error');

    // Create a chart that will trigger the spacing error
    try {
      chartRef.current = new ChartJS(canvasRef.current, {
        type: 'pie',
        data: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [{
            label: 'Test Dataset',
            data: [30, 50, 20],
            backgroundColor: ['#ff0000', '#0000ff', '#ffff00'],
            // Deliberately NOT setting spacing to trigger the error
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // No elements.arc.spacing defined here either
        }
      });

      console.log('🧪 TestSpacingError: Chart created successfully');

      // Simulate mouse interaction after a delay
      setTimeout(() => {
        if (canvasRef.current) {
          console.log('🧪 TestSpacingError: Simulating mouse hover to trigger inRange');
          
          const rect = canvasRef.current.getBoundingClientRect();
          const event = new MouseEvent('mousemove', {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
            bubbles: true
          });
          
          // Log the stack trace when we dispatch the event
          console.trace('🧪 TestSpacingError: Dispatching mouse event');
          canvasRef.current.dispatchEvent(event);
        }
      }, 1000);

    } catch (error) {
      console.error('🧪 TestSpacingError: Error creating chart', error);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      width: 200, 
      height: 200, 
      background: 'white',
      border: '2px solid red',
      padding: 10,
      zIndex: 9999
    }}>
      <h4 style={{ margin: 0, marginBottom: 10 }}>Spacing Error Test</h4>
      <canvas ref={canvasRef} width={180} height={150}></canvas>
    </div>
  );
};