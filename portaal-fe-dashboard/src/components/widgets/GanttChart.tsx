import React from 'react';

interface GanttData {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface GanttChartProps {
  data: GanttData[];
  style?: React.CSSProperties;
  height?: string | number;
}

/**
 * Placeholder Gantt Chart component
 * Chart.js doesn't have native support for Gantt/rangeBar charts
 * Consider using specialized libraries like gantt-chart-react or dhtmlx-gantt
 */
export const GanttChart: React.FC<GanttChartProps> = ({ data, style, height = '400px' }) => {
  return (
    <div style={{ height, width: '100%', ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <div className="text-center p-4">
        <p className="text-gray-600 mb-2">Gantt Chart non supportato</p>
        <p className="text-sm text-gray-500">
          Chart.js non supporta nativamente i grafici Gantt.
          Si consiglia di utilizzare librerie specializzate.
        </p>
        <div className="mt-4 text-xs text-gray-400">
          Dati: {data.length} attività
        </div>
      </div>
    </div>
  );
};

// Export a simplified version that works with template data
export const Gantt: React.FC<{ data?: any[]; [key: string]: any }> = ({ data = [], ...props }) => {
  // Transform data if needed
  const ganttData = data.map(item => ({
    title: item.title || item.name || 'Task',
    start: item.start instanceof Date ? item.start : new Date(item.start),
    end: item.end instanceof Date ? item.end : new Date(item.end),
    color: item.color || '#007bff'
  }));

  return <GanttChart data={ganttData} {...props} />;
};