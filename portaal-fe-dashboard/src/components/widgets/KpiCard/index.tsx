import React from 'react';
import { Widget, WidgetData } from '../../../types/widget.types';
import { DashboardUserConfig } from '../../../types/dashboard.types';

interface KpiCardProps {
  widget: Widget;
  data: WidgetData;
  config?: DashboardUserConfig;
}

const KpiCard: React.FC<KpiCardProps> = ({ widget, data, config }) => {
  return (
    <div className="kpi-card">
      <div className="text-center">
        <p className="text-sm text-gray-600">KPI Widget</p>
        <p className="text-2xl font-bold">Placeholder</p>
      </div>
    </div>
  );
};

export default KpiCard;