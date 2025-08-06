import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Grid, GridColumn, GridPageChangeEvent, GridSortChangeEvent, GridFilterChangeEvent, GridToolbar } from '@progress/kendo-react-grid';
import { process, State } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Button } from '@progress/kendo-react-buttons';
import { WidgetProps } from '../../../types/widgetConfig.types';
import { TableConfig } from '../../../types/widgetConfig.types';

export const TableWidget: React.FC<WidgetProps<TableConfig>> = ({ data, config }) => {
  const [gridState, setGridState] = useState<State>({
    skip: 0,
    take: config.pageSize || 10,
    sort: [],
    filter: undefined,
    group: []
  });
  
  const _export = React.useRef<ExcelExport | null>(null);
  
  const processedData = useMemo(() => {
    return process(data, gridState);
  }, [data, gridState]);
  
  const handleGridDataStateChange = (e: any) => {
    setGridState(e.dataState);
  };
  
  const handleExportExcel = () => {
    if (_export.current) {
      _export.current.save();
    }
  };
  
  const renderColumn = (column: any) => {
    const columnProps: any = {
      field: column.field,
      title: column.title || column.field,
      width: column.width,
      sortable: column.sortable !== false && config.sortable !== false,
      filterable: column.filterable === true && config.filterable === true,
      resizable: config.resizable !== false,
      reorderable: config.reorderable !== false,
    };
    
    // Format handling
    if (column.format) {
      columnProps.format = column.format;
    }
    
    // Custom cell rendering for templates
    if (column.template) {
      columnProps.cell = (props: any) => {
        const value = props.dataItem[column.field];
        // Simple template replacement
        const html = column.template.replace(new RegExp(`{${column.field}}`, 'g'), value);
        return <td dangerouslySetInnerHTML={{ __html: html }} />;
      };
    }
    
    // Type-specific formatting
    if (column.type === 'date') {
      columnProps.format = column.format || '{0:dd/MM/yyyy}';
    } else if (column.type === 'number') {
      columnProps.format = column.format || '{0:n0}';
    }
    
    return <GridColumn key={column.field} {...columnProps} />;
  };
  
  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader className="bg-gray-50 px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{config.title}</h3>
          {config.exportable && (
            <Button
              onClick={handleExportExcel}
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            >
              <i className="fas fa-file-excel mr-2" />
              Esporta Excel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <ExcelExport
          data={processedData.data}
          ref={_export}
          fileName={`${config.title || 'export'}.xlsx`}
        >
          <Grid
            style={{ height: '100%' }}
            data={processedData}
            {...gridState}
            onDataStateChange={handleGridDataStateChange}
            sortable={config.sortable !== false}
            filterable={config.filterable === true}
            groupable={config.groupable === true}
            reorderable={config.reorderable !== false}
            resizable={config.resizable !== false}
            pageable={{
              buttonCount: 5,
              pageSizes: [10, 20, 50, 100],
              pageSizeValue: config.pageSize || 10
            }}
          >
            {config.filterable && (
              <GridToolbar>
                <div className="k-toolbar-spacer" />
                <span className="text-sm text-gray-600">
                  {processedData.total} record totali
                </span>
              </GridToolbar>
            )}
            {config.columns.map(renderColumn)}
          </Grid>
        </ExcelExport>
      </CardBody>
    </Card>
  );
};