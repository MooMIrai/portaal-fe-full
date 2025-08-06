import { WIDGET_TYPES, WIDGET_CATEGORIES } from '../constants';

export type WidgetType = typeof WIDGET_TYPES[keyof typeof WIDGET_TYPES];
export type WidgetCategory = typeof WIDGET_CATEGORIES[keyof typeof WIDGET_CATEGORIES];

// Base configuration comune a tutti i widget
export interface BaseWidgetConfig {
  title?: string;
  description?: string;
  refreshInterval?: number;
  height?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

// Configurazioni specifiche per tipo di widget
export interface GanttConfig extends BaseWidgetConfig {
  categoryField: string;
  fromField: string;
  toField: string;
  dateFormat?: string;
  baseUnit?: 'days' | 'weeks' | 'months' | 'years';
  color?: string | string[];
  showTooltip?: boolean;
  tooltipFormat?: string;
  reverseCategories?: boolean;
}

export interface PieConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string;
  showLabels?: boolean;
  labelPosition?: 'inside' | 'outside';
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipFormat?: string;
  colors?: string[];
}

export interface BarConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string | string[];
  orientation?: 'vertical' | 'horizontal';
  stacked?: boolean;
  showValueLabels?: boolean;
  gap?: number;
  spacing?: number;
  color?: string | string[];
  legend?: {
    visible: boolean;
    labels?: string[];
  };
}

export interface LineConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string | string[];
  smooth?: boolean;
  markers?: boolean;
  markerSize?: number;
  missingValues?: 'gap' | 'interpolate' | 'zero';
  color?: string | string[];
  yAxis?: Array<{
    field: string;
    title: string;
    position: 'left' | 'right';
  }>;
}

export interface AreaConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string | string[];
  stack?: boolean;
  smooth?: boolean;
  opacity?: number;
  color?: string | string[];
}

export interface TableConfig extends BaseWidgetConfig {
  columns: Array<{
    field: string;
    title: string;
    width?: number;
    format?: string;
    type?: 'string' | 'number' | 'date' | 'boolean';
    sortable?: boolean;
    filterable?: boolean;
    template?: string;
  }>;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  groupable?: boolean;
  exportable?: string[];
}

export interface KPIConfig extends BaseWidgetConfig {
  valueField: string;
  format?: string;
  icon?: string;
  trend?: {
    field: string;
    format?: string;
    positiveColor?: string;
    negativeColor?: string;
  };
  comparison?: {
    field: string;
    type: 'percentage' | 'absolute';
    format?: string;
    label?: string;
  };
  sparkline?: {
    data: string;
    type: 'line' | 'area' | 'column';
    color?: string;
  };
}

export interface GaugeConfig extends BaseWidgetConfig {
  valueField: string;
  min: number;
  max: number;
  format?: string;
  colors?: Array<{
    from: number;
    to: number;
    color: string;
  }>;
  pointer?: {
    value?: number;
    color?: string;
  };
  labels?: {
    visible?: boolean;
    position?: 'inside' | 'outside';
  };
  majorTicks?: {
    visible?: boolean;
    size?: number;
    interval?: number;
  };
}

export interface DonutConfig extends PieConfig {
  holeSize?: number;
  centerTemplate?: string;
}

export interface ScatterConfig extends BaseWidgetConfig {
  xField: string;
  yField: string;
  sizeField?: string;
  colorField?: string;
  xAxis?: {
    title?: string;
    min?: number;
    max?: number;
  };
  yAxis?: {
    title?: string;
    format?: string;
    min?: number;
    max?: number;
  };
  trendline?: {
    type: 'linear' | 'exponential' | 'logarithmic' | 'power' | 'polynomial';
    color?: string;
    width?: number;
  };
}

export interface HeatmapConfig extends BaseWidgetConfig {
  xField: string;
  yField: string;
  valueField: string;
  colorScheme?: 'heat' | 'cool' | 'rainbow' | 'custom';
  showValues?: boolean;
  tooltipFormat?: string;
  colors?: string[];
}

export interface TimelineConfig extends BaseWidgetConfig {
  dateField: string;
  titleField: string;
  descriptionField?: string;
  typeField?: string;
  iconField?: string;
  orientation?: 'vertical' | 'horizontal';
  dateFormat?: string;
  groupBy?: string;
  showConnectors?: boolean;
  alternating?: boolean;
}

// Union type per tutte le configurazioni
export type WidgetConfig = 
  | GanttConfig
  | PieConfig
  | BarConfig
  | LineConfig
  | AreaConfig
  | TableConfig
  | KPIConfig
  | GaugeConfig
  | DonutConfig
  | ScatterConfig
  | HeatmapConfig
  | TimelineConfig;

// Computed data per widget
export interface ComputedData {
  categories?: string[];
  dateRange?: {
    min: string;
    max: string;
  };
  summary?: Record<string, any>;
  totals?: Record<string, number>;
  growth?: string;
  trend?: any;
  largest?: {
    category: string;
    value: number;
  };
}

// Struttura dati widget completa
export interface WidgetData {
  widgetType: WidgetType;
  data: any[];
  config: WidgetConfig;
  computed?: ComputedData;
  metadata?: {
    lastUpdated: string;
    dataSource: string;
    filters?: Record<string, any>;
  };
}

// Widget nel database
export interface Widget {
  id: number;
  name: string;
  widgetType: string;
  widgetId?: number;
  reportId?: number;
  config: {
    useStructuredFormat?: boolean;
    structuredEndpoint?: string;
    refreshInterval?: number;
    [key: string]: any;
  };
  parameters?: WidgetParameter[];
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Parametri widget
export interface WidgetParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'multiselect';
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
}

// Template widget
export interface WidgetTemplate {
  id: string;
  name: string;
  description?: string;
  widgetType: WidgetType;
  config: WidgetConfig;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  createdBy?: string;
  createdAt?: string;
}