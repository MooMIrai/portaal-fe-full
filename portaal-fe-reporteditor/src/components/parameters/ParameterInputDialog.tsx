import React, { useState } from 'react';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Label } from '@progress/kendo-react-labels';
import { QueryParameter, ParameterType } from '../../types/query.types';

interface ParameterInputDialogProps {
  parameters: QueryParameter[];
  onExecute: (values: Record<string, any>) => void;
  onCancel: () => void;
}

export const ParameterInputDialog: React.FC<ParameterInputDialogProps> = ({
  parameters,
  onExecute,
  onCancel
}) => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    parameters.forEach(param => {
      initial[param.name] = param.defaultValue || '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (paramName: string, value: any) => {
    setValues(prev => ({ ...prev, [paramName]: value }));
    // Clear error when user types
    if (errors[paramName]) {
      setErrors(prev => ({ ...prev, [paramName]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    parameters.forEach(param => {
      const value = values[param.name];
      
      if (param.required && (!value || value === '')) {
        newErrors[param.name] = 'Campo obbligatorio';
      } else if (value && param.type === ParameterType.NUMBER) {
        const num = Number(value);
        if (isNaN(num)) {
          newErrors[param.name] = 'Deve essere un numero valido';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Convert values to proper types
      const convertedValues: Record<string, any> = {};
      
      parameters.forEach(param => {
        const value = values[param.name];
        
        // Skip empty non-required parameters
        if (!param.required && (!value || value === '')) {
          return;
        }
        
        switch (param.type) {
          case ParameterType.NUMBER:
            convertedValues[param.name] = Number(value);
            break;
          case ParameterType.BOOLEAN:
            convertedValues[param.name] = value === true || value === 'true';
            break;
          case ParameterType.DATE:
          case ParameterType.DATETIME:
            convertedValues[param.name] = value instanceof Date ? value.toISOString() : value;
            break;
          default:
            convertedValues[param.name] = value;
        }
      });
      
      onExecute(convertedValues);
    }
  };

  const renderInput = (param: QueryParameter) => {
    const value = values[param.name];
    
    switch (param.type) {
      case ParameterType.NUMBER:
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(param.name, e.value)}
            placeholder={`Inserisci ${param.label}`}
          />
        );
        
      case ParameterType.DATE:
      case ParameterType.DATETIME:
        return (
          <DatePicker
            value={value ? new Date(value) : null}
            onChange={(e) => handleChange(param.name, e.value)}
            format={param.type === ParameterType.DATETIME ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
          />
        );
        
      case ParameterType.BOOLEAN:
        return (
          <Checkbox
            value={value === true || value === 'true'}
            onChange={(e) => handleChange(param.name, e.value)}
          />
        );
        
      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleChange(param.name, e.value)}
            placeholder={`Inserisci ${param.label}`}
          />
        );
    }
  };

  return (
    <Dialog title="Parametri Query" onClose={onCancel} width={500}>
      <div className="p-4">
        <p className="mb-4">Inserisci i valori per i parametri della query:</p>
        
        <div className="space-y-4">
          {parameters.map(param => (
            <div key={param.name}>
              <Label>
                {param.label || param.name}
                {param.required && <span className="text-red-500"> *</span>}
              </Label>
              {renderInput(param)}
              {errors[param.name] && (
                <div className="text-red-500 text-sm mt-1">{errors[param.name]}</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={onCancel} themeColor="base">
            Annulla
          </Button>
          <Button onClick={handleSubmit} themeColor="primary">
            Esegui Query
          </Button>
        </div>
      </div>
    </Dialog>
  );
};