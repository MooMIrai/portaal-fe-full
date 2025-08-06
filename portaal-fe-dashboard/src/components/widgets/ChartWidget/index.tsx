import React from 'react';
import { Widget, WidgetData } from '../../../types/widget.types';
import { DashboardUserConfig } from '../../../types/dashboard.types';

interface ChartWidgetProps {
  widget: Widget;
  data: WidgetData;
  config?: DashboardUserConfig;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget, data, config }) => {
  return (
    <div className="chart-widget">
      <div className="text-center">
        <p className="text-sm text-gray-600">Chart Widget</p>
        <p className="text-lg">Chart Placeholder</p>
      </div>
    </div>
  );
};

export default ChartWidget;