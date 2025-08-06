import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Button 
} from '@progress/kendo-react-buttons';
import './WidgetFilters.css';
import { 
  DatePicker,
  DateRangePicker
} from '@progress/kendo-react-dateinputs';
import { 
  DropDownList,
  AutoComplete
} from '@progress/kendo-react-dropdowns';
import { 
  Input,
  NumericTextBox,
  Switch
} from '@progress/kendo-react-inputs';
import { 
  Form,
  Field,
  FormElement,
  FieldWrapper
} from '@progress/kendo-react-form';
import { Label } from '@progress/kendo-react-labels';
import { Widget, WidgetParameter } from '../../types/widget.types';
import { filterIcon } from '@progress/kendo-svg-icons';
import YearMonthPicker from 'common/YearMonthPicker';

interface WidgetFiltersProps {
  widget: Widget;
  currentValues: Record<string, any>;
  onApply: (filters: Record<string, any>) => void;
  onReset: () => void;
  isLoading?: boolean;
  displayMode?: 'popup' | 'inline';
  autoApply?: boolean; // Force auto-apply even in popup mode
}

export const WidgetFilters: React.FC<WidgetFiltersProps> = ({
  widget,
  currentValues,
  onApply,
  onReset,
  isLoading,
  displayMode = 'popup',
  autoApply = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(currentValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize form with default values
    const defaults: Record<string, any> = {};
    widget.parameters?.forEach(param => {
      if (param.default_value) {
        defaults[param.name] = param.default_value;
      }
    });
    setFormData({ ...defaults, ...currentValues });
  }, [widget.parameters, currentValues]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleResize = () => {
        calculateDropdownPosition();
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [isOpen]);

  // Determine if parameter is year/month type based on name or label
  const isYearMonthParam = (param: WidgetParameter): boolean => {
    const nameOrLabel = (param.name + ' ' + param.label).toLowerCase();
    return nameOrLabel.includes('anno') && nameOrLabel.includes('mese') || 
           nameOrLabel.includes('year') && nameOrLabel.includes('month');
  };

  // Determine if parameter is year only type
  const isYearOnlyParam = (param: WidgetParameter): boolean => {
    const nameOrLabel = (param.name + ' ' + param.label).toLowerCase();
    return (nameOrLabel.includes('anno') || nameOrLabel.includes('year')) && 
           !nameOrLabel.includes('mese') && !nameOrLabel.includes('month');
  };

  const validateField = (param: WidgetParameter, value: any): string => {
    if (param.mandatory) {
      if (param.type === 'BOOLEAN') {
        if (value === undefined || value === null) {
          return `${param.label} è obbligatorio`;
        }
      } else if (param.type === 'STATIC_LIST' || param.type === 'DYNAMIC_LIST') {
        if (!value || (typeof value === 'object' && !value.id)) {
          return `${param.label} è obbligatorio`;
        }
      } else if (param.type === 'DATE') {
        if (!value) {
          return `${param.label} è obbligatorio`;
        }
      } else if (!value || (typeof value === 'string' && !value.trim())) {
        return `${param.label} è obbligatorio`;
      }
    }

    // Additional validations
    if (value && param.validations) {
      if (param.type === 'NUMBER' && param.validations.min !== undefined && value < param.validations.min) {
        return `Il valore deve essere almeno ${param.validations.min}`;
      }
      if (param.type === 'NUMBER' && param.validations.max !== undefined && value > param.validations.max) {
        return `Il valore non può superare ${param.validations.max}`;
      }
    }

    return '';
  };

  const renderField = (param: WidgetParameter) => {
    const error = formErrors[param.name];
    const fieldProps = {
      name: param.name,
      label: param.label,
      required: param.mandatory,
      value: formData[param.name],
      error: error,
      onChange: (e: any) => {
        const value = e.target ? e.target.value : e.value;
        setFormData(prev => ({ ...prev, [param.name]: value }));
        
        // Validate on change
        const validationError = validateField(param, value);
        setFormErrors(prev => ({
          ...prev,
          [param.name]: validationError
        }));
        
        // Auto-apply when in inline mode or when autoApply is enabled
        const shouldAutoApply = displayMode === 'inline' || autoApply;
        if (shouldAutoApply && !validationError) {
          if (param.type === 'STRING' || param.type === 'NUMBER') {
            // Debounce text/number inputs
            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
              onApply({ ...formData, [param.name]: value });
            }, 800);
          } else if (param.type === 'BOOLEAN') {
            // Immediate apply for boolean
            onApply({ ...formData, [param.name]: value });
          }
        }
      }
    };

    switch (param.type) {
      case 'STRING':
        return (
          <div className="widget-filters__field">
            <Input {...fieldProps} invalid={!!error} />
            {error && <div className="widget-filters__field-error">{error}</div>}
          </div>
        );

      case 'NUMBER':
        return (
          <div className="widget-filters__field">
            <NumericTextBox
              {...fieldProps}
              min={param.validations?.min}
              max={param.validations?.max}
            />
            {error && <div className="widget-filters__field-error">{error}</div>}
          </div>
        );

      case 'DATE':
        // Check if this is a year/month parameter
        if (isYearMonthParam(param)) {
          return (
            <div className="widget-filters__field">
              <YearMonthPicker
                value={formData[param.name] ? new Date(formData[param.name]) : new Date()}
                onChange={(e: any) => {
                  const value = e.value;
                  setFormData(prev => ({ ...prev, [param.name]: value }));
                  
                  // Validate on change
                  const validationError = validateField(param, value);
                  setFormErrors(prev => ({
                    ...prev,
                    [param.name]: validationError
                  }));
                  
                  // Auto-apply when enabled
                  if ((displayMode === 'inline' || autoApply) && value) {
                    onApply({ ...formData, [param.name]: value });
                  }
                }}
                disabled={fieldProps.disabled}
                options={{ disabled: [] }}
                label={param.label}
                required={param.mandatory}
              />
              {error && <div className="widget-filters__field-error">{error}</div>}
            </div>
          );
        }
        
        return (
          <div className="widget-filters__field">
            <DatePicker
              {...fieldProps}
              format="dd/MM/yyyy"
              value={formData[param.name] ? new Date(formData[param.name]) : null}
              onChange={(e: any) => {
                const value = e.value;
                setFormData(prev => ({ ...prev, [param.name]: value }));
                
                // Validate on change
                const validationError = validateField(param, value);
                setFormErrors(prev => ({
                  ...prev,
                  [param.name]: validationError
                }));
                
                // Auto-apply when enabled
                if ((displayMode === 'inline' || autoApply) && value && !validationError) {
                  onApply({ ...formData, [param.name]: value });
                }
              }}
            />
            {error && <div className="widget-filters__field-error">{error}</div>}
          </div>
        );

      case 'BOOLEAN':
        return (
          <div className="widget-filters__field widget-filters__field--switch">
            <Switch
              {...fieldProps}
              checked={formData[param.name] || false}
              onLabel={param.label}
              offLabel={param.label}
            />
          </div>
        );

      case 'STATIC_LIST':
        // Handle both string arrays and object arrays
        let staticOptions = [];
        if (Array.isArray(param.values)) {
          // Check if it's an array of strings or objects
          if (param.values.length > 0 && typeof param.values[0] === 'string') {
            // Convert string array to object array
            staticOptions = param.values.map(val => ({ id: val, description: val }));
          } else {
            // Already an object array
            staticOptions = param.values;
          }
        }
        
        // Check if this is a year-only parameter
        if (isYearOnlyParam(param)) {
          return (
            <div className="widget-filters__field">
              <DropDownList
                {...fieldProps}
                data={staticOptions}
                textField="description"
                dataItemKey="id"
                value={staticOptions.find(opt => opt.id === formData[param.name])}
                onChange={(e) => {
                  const value = e.value?.id;
                  setFormData(prev => ({ ...prev, [param.name]: value }));
                  
                  // Validate on change
                  const validationError = validateField(param, value);
                  setFormErrors(prev => ({
                    ...prev,
                    [param.name]: validationError
                  }));
                  
                  // Auto-apply when enabled
                  if ((displayMode === 'inline' || autoApply) && value) {
                    onApply({ ...formData, [param.name]: value });
                  }
                }}
                className="k-widget k-dropdown k-rounded-md"
              />
              {error && <div className="widget-filters__field-error">{error}</div>}
            </div>
          );
        }
        
        return (
          <div className="widget-filters__field">
            <DropDownList
              {...fieldProps}
              data={staticOptions}
              textField="description"
              dataItemKey="id"
              value={staticOptions.find(opt => opt.id === formData[param.name])}
              onChange={(e) => {
                const value = e.value?.id;
                setFormData(prev => ({ ...prev, [param.name]: value }));
                
                // Validate on change
                const validationError = validateField(param, value);
                setFormErrors(prev => ({
                  ...prev,
                  [param.name]: validationError
                }));
                
                // Auto-apply when enabled
                if ((displayMode === 'inline' || autoApply) && value !== undefined) {
                  onApply({ ...formData, [param.name]: value });
                }
              }}
              className="k-rounded-md"
            />
            {error && <div className="widget-filters__field-error">{error}</div>}
          </div>
        );

      case 'DYNAMIC_LIST':
        // Parse JSON values for dynamic list
        let dynamicOptions = [];
        try {
          if (typeof param.values === 'string') {
            dynamicOptions = JSON.parse(param.values);
          } else if (Array.isArray(param.values)) {
            dynamicOptions = param.values;
          }
        } catch (e) {
          console.error('Error parsing DYNAMIC_LIST values:', e);
          dynamicOptions = [];
        }
        
        return (
          <div className="widget-filters__field">
            <DropDownList
              {...fieldProps}
              data={dynamicOptions}
              textField="description"
              dataItemKey="id"
              value={dynamicOptions.find(opt => opt.id === formData[param.name])}
              onChange={(e) => {
                const value = e.value?.id;
                setFormData(prev => ({ ...prev, [param.name]: value }));
                
                // Validate on change
                const validationError = validateField(param, value);
                setFormErrors(prev => ({
                  ...prev,
                  [param.name]: validationError
                }));
                
                // Auto-apply when enabled
                if ((displayMode === 'inline' || autoApply) && value !== undefined) {
                  onApply({ ...formData, [param.name]: value });
                }
              }}
              filterable={true}
              onFilterChange={(e) => {
                // For now, using client-side filtering
                // In future, this could trigger server-side search
              }}
              className="k-rounded-md"
            />
            {error && <div className="widget-filters__field-error">{error}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 400; // Estimated height
      const dropdownWidth = 350; // Estimated width
      
      // Calcola la posizione considerando lo scroll
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.right - dropdownWidth + window.scrollX;
      
      // Check if dropdown would go below viewport
      if (rect.bottom + dropdownHeight > window.innerHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 8;
      }
      
      // Check if dropdown would go outside left edge
      if (left < window.scrollX) {
        left = rect.left + window.scrollX;
      }
      
      // Check if dropdown would go outside right edge
      if (left + dropdownWidth > window.innerWidth + window.scrollX) {
        left = window.innerWidth + window.scrollX - dropdownWidth - 16;
      }
      
      setDropdownPosition({ top, left });
    }
  };
  
  const handleToggle = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    widget.parameters?.forEach(param => {
      const error = validateField(param, formData[param.name]);
      if (error) {
        errors[param.name] = error;
      }
    });
    
    setFormErrors(errors);
    
    // Only submit if no errors
    if (Object.keys(errors).length === 0) {
      onApply(formData);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    const defaults: Record<string, any> = {};
    widget.parameters?.forEach(param => {
      if (param.default_value) {
        defaults[param.name] = param.default_value;
      }
    });
    setFormData(defaults);
    setFormErrors({});
    onReset();
    setIsOpen(false);
  };

  if (!widget.parameters || widget.parameters.length === 0) {
    return null;
  }

  // Inline mode rendering
  if (displayMode === 'inline') {
    // Check if we have separate year and month parameters
    const yearParam = widget.parameters.find(p => 
      (p.name.toLowerCase().includes('anno') || p.name.toLowerCase().includes('year')) &&
      !(p.name.toLowerCase().includes('mese') || p.name.toLowerCase().includes('month'))
    );
    const monthParam = widget.parameters.find(p => 
      p.name.toLowerCase().includes('mese') || p.name.toLowerCase().includes('month')
    );
    
    // If we have both year and month as separate parameters, combine them
    if (yearParam && monthParam) {
      // Create a combined date from year and month values
      const year = formData[yearParam.name] || new Date().getFullYear();
      const month = formData[monthParam.name] || new Date().getMonth() + 1;
      const combinedDate = new Date(year, month - 1, 1);
      
      return (
        <div className="widget-filters widget-filters--inline">
          <div className="widget-filters__inline-container">
            <div className="widget-filters__inline-field">
              <YearMonthPicker
                value={combinedDate}
                onChange={(e: any) => {
                  const date = e.value;
                  if (date) {
                    const newYear = date.getFullYear();
                    const newMonth = date.getMonth() + 1;
                    
                    setFormData(prev => ({ 
                      ...prev, 
                      [yearParam.name]: newYear,
                      [monthParam.name]: newMonth
                    }));
                    
                    // Auto-apply
                    onApply({ 
                      ...formData, 
                      [yearParam.name]: newYear,
                      [monthParam.name]: newMonth
                    });
                  }
                }}
                disabled={isLoading}
                options={{ disabled: [] }}
                label="Anno/Mese"
                required={yearParam.mandatory || monthParam.mandatory}
              />
            </div>
            {/* Render other parameters that are not year or month */}
            {widget.parameters
              .filter(p => p.id !== yearParam.id && p.id !== monthParam.id)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(param => (
                <div key={param.id} className="widget-filters__inline-field">
                  {renderField(param)}
                </div>
              ))}
          </div>
        </div>
      );
    }
    
    // Default inline rendering if no year/month combination
    return (
      <div className="widget-filters widget-filters--inline">
        <div className="widget-filters__inline-container">
          {widget.parameters
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(param => (
              <div key={param.id} className="widget-filters__inline-field">
                {renderField(param)}
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Popup mode rendering (existing code)
  return (
    <div className="widget-filters">
      <div ref={buttonRef} style={{ display: 'inline-block' }}>
        <Button
          icon="filter"
          svgIcon={filterIcon}
          onClick={handleToggle}
          disabled={isLoading}
          themeColor="base"
          fillMode="flat"
          size="small"
        >
          Filtri
        </Button>
      </div>

      {isOpen && ReactDOM.createPortal(
        <>
          <div
            className="widget-filters__backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999
            }}
          />
          <div 
            className="widget-filters__dropdown"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
          >
            <form onSubmit={handleSubmit}>
            <div className="widget-filters__fields">
              {widget.parameters
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(param => (
                  <div key={param.id} className="widget-filters__field">
                    {renderField(param)}
                  </div>
                ))}
            </div>

            <div className="widget-filters__actions">
              <Button
                type="submit"
                themeColor="primary"
                disabled={isLoading}
                size="small"
              >
                Applica
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                size="small"
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                fillMode="flat"
                size="small"
              >
                Annulla
              </Button>
            </div>
            </form>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};