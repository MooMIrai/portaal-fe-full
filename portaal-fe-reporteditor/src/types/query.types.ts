export interface Query {
  id: number;
  name: string;
  description?: string;
  sql: string;
  parameters: QueryParameter[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  category?: string;
  tags?: string[];
  isTemplate?: boolean;
  isPublic?: boolean;
  permissions?: string[];
}

export interface QueryParameter {
  id: string;
  name: string;
  label: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: any;
  validation?: ParameterValidation;
  dependsOn?: string;
  options?: ParameterOption[];
}

export enum ParameterType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  BOOLEAN = 'BOOLEAN',
  STATIC_LIST = 'STATIC_LIST',
  DYNAMIC_LIST = 'DYNAMIC_LIST'
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface ParameterOption {
  value: string | number;
  label: string;
}

export interface QueryExecutionRequest {
  queryId: number;
  parameters: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface QueryExecutionResult {
  data: any[];
  columns: ColumnDefinition[];
  rowCount: number;
  executionTime: number;
  error?: string;
}

export interface ColumnDefinition {
  field: string;
  title: string;
  type: string;
  width?: number;
}