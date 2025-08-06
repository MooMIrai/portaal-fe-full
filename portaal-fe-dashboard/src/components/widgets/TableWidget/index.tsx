import React from 'react';
import { Widget, WidgetData } from '../../../types/widget.types';
import { DashboardUserConfig } from '../../../types/dashboard.types';

interface TableWidgetProps {
  widget: Widget;
  data: WidgetData;
  config?: DashboardUserConfig;
}

const TableWidget: React.FC<TableWidgetProps> = ({ widget, data, config }) => {
  return (
    <div className="table-widget">
      <div className="text-center">
        <p className="text-sm text-gray-600">Table Widget</p>
        <p className="text-lg">Table Placeholder</p>
      </div>
    </div>
  );
};

export default TableWidget;