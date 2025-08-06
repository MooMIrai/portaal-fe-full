import React, { useState } from 'react';
import { QueryParameter, ParameterType } from '../../types/query.types';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from '@progress/kendo-react-labels';

interface ParameterFormProps {
  parameter?: QueryParameter;
  type: 'create' | 'edit';
  onSave: (parameter: Partial<QueryParameter>) => void;
  onCancel: () => void;
}

const ParameterForm: React.FC<ParameterFormProps> = ({
  parameter,
  type,
  onSave,
  onCancel
}) => {
  const parameterTypes = [
    { value: ParameterType.STRING, label: 'Testo' },
    { value: ParameterType.NUMBER, label: 'Numero' },
    { value: ParameterType.DATE, label: 'Data' },
    { value: ParameterType.DATETIME, label: 'Data/Ora' },
    { value: ParameterType.BOOLEAN, label: 'Booleano' },
    { value: ParameterType.STATIC_LIST, label: 'Lista Statica' },
    { value: ParameterType.DYNAMIC_LIST, label: 'Lista Dinamica' }
  ];

  const [formData, setFormData] = useState({
    name: parameter?.name || '',
    label: parameter?.label || '',
    type: parameter?.type || ParameterType.STRING,
    required: parameter?.required || false,
    defaultValue: parameter?.defaultValue || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campo obbligatorio';
    }
    
    if (!formData.label.trim()) {
      newErrors.label = 'Campo obbligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        {type === 'create' ? 'Nuovo Parametro' : 'Modifica Parametro'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label>Nome Parametro</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.value)}
              disabled={type === 'edit'}
              placeholder="es: data_inizio"
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
            <div className="text-gray-500 text-sm mt-1">
              Usare solo lettere, numeri e underscore (es: data_inizio)
            </div>
          </div>
          
          <div>
            <Label>Etichetta</Label>
            <Input
              value={formData.label}
              onChange={(e) => handleChange('label', e.value)}
              placeholder="es: Data Inizio"
            />
            {errors.label && (
              <div className="text-red-500 text-sm mt-1">{errors.label}</div>
            )}
            <div className="text-gray-500 text-sm mt-1">
              Etichetta visualizzata all'utente
            </div>
          </div>
          
          <div>
            <Label>Tipo</Label>
            <DropDownList
              data={parameterTypes}
              textField="label"
              dataItemKey="value"
              value={parameterTypes.find(t => t.value === formData.type)}
              onChange={(e) => handleChange('type', e.value?.value)}
            />
          </div>
          
          <div>
            <Checkbox
              label="Obbligatorio"
              value={formData.required}
              onChange={(e) => handleChange('required', e.value)}
            />
          </div>
          
          <div>
            <Label>Valore Predefinito</Label>
            <Input
              value={formData.defaultValue}
              onChange={(e) => handleChange('defaultValue', e.value)}
              placeholder="Lasciare vuoto per nessun valore predefinito"
            />
            <div className="text-gray-500 text-sm mt-1">
              Lasciare vuoto per nessun valore predefinito
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              themeColor="base"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              themeColor="primary"
            >
              {type === 'create' ? 'Crea' : 'Salva'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ParameterForm;