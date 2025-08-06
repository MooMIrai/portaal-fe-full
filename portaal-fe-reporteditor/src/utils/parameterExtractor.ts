export function extractParametersFromSQL(sql: string): string[] {
  const paramRegex = /:(\w+)/g;
  const params = new Set<string>();
  
  let match;
  while ((match = paramRegex.exec(sql)) !== null) {
    params.add(match[1]);
  }
  
  return Array.from(params);
}

export function replaceParametersInSQL(sql: string, parameters: Record<string, any>): string {
  let processedSQL = sql;
  
  Object.entries(parameters).forEach(([name, value]) => {
    const paramRegex = new RegExp(`:${name}\\b`, 'g');
    
    // Handle different value types
    let replacementValue: string;
    if (value === null || value === undefined) {
      replacementValue = 'NULL';
    } else if (typeof value === 'string') {
      // Escape single quotes in strings
      replacementValue = `'${value.replace(/'/g, "''")}'`;
    } else if (typeof value === 'boolean') {
      replacementValue = value ? '1' : '0';
    } else if (value instanceof Date) {
      replacementValue = `'${value.toISOString()}'`;
    } else {
      replacementValue = String(value);
    }
    
    processedSQL = processedSQL.replace(paramRegex, replacementValue);
  });
  
  return processedSQL;
}

export function validateParameterUsage(sql: string, definedParameters: string[]): string[] {
  const usedParams = extractParametersFromSQL(sql);
  const errors: string[] = [];
  
  // Check for undefined parameters
  usedParams.forEach(param => {
    if (!definedParameters.includes(param)) {
      errors.push(`Parametro :${param} utilizzato nella query ma non definito`);
    }
  });
  
  // Check for unused parameters
  definedParameters.forEach(param => {
    if (!usedParams.includes(param)) {
      errors.push(`Parametro :${param} definito ma non utilizzato nella query`);
    }
  });
  
  return errors;
}