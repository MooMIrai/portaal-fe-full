import { WidgetType, WidgetConfig } from './widget.types';

// Configurazione form per widget
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'color' | 'date' | 'code';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  dependsOn?: {
    field: string;
    value: any;
  };
  group?: string;
}

// Gruppi di configurazione
export interface ConfigGroup {
  name: string;
  label: string;
  description?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  fields: FormFieldConfig[];
}

// Configurazione completa per tipo di widget
export interface WidgetTypeConfig {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  category: string;
  configGroups: ConfigGroup[];
  defaultConfig: Partial<WidgetConfig>;
  previewData?: any[];
  documentation?: string;
}

// Mapping dati
export interface DataMapping {
  sourceField: string;
  targetField: string;
  transform?: 'none' | 'date' | 'number' | 'string' | 'boolean' | 'custom';
  transformFunction?: string;
  defaultValue?: any;
}

// Data source configuration
export interface DataSourceConfig {
  type: 'api' | 'static' | 'query';
  endpoint?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  queryId?: string;
  staticData?: any[];
  parameters?: Array<{
    name: string;
    type: string;
    value: any;
  }>;
  refreshInterval?: number;
  cache?: boolean;
  cacheTimeout?: number;
}

// Layout configuration
export interface LayoutConfig {
  type: 'grid' | 'flex' | 'absolute';
  columns?: number;
  rows?: number;
  gap?: number;
  padding?: number;
  responsive?: {
    breakpoint: number;
    columns: number;
  }[];
}

// Dashboard configuration
export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  layout: LayoutConfig;
  widgets: Array<{
    widgetId: string;
    position: {
      x?: number;
      y?: number;
      width: number;
      height: number;
    };
  }>;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
  permissions?: string[];
}

// Editor state
export interface EditorState {
  selectedWidgetType?: WidgetType;
  currentConfig: Partial<WidgetConfig>;
  dataSource?: DataSourceConfig;
  dataMapping?: DataMapping[];
  previewData?: any[];
  validationErrors?: Record<string, string>;
  isDirty: boolean;
}