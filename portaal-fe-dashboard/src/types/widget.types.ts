// Widget type definitions based on the documentation

export enum DashboardWidgetType {
  CHART_LINE = 'CHART_LINE',
  CHART_BAR = 'CHART_BAR',
  CHART_PIE = 'CHART_PIE',
  CHART_DONUT = 'CHART_DONUT',
  CHART_AREA = 'CHART_AREA',
  KPI_CARD = 'KPI_CARD',
  TABLE = 'TABLE',
  GAUGE = 'GAUGE'
}

export interface WidgetParameter {
  id: number;
  name: string;
  label: string;
  type: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'LIST' | 'DYNAMIC_LIST' | 'STATIC_LIST';
  mandatory: boolean;
  default_value?: string | null;
  values?: Array<{ id: string; description: string }> | { query: string } | null;
  validations?: {
    min?: number;
    max?: number;
    pattern?: string;
  } | null;
  order?: number;
}

export interface Widget {
  id: number;
  name: string;
  description?: string;
  category?: string;
  widgetType: DashboardWidgetType;
  config: WidgetConfig;
  order: number;
  parameters: WidgetParameter[];
  isHidden?: boolean;
}

export interface WidgetConfig {
  // Common config
  title?: string;
  refreshInterval?: number;
  
  // KPI Card specific
  layout?: 'grid' | 'list';
  columns?: number;
  metrics?: KpiMetric[];
  
  // Chart specific
  categoryField?: string;
  valueField?: string;
  seriesField?: string;
  showLegend?: boolean;
  stack?: boolean;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  colors?: Record<string, string>;
  
  // Table specific
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  
  // Gauge specific
  min?: number;
  max?: number;
  scale?: {
    ranges: Array<{
      from: number;
      to: number;
      color: string;
    }>;
  };
  pointer?: {
    color?: string;
  };
  centerLabel?: string;
}

export interface KpiMetric {
  field: string;
  label: string;
  format?: 'number' | 'currency' | 'percentage' | 'date';
  icon?: string;
  color?: string;
  suffix?: string;
  prefix?: string;
  showTrend?: boolean;
  trendField?: string;
}

export interface AxisConfig {
  label?: string;
  rotation?: number;
  format?: string;
}

export interface WidgetData {
  data: any;
  widget?: {
    type: DashboardWidgetType;
    config: WidgetConfig;
  };
  // New format with chart template
  chart?: string;
}

export interface ChartDataPoint {
  category: string;
  value: number;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
}

export interface TableColumn {
  field: string;
  label: string;
  sortable?: boolean;
  format?: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
}

// Props passed to widget components
export interface WidgetProps {
  widget: Widget;
  data?: WidgetData;
  loading?: boolean;
  error?: any;
  currentFilters?: Record<string, any>;
}