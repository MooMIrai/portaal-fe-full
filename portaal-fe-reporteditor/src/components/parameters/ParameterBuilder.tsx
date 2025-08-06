import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { QueryParameter, ParameterType } from '../../types/query.types';
import GridTable from 'common/Table';
import Button from 'common/Button';
import ParameterForm from './ParameterForm';
import { extractParametersFromSQL } from '../../utils/parameterExtractor';

interface ParameterBuilderProps {
  parameters: QueryParameter[];
  onParametersChange: (parameters: QueryParameter[]) => void;
  sqlQuery: string;
}

export const ParameterBuilder: React.FC<ParameterBuilderProps> = ({
  parameters,
  onParametersChange,
  sqlQuery
}) => {
  const gridRef = useRef<any>(null);
  const [hasAutoDetected, setHasAutoDetected] = useState(false);
  
  console.log('[ParameterBuilder] Rendering with:', { parameters, sqlQuery });
  
  // Ensure parameters is always an array
  const safeParameters = Array.isArray(parameters) ? parameters : [];

  // Auto-detect parameters when SQL changes and there are no parameters yet
  useEffect(() => {
    console.log('[ParameterBuilder] useEffect triggered:', { 
      sqlQuery, 
      parametersLength: safeParameters.length, 
      hasAutoDetected 
    });
    
    if (sqlQuery && safeParameters.length === 0 && !hasAutoDetected) {
      const detectedParams = extractParametersFromSQL(sqlQuery);
      console.log('[ParameterBuilder] Detected params:', detectedParams);
      
      if (detectedParams.length > 0) {
        const newParams = detectedParams.map(name => ({
          id: `param_${Date.now()}_${name}`,
          name,
          label: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
          type: ParameterType.STRING,
          required: true,
        }));
        console.log('[ParameterBuilder] Creating new params:', newParams);
        onParametersChange(newParams);
        setHasAutoDetected(true);
        
        // Force grid refresh after parameters change
        setTimeout(() => {
          if (gridRef.current) {
            console.log('[ParameterBuilder] Forcing grid refresh');
            gridRef.current.refreshTable();
          }
        }, 100);
      }
    }
  }, [sqlQuery, safeParameters.length, hasAutoDetected, onParametersChange]);

  // Define columns for the parameter grid
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      type: "string",
      filter: "text",
      width: 150
    },
    {
      key: 'label',
      label: 'Etichetta',
      sortable: true,
      type: "string",
      filter: "text",
      width: 200
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      type: "string",
      filter: "text",
      width: 120,
      render: (rowData: any) => {
        const typeLabels: Record<ParameterType, string> = {
          [ParameterType.STRING]: 'Testo',
          [ParameterType.NUMBER]: 'Numero',
          [ParameterType.DATE]: 'Data',
          [ParameterType.DATETIME]: 'Data/Ora',
          [ParameterType.BOOLEAN]: 'Booleano',
          [ParameterType.STATIC_LIST]: 'Lista Statica',
          [ParameterType.DYNAMIC_LIST]: 'Lista Dinamica'
        };
        return <td>{typeLabels[rowData.type] || rowData.type}</td>;
      }
    },
    {
      key: 'required',
      label: 'Obbligatorio',
      sortable: true,
      type: "boolean",
      filter: "boolean",
      width: 100,
      render: (rowData: any) => {
        return <td>{rowData.required ? 'Sì' : 'No'}</td>;
      }
    },
    {
      key: 'defaultValue',
      label: 'Valore Predefinito',
      sortable: true,
      type: "string",
      filter: "text",
      width: 150
    }
  ];

  // getData function for GridTable
  const getData = async (pagination: any, filter?: any, sorting?: any[]) => {
    console.log('[ParameterBuilder] getData called, parameters:', safeParameters);
    
    // For now, return all data with client-side filtering
    let filteredData = safeParameters;
    
    // Apply pagination
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const paginatedData = filteredData.slice(start, end);

    const result = {
      data: paginatedData,
      meta: { total: filteredData.length }
    };
    
    return result;
  };

  // Define actions
  const actions = () => [
    "create",
    "edit",
    "delete"
  ];

  // Form for CRUD operations
  const formCrud = (row: any, type: string, closeModalCallback: () => void, refreshTable: () => void) => {
    if (type === "create" || type === "edit") {
      return (
        <ParameterForm
          parameter={type === "edit" ? row : undefined}
          type={type}
          onSave={(param) => {
            if (type === "create") {
              const newParam: QueryParameter = {
                ...param,
                id: `param_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              };
              onParametersChange([...safeParameters, newParam]);
            } else {
              onParametersChange(
                safeParameters.map(p => p.id === row.id ? { ...p, ...param } : p)
              );
            }
            closeModalCallback();
            refreshTable();
          }}
          onCancel={closeModalCallback}
        />
      );
    } else if (type === "delete") {
      return (
        <div className="p-4">
          <p className="mb-4">Sei sicuro di voler eliminare il parametro "{row?.label || row?.name}"?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={closeModalCallback} themeColor="base">
              Annulla
            </Button>
            <Button
              onClick={() => {
                onParametersChange(safeParameters.filter(p => p.id !== row.id));
                closeModalCallback();
                refreshTable();
              }}
              themeColor="error"
            >
              Elimina
            </Button>
          </div>
        </div>
      );
    }
    return <div />;
  };

  const autoDetectParameters = () => {
    const detectedParams = extractParametersFromSQL(sqlQuery);
    
    const newParams = detectedParams
      .filter(name => !safeParameters.some(p => p.name === name))
      .map(name => ({
        id: `param_${Date.now()}_${name}`,
        name,
        label: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        type: ParameterType.STRING,
        required: true,
      }));
    
    if (newParams.length > 0) {
      const updatedParams = [...safeParameters, ...newParams];
      onParametersChange(updatedParams);
      // Force grid refresh after a small delay to ensure state is updated
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.refreshTable();
        }
      }, 100);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Parametri Query</h3>
          <Button
            onClick={autoDetectParameters}
            themeColor="info"
            size="small"
          >
            Auto-detect
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <GridTable
          ref={gridRef}
          getData={getData}
          columns={columns}
          actions={actions}
          formCrud={formCrud}
          initialPagination={{ currentPage: 1, pageSize: 10 }}
          sortable={true}
          resizable={true}
          pageable={true}
          filterable={false}
        />
      </CardBody>
    </Card>
  );
};

const requiredValidator = (value: any) => value ? "" : "Campo obbligatorio";