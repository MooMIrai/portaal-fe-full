import React, { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { QueryExecutionResult } from '../../types/query.types';

interface QueryPreviewProps {
  result: QueryExecutionResult | null;
  loading: boolean;
  onRefresh: () => void;
}

export const QueryPreview: React.FC<QueryPreviewProps> = ({
  result,
  loading,
  onRefresh
}) => {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);
  const excelExportRef = React.useRef<ExcelExport>(null);

  const handleExcelExport = () => {
    if (excelExportRef.current) {
      excelExportRef.current.save();
    }
  };

  const handlePageChange = (event: any) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  if (!result && !loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Esegui la query per visualizzare i risultati
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Risultati Query</h3>
            {result && (
              <div className="text-sm text-gray-600">
                {result.rowCount} righe • {result.executionTime}ms
              </div>
            )}
          </div>
          <div className="space-x-2">
            <Button
              onClick={onRefresh}
              disabled={loading}
              themeColor="info"
              size="small"
            >
              Aggiorna
            </Button>
            <Button
              onClick={handleExcelExport}
              disabled={!result || result.data.length === 0}
              themeColor="success"
              size="small"
            >
              Esporta Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="k-loading-indicator k-loading-indicator-large"></div>
          </div>
        ) : result?.error ? (
          <div className="p-4 bg-red-50 text-red-700">
            <div className="font-semibold">Errore nell'esecuzione:</div>
            <div className="mt-1">{result.error}</div>
          </div>
        ) : result ? (
          <>
            <ExcelExport
              data={result.data}
              fileName="query-results.xlsx"
              ref={excelExportRef}
            >
              <Grid
                data={result.data.slice(skip, skip + take)}
                skip={skip}
                take={take}
                total={result.rowCount}
                pageable={true}
                onPageChange={handlePageChange}
                sortable={true}
                resizable={true}
                style={{ height: '500px' }}
              >
                {result.columns.map((column) => (
                  <GridColumn
                    key={column.field}
                    field={column.field}
                    title={column.title}
                    width={column.width}
                  />
                ))}
              </Grid>
            </ExcelExport>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
};