/**
 * Widget Configuration Types for Option 3 Implementation
 * Structured JSON configuration for dashboard widgets
 */

// Base configuration for all widgets
export interface BaseWidgetConfig {
  title?: string;
  description?: string;
  showTooltip?: boolean;
  tooltipFormat?: string;
  height?: number | string;
  refreshInterval?: number;
}

// Gantt/RangeBar specific configuration
export interface GanttConfig extends BaseWidgetConfig {
  categoryField: string;
  fromField: string;
  toField: string;
  dateFormat: string;
  color?: string | string[];
  reverseCategories?: boolean;
  baseUnit?: 'days' | 'weeks' | 'months' | 'years';
  showGridLines?: boolean;
  stackedCategories?: boolean;
}

// Pie Chart configuration
export interface PieChartConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string;
  showLabels?: boolean;
  labelPosition?: 'center' | 'outside' | 'inside';
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  startAngle?: number;
  holeSize?: number; // For donut charts
}

// Bar/Column Chart configuration
export interface BarChartConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string | string[];
  orientation?: 'horizontal' | 'vertical';
  stacked?: boolean;
  showValueLabels?: boolean;
  gap?: number;
  spacing?: number;
  color?: string | string[];
}

// Line/Area Chart configuration
export interface LineChartConfig extends BaseWidgetConfig {
  categoryField: string;
  valueField: string | string[];
  smooth?: boolean;
  markers?: boolean;
  markerSize?: number;
  area?: boolean;
  stack?: boolean;
  missingValues?: 'gap' | 'zero' | 'interpolate';
}

// Table configuration
export interface TableConfig extends BaseWidgetConfig {
  columns: TableColumn[];
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  groupable?: boolean;
}

export interface TableColumn {
  field: string;
  title: string;
  width?: number;
  format?: string;
  template?: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

// KPI Card configuration
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
  };
}

// Gauge configuration
export interface GaugeConfig extends BaseWidgetConfig {
  valueField: string;
  min?: number;
  max?: number;
  colors?: Array<{
    from: number;
    to: number;
    color: string;
  }>;
  pointer?: {
    value: number;
    color?: string;
  };
}

// Scatter plot configuration
export interface ScatterConfig extends BaseWidgetConfig {
  xField: string;
  yField: string;
  sizeField?: string;
  colorField?: string;
  xAxis?: {
    title?: string;
    min?: number;
    max?: number;
    format?: string;
  };
  yAxis?: {
    title?: string;
    min?: number;
    max?: number;
    format?: string;
  };
  trendline?: {
    type: 'linear' | 'exponential' | 'logarithmic' | 'polynomial';
    color?: string;
    width?: number;
  };
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

// Heatmap configuration
export interface HeatmapConfig extends BaseWidgetConfig {
  xField: string;
  yField: string;
  valueField: string;
  colorScheme?: 'heat' | 'cool' | 'rainbow' | 'custom';
  colors?: string[];
  showValues?: boolean;
  valueFormat?: string;
  xAxis?: {
    title?: string;
    rotation?: number;
  };
  yAxis?: {
    title?: string;
    rotation?: number;
  };
}

// Timeline configuration
export interface TimelineConfig extends BaseWidgetConfig {
  categoryField: string;
  startField: string;
  endField: string;
  labelField?: string;
  descriptionField?: string;
  typeField?: string;
  iconField?: string;
  orientation?: 'horizontal' | 'vertical';
  dateFormat?: string;
  groupBy?: string;
  showConnectors?: boolean;
  alternating?: boolean;
  colors?: Record<string, string>;
}

// Union type for all widget configurations
export type WidgetConfig = 
  | GanttConfig 
  | PieChartConfig 
  | BarChartConfig 
  | LineChartConfig 
  | TableConfig 
  | KPIConfig 
  | GaugeConfig
  | ScatterConfig
  | HeatmapConfig
  | TimelineConfig;

// Computed data provided by backend
export interface ComputedData {
  categories?: string[];
  dateRange?: {
    min: string;
    max: string;
  };
  summary?: {
    totalItems?: number;
    totalValue?: number;
    average?: number;
    min?: number;
    max?: number;
    [key: string]: any;
  };
  aggregations?: Record<string, any>;
}

// Widget props for components
export interface WidgetProps<T extends BaseWidgetConfig = BaseWidgetConfig> {
  data: any[];
  config: T;
  computed?: ComputedData;
}

// Widget data structure from API
export interface WidgetData<T = any> {
  widgetType: WidgetType;
  data: T[];
  config: WidgetConfig;
  computed?: ComputedData;
  metadata?: {
    lastUpdated: string;
    dataSource?: string;
    filters?: Record<string, any>;
    parameters?: Record<string, any>;
  };
}

// Widget types enum
export enum WidgetType {
  GANTT = 'gantt',
  PIE = 'pie',
  BAR = 'bar',
  LINE = 'line',
  AREA = 'area',
  TABLE = 'table',
  KPI = 'kpi',
  GAUGE = 'gauge',
  DONUT = 'donut',
  SCATTER = 'scatter',
  HEATMAP = 'heatmap',
  TIMELINE = 'timeline'
}

// Type guards
export const isGanttConfig = (config: WidgetConfig): config is GanttConfig => {
  return 'fromField' in config && 'toField' in config;
};

export const isPieChartConfig = (config: WidgetConfig): config is PieChartConfig => {
  return 'valueField' in config && !('fromField' in config);
};

export const isBarChartConfig = (config: WidgetConfig): config is BarChartConfig => {
  return 'orientation' in config || 'stacked' in config;
};

export const isLineChartConfig = (config: WidgetConfig): config is LineChartConfig => {
  return 'smooth' in config || 'markers' in config;
};

export const isTableConfig = (config: WidgetConfig): config is TableConfig => {
  return 'columns' in config;
};

export const isKPIConfig = (config: WidgetConfig): config is KPIConfig => {
  return 'trend' in config || 'comparison' in config;
};

export const isGaugeConfig = (config: WidgetConfig): config is GaugeConfig => {
  return 'min' in config && 'max' in config && !('fromField' in config);
};

export const isScatterConfig = (config: WidgetConfig): config is ScatterConfig => {
  return 'xField' in config && 'yField' in config;
};

export const isHeatmapConfig = (config: WidgetConfig): config is HeatmapConfig => {
  return 'xField' in config && 'yField' in config && 'valueField' in config;
};

export const isTimelineConfig = (config: WidgetConfig): config is TimelineConfig => {
  return 'startField' in config && 'endField' in config;
};