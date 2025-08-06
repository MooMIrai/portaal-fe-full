import React from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';

export const BarChartWidget: React.FC<any> = ({ config }) => {
  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50">
        <h3 className="text-lg font-semibold">{config.title || 'Bar Chart'}</h3>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-center h-full text-gray-500">
          BarChart Widget - Coming Soon
        </div>
      </CardBody>
    </Card>
  );
};