import { Widget, WidgetParameter } from '../types/widget.types';

/**
 * Format widget parameters for display
 * @param currentFilters Current filter values
 * @param parameters Widget parameter definitions
 * @returns Formatted string of parameters or null if no parameters
 */
export const formatParametersDisplay = (
  currentFilters: Record<string, any> | undefined,
  parameters: WidgetParameter[] | undefined
): string | null => {
  if (!currentFilters || !parameters || Object.keys(currentFilters).length === 0) {
    return null;
  }

  // Check if we have both ANNO and MESE parameters
  const hasAnno = currentFilters['ANNO'] !== undefined && currentFilters['ANNO'] !== null;
  const hasMese = currentFilters['MESE'] !== undefined && currentFilters['MESE'] !== null;
  
  if (hasAnno && hasMese) {
    // Special formatting for month and year together
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    const monthIndex = parseInt(currentFilters['MESE']) - 1;
    const monthName = months[monthIndex] || currentFilters['MESE'];
    return `${monthName} ${currentFilters['ANNO']}`;
  }

  // Default formatting for other parameters
  const formattedParams = parameters
    .filter(param => currentFilters[param.name] !== undefined && currentFilters[param.name] !== null)
    .map(param => {
      const value = currentFilters[param.name];
      const formattedValue = formatParameterValue(param, value);
      return `${param.label}: ${formattedValue}`;
    })
    .filter(Boolean);

  return formattedParams.length > 0 ? formattedParams.join(', ') : null;
};

/**
 * Format a single parameter value based on its type
 */
const formatParameterValue = (param: WidgetParameter, value: any): string => {
  switch (param.type) {
    case 'DATE':
      // Handle date formatting
      if (value instanceof Date) {
        return value.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
      }
      return value.toString();
    
    case 'NUMBER':
      // Special handling for month numbers
      if (param.name.toLowerCase().includes('mese') || param.name.toLowerCase().includes('month')) {
        const months = [
          'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
          'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        const monthIndex = parseInt(value) - 1;
        return months[monthIndex] || value.toString();
      }
      return value.toString();
    
    case 'STATIC_LIST':
    case 'DYNAMIC_LIST':
      // For lists, try to find the description from the parameter values
      if (param.values && Array.isArray(param.values)) {
        const item = param.values.find(v => v.id === value);
        return item?.description || value.toString();
      }
      return value.toString();
    
    case 'BOOLEAN':
      return value ? 'Sì' : 'No';
    
    default:
      return value.toString();
  }
};