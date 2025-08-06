import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { useReportEditor } from '../../contexts/ReportEditorContext';
import { SqlEditor } from '../../components/editor/SqlEditor';
import { ParameterBuilder } from '../../components/parameters/ParameterBuilder';
import { ParameterInputDialog } from '../../components/parameters/ParameterInputDialog';
import { QueryPreview } from '../../components/preview/QueryPreview';
import { Query, ParameterType } from '../../types/query.types';
import { SqlValidator } from '../../services/validators/sqlValidator';
import { extractParametersFromSQL } from '../../utils/parameterExtractor';
import { reportEditorApi } from '../../services/api/reportEditorApi';

const QueryEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    selectedQuery, 
    loading, 
    error,
    executionResult,
    selectQuery, 
    saveQuery, 
    executeQuery,
    loadQueries 
  } = useReportEditor();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState<Partial<Query>>({
    name: '',
    description: '',
    sql: '',
    category: 'Report',
    parameters: [],
    tags: [],
    isPublic: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showParameterDialog, setShowParameterDialog] = useState(false);

  const categories = ['Report', 'Dashboard', 'Export', 'Analytics', 'Custom'];

  // Load query if editing
  useEffect(() => {
    const loadQueryForEdit = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const query = await reportEditorApi.getQuery(parseInt(id));
          console.log('Loaded query for edit:', query);
          selectQuery(query);
        } catch (error) {
          console.error('Error loading query:', error);
          alert('Errore nel caricamento della query');
          navigate('/reporteditor');
        } finally {
          setIsLoading(false);
        }
      } else {
        selectQuery(null);
      }
    };
    
    loadQueryForEdit();
  }, [id, selectQuery, navigate]);

  // Update form when selectedQuery changes
  useEffect(() => {
    if (selectedQuery) {
      setFormData({
        id: selectedQuery.id,
        name: selectedQuery.name,
        description: selectedQuery.description,
        sql: selectedQuery.sql,
        category: selectedQuery.category,
        parameters: selectedQuery.parameters || [],
        tags: selectedQuery.tags || []
      });
    }
  }, [selectedQuery]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSqlChange = (sql: string) => {
    handleFieldChange('sql', sql);
    
    // Validate SQL
    const validation = SqlValidator.validate(sql);
    setValidationErrors(validation.errors);
    
    // Extract parameters
    const detectedParams = extractParametersFromSQL(sql);
    const currentParams = formData.parameters || [];
    
    // Remove parameters that no longer exist in SQL
    const validParams = currentParams.filter(p => detectedParams.includes(p.name));
    
    // Add new parameters
    const currentParamNames = validParams.map(p => p.name);
    const newParams = detectedParams.filter(p => !currentParamNames.includes(p));
    
    const updatedParams = [
      ...validParams,
      ...newParams.map(name => ({
        id: `param_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        type: ParameterType.STRING,
        label: name,
        required: true,
        defaultValue: ''
      }))
    ];
    
    // Only update if there are changes
    if (JSON.stringify(updatedParams) !== JSON.stringify(currentParams)) {
      handleFieldChange('parameters', updatedParams);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate form
      if (!formData.name?.trim()) {
        alert('Il nome della query è obbligatorio');
        return;
      }
      
      if (!formData.sql?.trim()) {
        alert('La query SQL è obbligatoria');
        return;
      }
      
      if (validationErrors.length > 0) {
        alert('Correggere gli errori di validazione prima di salvare');
        return;
      }
      
      const savedQuery = await saveQuery(formData as Query);
      setIsDirty(false);
      
      if (!id && savedQuery.id) {
        // If creating new, navigate to edit mode
        navigate(`/reporteditor/edit/${savedQuery.id}`);
      }
      
      alert('Query salvata con successo');
    } catch (err) {
      console.error('Error saving query:', err);
      alert('Errore nel salvataggio della query');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecute = useCallback(() => {
    if (!formData.id) {
      alert('Salvare la query prima di eseguirla');
      return;
    }
    
    // If query has parameters, show dialog to collect values
    if (formData.parameters && formData.parameters.length > 0) {
      setShowParameterDialog(true);
    } else {
      // No parameters, execute directly
      if (formData.id) {
        executeQuery(formData.id, {});
        setSelectedTab(2);
      }
    }
  }, [formData, executeQuery]);

  const executeQueryWithParams = useCallback(async (parameterValues: Record<string, any>) => {
    if (!formData.id) return;
    
    await executeQuery(formData.id, parameterValues);
    setSelectedTab(2); // Switch to preview tab
  }, [formData.id, executeQuery]);

  const handleTabSelect = (e: any) => {
    setSelectedTab(e.selected);
  };

  const handleBack = () => {
    if (isDirty) {
      if (!window.confirm('Ci sono modifiche non salvate. Vuoi uscire?')) {
        return;
      }
    }
    navigate('/reporteditor');
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="k-loading-indicator k-loading-indicator-large mb-4"></div>
          <p>Caricamento query...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {id ? 'Modifica Query' : 'Nuova Query'}
            </h1>
            <p className="text-gray-600">
              Crea o modifica query SQL con parametri dinamici
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={handleBack} themeColor="base">
              Indietro
            </Button>
            <Button
              onClick={handleExecute}
              disabled={!formData.sql || validationErrors.length > 0}
              themeColor="info"
            >
              Esegui
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || (!isDirty && id)}
              themeColor="primary"
            >
              {isSaving ? 'Salvataggio...' : 'Salva'}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Query *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.value)}
                placeholder="Nome della query"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <DropDownList
                data={categories}
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
              <Input
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.value)}
                placeholder="Descrizione opzionale"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <TabStrip selected={selectedTab} onSelect={handleTabSelect}>
            <TabStripTab title="SQL Editor">
              <div className="p-4" style={{ minHeight: '600px' }}>
                {validationErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <div className="font-semibold text-red-700 mb-1">
                      Errori di validazione:
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-600">
                      {validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                  <SqlEditor
                    value={formData.sql || ''}
                    onChange={handleSqlChange}
                    height="500px"
                  />
                </div>
              </div>
            </TabStripTab>
            
            <TabStripTab title="Parametri">
              <div className="p-4">
                <ParameterBuilder
                  parameters={formData.parameters || []}
                  onParametersChange={(params) => handleFieldChange('parameters', params)}
                  sqlQuery={formData.sql || ''}
                />
              </div>
            </TabStripTab>
            
            <TabStripTab title="Anteprima">
              <div className="p-4">
                <QueryPreview
                  result={executionResult}
                  loading={loading}
                  onRefresh={handleExecute}
                />
              </div>
            </TabStripTab>
          </TabStrip>
        </CardBody>
      </Card>
      </div>

      {showParameterDialog && formData.parameters && (
        <ParameterInputDialog
          parameters={formData.parameters}
          onExecute={(values) => {
            setShowParameterDialog(false);
            executeQueryWithParams(values);
          }}
          onCancel={() => setShowParameterDialog(false)}
        />
      )}
    </>
  );
};

export default QueryEditor;