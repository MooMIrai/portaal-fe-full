import React from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { WidgetProps } from '../../types/widget.types';
import { formatNumber, formatDate } from '../../utils/formatters';
import { formatParametersDisplay } from '../../utils/parameterFormatters';

export const Table: React.FC<WidgetProps> = ({ widget, data, loading, error, currentFilters }) => {
  if (loading) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center">
          <div className="k-loading-indicator k-loading-indicator-large"></div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ width: '100%', height: '100%' }}>
        <CardBody className="flex items-center justify-center text-red-500">
          <div>Errore nel caricamento dei dati</div>
        </CardBody>
      </Card>
    );
  }

  const tableData = data?.data || [];
  const columns = widget.config?.columns || [];

  const renderCell = (props: any, column: any) => {
    const value = props.dataItem[column.field];
    
    if (column.format === 'currency') {
      return <td>{formatNumber(value, 'currency')}</td>;
    } else if (column.format === 'percentage') {
      return <td>{formatNumber(value, 'percentage')}</td>;
    } else if (column.format === 'date') {
      return <td>{formatDate(value)}</td>;
    } else if (column.format === 'number') {
      return <td>{formatNumber(value)}</td>;
    }
    
    return <td>{value}</td>;
  };
  
  // Format parameters for display
  const formattedParameters = formatParametersDisplay(currentFilters, widget.parameters);

  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50">
        <h3 className="text-lg font-semibold">
          {widget.name}
          <span className="ml-2 text-sm text-gray-500">(ID: {widget.id})</span>
        </h3>
        {formattedParameters && (
          <div className="text-sm text-gray-600 mt-1">{formattedParameters}</div>
        )}
      </CardHeader>
      <CardBody>
        <Grid
          data={tableData}
          style={{ height: '400px' }}
          pageable={widget.config?.pageable !== false}
          sortable={widget.config?.sortable !== false}
        >
          {columns.length > 0 ? (
            columns.map((col: any) => (
              <GridColumn
                key={col.field}
                field={col.field}
                title={col.title}
                width={col.width}
                cell={(props) => renderCell(props, col)}
              />
            ))
          ) : (
            // Auto-generate columns from data
            tableData.length > 0 &&
            Object.keys(tableData[0]).map((key) => (
              <GridColumn key={key} field={key} title={key} />
            ))
          )}
        </Grid>
      </CardBody>
    </Card>
  );
};