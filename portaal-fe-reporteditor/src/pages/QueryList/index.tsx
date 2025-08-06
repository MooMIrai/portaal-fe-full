import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@progress/kendo-react-inputs';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { useReportEditor } from '../../contexts/ReportEditorContext';
import { reportEditorApi } from '../../services/api/reportEditorApi';
import GridTable from 'common/Table';
import Button from 'common/Button';

const QueryList: React.FC = () => {
  console.log('[QueryList] Component rendering');
  
  const navigate = useNavigate();
  const { deleteQuery } = useReportEditor();
  const [searchTerm, setSearchTerm] = useState('');
  const [sorting, setSorting] = useState<any[]>([]);
  const [initialPagination] = useState<any>({
    currentPage: 1,
    pageSize: 20
  });
  const gridRef = useRef<any>(null);
  
  // Log when component mounts
  useEffect(() => {
    console.log('[QueryList] Component mounted');
  }, []);

  // Define columns
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      type: "string",
      filter: "text",
      width: 250
    },
    {
      key: 'description',
      label: 'Descrizione',
      sortable: true,
      type: "string",
      filter: "text"
    },
    {
      key: 'category',
      label: 'Categoria',
      sortable: true,
      type: "string",
      filter: "text",
      width: 150
    },
    {
      key: 'sql',
      label: 'Query SQL',
      sortable: true,
      type: "string",
      filter: "text",
      width: 300
    },
    {
      key: 'updatedAt',
      label: 'Ultima Modifica',
      sortable: true,
      type: "datetime",
      filter: "date",
      width: 180
    },
    {
      key: 'createdBy',
      label: 'Creato da',
      sortable: true,
      type: "string",
      filter: "text",
      width: 150
    }
  ];

  // getData function for GridTable - call API directly like other grids
  const getData = async (pagination: any, filter?: any, sorting?: any[]) => {
    console.log('[QueryList] getData called with:', { pagination, filter, sorting });
    try {
      // Build params for API call
      const params: any = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      };
      
      // Add search if present
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Add category filter if present
      if (filter && filter.filters && filter.filters.length > 0) {
        const categoryFilter = filter.filters.find((f: any) => f.field === 'category');
        if (categoryFilter && categoryFilter.value) {
          params.category = categoryFilter.value;
        }
      }
      
      // Call API directly
      console.log('[QueryList] Calling API with params:', params);
      const response = await reportEditorApi.getQueries(params);
      
      console.log('[QueryList] API response:', response);
      
      // The API returns { data: Query[], total: number }
      return {
        data: response.data || [],
        meta: { total: response.total || 0 }
      };
    } catch (error) {
      console.error('Error loading queries:', error);
      return {
        data: [],
        meta: { total: 0 }
      };
    }
  };

  // Helper function to apply filters
  const applyFilter = (item: any, filter: any): boolean => {
    if (!filter.filters || filter.filters.length === 0) return true;
    
    const logic = filter.logic || 'and';
    
    if (logic === 'and') {
      return filter.filters.every((f: any) => {
        if (f.filters) {
          return applyFilter(item, f);
        }
        return checkFilter(item, f);
      });
    } else {
      return filter.filters.some((f: any) => {
        if (f.filters) {
          return applyFilter(item, f);
        }
        return checkFilter(item, f);
      });
    }
  };

  // Helper function to check a single filter
  const checkFilter = (item: any, filter: any): boolean => {
    const value = getNestedValue(item, filter.field);
    const filterValue = filter.value;
    
    if (filterValue === null || filterValue === undefined || filterValue === '') {
      return true;
    }
    
    switch (filter.operator) {
      case 'contains':
        return value?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
      case 'eq':
        return value === filterValue;
      case 'neq':
        return value !== filterValue;
      case 'startswith':
        return value?.toString().toLowerCase().startsWith(filterValue.toString().toLowerCase());
      case 'endswith':
        return value?.toString().toLowerCase().endsWith(filterValue.toString().toLowerCase());
      case 'gte':
        return value >= filterValue;
      case 'lte':
        return value <= filterValue;
      case 'gt':
        return value > filterValue;
      case 'lt':
        return value < filterValue;
      default:
        return true;
    }
  };

  // Helper function to get nested property value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  };

  // Define actions
  const actions = () => [
    "show",
    "edit",
    "delete",
    "create"
  ];

  // Form for CRUD operations
  const formCrud = (row: any, type: string, closeModalCallback: () => void, refreshTable: () => void) => {
    if (type === "create" || type === "edit") {
      // Navigate to editor
      if (row?.id) {
        navigate(`/reporteditor/edit/${row.id}`);
      } else {
        navigate('/reporteditor/new');
      }
      closeModalCallback();
    } else if (type === "delete") {
      return (
        <div className="p-4">
          <p className="mb-4">Sei sicuro di voler eliminare la query "{row?.name}"?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={closeModalCallback} themeColor="base">
              Annulla
            </Button>
            <Button
              onClick={async () => {
                await deleteQuery(row.id);
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
    } else if (type === "show") {
      // Navigate to view mode
      navigate(`/reporteditor/edit/${row.id}`);
      closeModalCallback();
    }
    return <div />;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Query Report Editor</h1>
        <p className="text-gray-600">Gestisci e crea query SQL per report e dashboard</p>
      </div>

      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Cerca query..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.value || '');
                // Trigger grid refresh
                if (gridRef.current) {
                  gridRef.current.refreshTable();
                }
              }}
              style={{ width: '300px' }}
            />
            <div className="space-x-2">
              <Button
                themeColor="info"
                onClick={() => navigate('/reporteditor/templates')}
              >
                Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <GridTable
            ref={gridRef}
            getData={getData}
            columns={columns}
            actions={actions}
            formCrud={formCrud}
            initialPagination={initialPagination}
            sorting={sorting}
            setSorting={setSorting}
            sortable={true}
            resizable={true}
            pageable={true}
            filterable={true}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default QueryList;