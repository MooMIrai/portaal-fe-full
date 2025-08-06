/**
 * Placeholder processor for dynamic Chart.js configurations
 * Supports various placeholder syntaxes to reference data dynamically
 */

export interface PlaceholderContext {
  Query?: any[];
  data?: any;
  [key: string]: any;
}

/**
 * Process a string containing placeholders and replace them with actual values
 * @param template The template string containing placeholders
 * @param context The data context to resolve placeholders from
 * @returns The processed string with placeholders replaced
 */
export function processPlaceholders(template: string, context: PlaceholderContext): string {
  // Regular expression to match {{...}} placeholders
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  
  return template.replace(placeholderRegex, (match, placeholder) => {
    try {
      const value = resolvePlaceholder(placeholder.trim(), context);
      return JSON.stringify(value);
    } catch (error) {
      console.error(`Error processing placeholder "${placeholder}":`, error);
      return match; // Return original if processing fails
    }
  });
}

/**
 * Resolve a single placeholder expression
 */
function resolvePlaceholder(expression: string, context: PlaceholderContext): any {
  // Handle array mapping: Query.*.field
  if (expression.includes('.*.')) {
    return handleArrayMapping(expression, context);
  }
  
  // Handle aggregations: Query.sum(field), Query.avg(field), etc.
  if (expression.match(/\.(sum|avg|min|max|count)\(/)) {
    return handleAggregation(expression, context);
  }
  
  // Handle filtering: Query[field=value].*.field
  if (expression.includes('[') && expression.includes(']')) {
    return handleFiltering(expression, context);
  }
  
  // Handle transformations: Query.*.field|format:pattern
  if (expression.includes('|')) {
    return handleTransformation(expression, context);
  }
  
  // Handle simple property access: Query.0.field or data.field
  return handlePropertyAccess(expression, context);
}

/**
 * Handle array mapping expressions like Query.*.field
 */
function handleArrayMapping(expression: string, context: PlaceholderContext): any[] {
  const parts = expression.split('.*.');
  if (parts.length !== 2) {
    console.warn(`Invalid array mapping expression: ${expression}, returning empty array`);
    return [];
  }
  
  const [arrayPath, fieldPath] = parts;
  const array = getValueByPath(context, arrayPath);
  
  if (!array) {
    console.warn(`No data at path "${arrayPath}", returning empty array`);
    return [];
  }
  
  if (!Array.isArray(array)) {
    console.warn(`Expected array at path "${arrayPath}", got ${typeof array}, returning empty array`);
    return [];
  }
  
  return array.map(item => item ? getValueByPath(item, fieldPath) : undefined).filter(v => v !== undefined);
}

/**
 * Handle aggregation expressions like Query.sum(amount)
 */
function handleAggregation(expression: string, context: PlaceholderContext): number {
  const match = expression.match(/^(.+?)\.(sum|avg|min|max|count)\(([^)]+)\)$/);
  if (!match) {
    console.warn(`Invalid aggregation expression: ${expression}, returning 0`);
    return 0;
  }
  
  const [, arrayPath, operation, fieldPath] = match;
  const array = getValueByPath(context, arrayPath);
  
  if (!array || !Array.isArray(array)) {
    console.warn(`Expected array at path "${arrayPath}", got ${typeof array}, returning 0`);
    return 0;
  }
  
  switch (operation) {
    case 'sum':
      return array.reduce((sum, item) => sum + Number(getValueByPath(item, fieldPath) || 0), 0);
    
    case 'avg':
      if (array.length === 0) return 0;
      const sum = array.reduce((sum, item) => sum + Number(getValueByPath(item, fieldPath) || 0), 0);
      return sum / array.length;
    
    case 'min':
      return Math.min(...array.map(item => Number(getValueByPath(item, fieldPath) || 0)));
    
    case 'max':
      return Math.max(...array.map(item => Number(getValueByPath(item, fieldPath) || 0)));
    
    case 'count':
      return array.length;
    
    default:
      throw new Error(`Unknown aggregation operation: ${operation}`);
  }
}

/**
 * Handle filtering expressions like Query[status=active].*.name
 */
function handleFiltering(expression: string, context: PlaceholderContext): any {
  const match = expression.match(/^(.+?)\[([^=]+)=([^\]]+)\](.*)$/);
  if (!match) {
    console.warn(`Invalid filter expression: ${expression}, returning empty array`);
    return [];
  }
  
  const [, arrayPath, filterField, filterValue, remainder] = match;
  const array = getValueByPath(context, arrayPath);
  
  if (!array || !Array.isArray(array)) {
    console.warn(`Expected array at path "${arrayPath}", got ${typeof array}, returning empty array`);
    return [];
  }
  
  // Filter the array
  const filtered = array.filter(item => {
    const value = getValueByPath(item, filterField);
    return String(value) === filterValue;
  });
  
  // If there's a remainder, process it with the filtered array
  if (remainder) {
    if (remainder.startsWith('.*.')) {
      const fieldPath = remainder.substring(3);
      return filtered.map(item => getValueByPath(item, fieldPath));
    } else {
      return getValueByPath({ filtered }, 'filtered' + remainder);
    }
  }
  
  return filtered;
}

/**
 * Handle transformation expressions like Query.*.date|format:MMM
 */
function handleTransformation(expression: string, context: PlaceholderContext): any {
  const [basePath, ...transformParts] = expression.split('|');
  const transformExpression = transformParts.join('|'); // In case there are multiple |
  
  // First resolve the base value
  let value = resolvePlaceholder(basePath.trim(), context);
  
  // Apply transformations
  const transforms = transformExpression.split('|').map(t => t.trim());
  
  for (const transform of transforms) {
    const [transformName, ...params] = transform.split(':');
    value = applyTransformation(value, transformName, params.join(':'));
  }
  
  return value;
}

/**
 * Apply a transformation to a value
 */
function applyTransformation(value: any, transformName: string, params: string): any {
  switch (transformName) {
    case 'format':
      if (Array.isArray(value)) {
        return value.map(v => formatValue(v, params));
      }
      return formatValue(value, params);
    
    case 'currency':
      if (Array.isArray(value)) {
        return value.map(v => formatCurrency(v, params));
      }
      return formatCurrency(value, params);
    
    case 'uppercase':
      if (Array.isArray(value)) {
        return value.map(v => String(v).toUpperCase());
      }
      return String(value).toUpperCase();
    
    case 'lowercase':
      if (Array.isArray(value)) {
        return value.map(v => String(v).toLowerCase());
      }
      return String(value).toLowerCase();
    
    default:
      console.warn(`Unknown transformation: ${transformName}`);
      return value;
  }
}

/**
 * Format a value based on a format pattern
 */
function formatValue(value: any, format: string): string {
  // Simple date formatting for month names
  if (format === 'MMM' && value) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  }
  
  // Add more format patterns as needed
  return String(value);
}

/**
 * Format a value as currency
 */
function formatCurrency(value: any, currency: string = 'EUR'): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency
  }).format(num);
}

/**
 * Handle simple property access like Query.0.field or data.field
 */
function handlePropertyAccess(expression: string, context: PlaceholderContext): any {
  return getValueByPath(context, expression);
}

/**
 * Get a value from an object by dot-separated path
 */
function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // Handle array indices
    if (/^\d+$/.test(part)) {
      current = current[parseInt(part, 10)];
    } else {
      current = current[part];
    }
  }
  
  return current;
}

/**
 * Detect placeholders in a string
 */
export function containsPlaceholders(template: string): boolean {
  return /\{\{[^}]+\}\}/.test(template);
}

/**
 * Extract all placeholder expressions from a template
 */
export function extractPlaceholders(template: string): string[] {
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const placeholders: string[] = [];
  let match;
  
  while ((match = placeholderRegex.exec(template)) !== null) {
    placeholders.push(match[1].trim());
  }
  
  return placeholders;
}