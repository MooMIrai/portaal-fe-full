import React from 'react';
import { Widget } from '../../../types/widget.types';
import { WidgetContainer } from '../WidgetContainer';
import { useDashboard } from '../../../contexts/DashboardContext';
import './styles.css';

interface WidgetGridProps {
  widgets: Widget[];
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets }) => {
  const { userConfigs } = useDashboard();

  // Sort widgets by position
  const sortedWidgets = [...widgets].sort((a, b) => {
    const posA = userConfigs[a.id]?.position ?? a.id;
    const posB = userConfigs[b.id]?.position ?? b.id;
    return posA - posB;
  });

  return (
    <div className="widget-grid">
      {sortedWidgets.map((widget) => (
        <WidgetContainer
          key={widget.id}
          widget={widget}
          userConfig={userConfigs[widget.id]}
        />
      ))}
    </div>
  );
};