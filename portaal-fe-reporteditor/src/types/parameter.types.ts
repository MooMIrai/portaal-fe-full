export interface ParameterFormData {
  name: string;
  label: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ParameterDependency {
  sourceParameter: string;
  targetParameter: string;
  condition: DependencyCondition;
  action: DependencyAction;
}

export enum DependencyCondition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_EMPTY = 'NOT_EMPTY',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN'
}

export enum DependencyAction {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
  SET_VALUE = 'SET_VALUE',
  CLEAR_VALUE = 'CLEAR_VALUE'
}

export interface DynamicListConfig {
  endpoint: string;
  valueField: string;
  labelField: string;
  dependsOn?: string[];
  cache?: boolean;
  cacheTime?: number;
}