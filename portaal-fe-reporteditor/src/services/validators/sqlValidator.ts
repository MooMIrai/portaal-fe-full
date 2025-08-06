export class SqlValidator {
  private static readonly FORBIDDEN_KEYWORDS = [
    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 
    'TRUNCATE', 'EXEC', 'EXECUTE', 'GRANT', 'REVOKE'
  ];

  private static readonly ALLOWED_FUNCTIONS = [
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'CAST',
    'CONVERT', 'DATE_FORMAT', 'NOW', 'CURDATE', 'YEAR', 'MONTH',
    'DAY', 'CONCAT', 'SUBSTRING', 'LENGTH', 'TRIM', 'UPPER', 'LOWER'
  ];

  private static readonly MAX_QUERY_LENGTH = 10000;
  private static readonly MAX_SUBQUERIES = 5;

  static validate(sql: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check query length
    if (sql.length > this.MAX_QUERY_LENGTH) {
      errors.push(`La query supera la lunghezza massima di ${this.MAX_QUERY_LENGTH} caratteri`);
    }

    // Check for forbidden keywords
    const upperSql = sql.toUpperCase();
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (upperSql.includes(keyword)) {
        errors.push(`Keyword non consentita: ${keyword}`);
      }
    }

    // Check for SQL injection patterns
    if (this.hasSqlInjectionPatterns(sql)) {
      errors.push('Rilevato possibile tentativo di SQL injection');
    }

    // Count subqueries
    const subqueryCount = (sql.match(/\bSELECT\b/gi) || []).length - 1;
    if (subqueryCount > this.MAX_SUBQUERIES) {
      errors.push(`Numero massimo di subquery superato (max: ${this.MAX_SUBQUERIES})`);
    }

    // Validate parameters
    const paramErrors = this.validateParameters(sql);
    errors.push(...paramErrors);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private static hasSqlInjectionPatterns(sql: string): boolean {
    const patterns = [
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,  // OR 1=1
      /(\b(OR|AND)\s+'[^']*'\s*=\s*'[^']*')/i,  // OR 'a'='a'
      /(--\s*$)/m,  // SQL comments at end of line
      /(\/\*[\s\S]*?\*\/)/,  // Block comments
      /(\bUNION\s+SELECT\b)/i,  // UNION attacks
      /(;\s*DROP\s+)/i,  // Multiple statements
    ];

    return patterns.some(pattern => pattern.test(sql));
  }

  private static validateParameters(sql: string): string[] {
    const errors: string[] = [];
    const paramRegex = /:(\w+)/g;
    const params = new Set<string>();
    
    let match;
    while ((match = paramRegex.exec(sql)) !== null) {
      const paramName = match[1];
      if (params.has(paramName)) {
        errors.push(`Parametro duplicato: :${paramName}`);
      }
      params.add(paramName);
    }

    return errors;
  }
}