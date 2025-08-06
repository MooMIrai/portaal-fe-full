import React from 'react';
import { Widget, WidgetData } from '../../../types/widget.types';
import { DashboardUserConfig } from '../../../types/dashboard.types';

interface GaugeWidgetProps {
  widget: Widget;
  data: WidgetData;
  config?: DashboardUserConfig;
}

const GaugeWidget: React.FC<GaugeWidgetProps> = ({ widget, data, config }) => {
  return (
    <div className="gauge-widget">
      <div className="text-center">
        <p className="text-sm text-gray-600">Gauge Widget</p>
        <p className="text-lg">Gauge Placeholder</p>
      </div>
    </div>
  );
};

export default GaugeWidget;