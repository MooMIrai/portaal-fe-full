import React, { useState, useEffect } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { arrowRightIcon, plusIcon, deleteIcon } from '@progress/kendo-svg-icons';
import { WidgetType } from '../../types/widget.types';
import { DataSourceConfig, DataMapping } from '../../types/config.types';
import { WIDGET_INFO } from '../../constants';

interface DataSourceMapperProps {
  widgetType: WidgetType;
  onDataSourceChange: (dataSource: DataSourceConfig) => void;
  onMappingChange?: (mapping: DataMapping[]) => void;
}

const DataSourceMapper: React.FC<DataSourceMapperProps> = ({
  widgetType,
  onDataSourceChange,
  onMappingChange
}) => {
  const [dataSource, setDataSource] = useState<DataSourceConfig>({
    type: 'api',
    endpoint: '',
    method: 'POST',
    parameters: []
  });
  
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [mappings, setMappings] = useState<DataMapping[]>([]);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const requiredFields = WIDGET_INFO[widgetType]?.requiredFields || [];

  useEffect(() => {
    // Inizializza mappings per i campi richiesti
    const initialMappings = requiredFields.map(field => ({
      sourceField: '',
      targetField: field,
      transform: 'none' as const
    }));
    setMappings(initialMappings);
  }, [widgetType]);

  const handleDataSourceChange = (field: string, value: any) => {
    const newDataSource = { ...dataSource, [field]: value };
    setDataSource(newDataSource);
    onDataSourceChange(newDataSource);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      // TODO: Implementare test connessione reale
      console.log('Testing connection:', dataSource);
      
      // Simulazione test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dati di esempio dal test
      const sampleResponse = {
        data: [
          {
            id: 1,
            name: 'Item 1',
            value: 100,
            date: '2024-01-01',
            category: 'Category A'
          }
        ]
      };
      
      setTestResult(sampleResponse);
      
      // Estrai campi disponibili
      if (sampleResponse.data && sampleResponse.data.length > 0) {
        const fields = Object.keys(sampleResponse.data[0]);
        setAvailableFields(fields);
      }
    } catch (error) {
      console.error('Test connection failed:', error);
      setTestResult({ error: 'Connessione fallita' });
    } finally {
      setTesting(false);
    }
  };

  const handleMappingChange = (index: number, field: string, value: any) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
    onMappingChange?.(newMappings);
  };

  const addParameter = () => {
    const newParams = [...(dataSource.parameters || []), {
      name: '',
      type: 'string',
      value: ''
    }];
    handleDataSourceChange('parameters', newParams);
  };

  const removeParameter = (index: number) => {
    const newParams = dataSource.parameters?.filter((_, i) => i !== index) || [];
    handleDataSourceChange('parameters', newParams);
  };

  return (
    <div className="data-source-mapper">
      {/* Data Source Configuration */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3">Sorgente Dati</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <DropDownList
              data={[
                { value: 'api', label: 'API Endpoint' },
                { value: 'query', label: 'Query Salvata' },
                { value: 'static', label: 'Dati Statici' }
              ]}
              textField="label"
              dataItemKey="value"
              value={{ value: dataSource.type, label: dataSource.type }}
              onChange={(e) => handleDataSourceChange('type', e.value.value)}
            />
          </div>

          {dataSource.type === 'api' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Endpoint</label>
                <Input
                  value={dataSource.endpoint}
                  onChange={(e) => handleDataSourceChange('endpoint', e.value)}
                  placeholder="/api/v1/structured-widget/1/structured"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Metodo</label>
                <DropDownList
                  data={['GET', 'POST']}
                  value={dataSource.method}
                  onChange={(e) => handleDataSourceChange('method', e.value)}
                />
              </div>

              {/* Parameters */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Parametri</label>
                  <Button
                    size="small"
                    icon={plusIcon}
                    onClick={addParameter}
                  >
                    Aggiungi
                  </Button>
                </div>
                
                {dataSource.parameters?.map((param, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={param.name}
                      onChange={(e) => {
                        const newParams = [...(dataSource.parameters || [])];
                        newParams[index].name = e.value || '';
                        handleDataSourceChange('parameters', newParams);
                      }}
                      placeholder="Nome"
                      style={{ width: '40%' }}
                    />
                    <Input
                      value={param.value}
                      onChange={(e) => {
                        const newParams = [...(dataSource.parameters || [])];
                        newParams[index].value = e.value || '';
                        handleDataSourceChange('parameters', newParams);
                      }}
                      placeholder="Valore"
                      style={{ width: '40%' }}
                    />
                    <Button
                      fillMode="flat"
                      icon={deleteIcon}
                      onClick={() => removeParameter(index)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <Button
            primary
            onClick={handleTestConnection}
            disabled={testing || !dataSource.endpoint}
          >
            {testing ? 'Test in corso...' : 'Test Connessione'}
          </Button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className="mb-6 p-3 bg-gray-50 rounded">
          <h5 className="text-sm font-medium mb-2">Risultato Test</h5>
          {testResult.error ? (
            <p className="text-red-600 text-sm">{testResult.error}</p>
          ) : (
            <div className="text-sm">
              <p className="text-green-600 mb-2">✓ Connessione riuscita</p>
              <p className="text-gray-600">
                Campi disponibili: {availableFields.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Field Mapping */}
      {availableFields.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-3">Mappatura Campi</h4>
          
          <div className="space-y-3">
            {mappings.map((mapping, index) => (
              <div key={index} className="data-mapping-field">
                <DropDownList
                  data={availableFields}
                  value={mapping.sourceField}
                  onChange={(e) => handleMappingChange(index, 'sourceField', e.value)}
                  placeholder="Seleziona campo sorgente"
                  style={{ width: '45%' }}
                />
                
                <span className="data-mapping-arrow mx-2">
                  {arrowRightIcon}
                </span>
                
                <Input
                  value={mapping.targetField}
                  disabled
                  style={{ width: '45%' }}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Suggerimento:</strong> Mappa i campi della sorgente dati 
              ai campi richiesti dal widget {WIDGET_INFO[widgetType]?.name}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourceMapper;