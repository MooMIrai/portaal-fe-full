export const API_ENDPOINTS = {
  WIDGETS: '/api/v1/structured-widget',
  DASHBOARDS: '/api/v1/dashboards',
  REPORTS: '/api/v1/report-operativo',
  TEMPLATES: '/api/v1/widget-templates'
};

export const WIDGET_TYPES = {
  GANTT: 'gantt',
  PIE: 'pie',
  BAR: 'bar',
  LINE: 'line',
  AREA: 'area',
  TABLE: 'table',
  KPI: 'kpi',
  GAUGE: 'gauge',
  DONUT: 'donut',
  SCATTER: 'scatter',
  HEATMAP: 'heatmap',
  TIMELINE: 'timeline'
} as const;

export const WIDGET_CATEGORIES = {
  CHARTS: 'charts',
  METRICS: 'metrics',
  TABLES: 'tables',
  TIMELINE: 'timeline'
} as const;

export const WIDGET_INFO = {
  [WIDGET_TYPES.GANTT]: {
    name: 'Gantt Chart',
    description: 'Timeline di progetti e attività con barre temporali',
    category: WIDGET_CATEGORIES.TIMELINE,
    icon: 'ganttIcon',
    requiredFields: ['categoryField', 'fromField', 'toField']
  },
  [WIDGET_TYPES.PIE]: {
    name: 'Pie Chart',
    description: 'Distribuzione percentuale dei dati',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'pieChartIcon',
    requiredFields: ['categoryField', 'valueField']
  },
  [WIDGET_TYPES.BAR]: {
    name: 'Bar Chart',
    description: 'Confronto tra categorie con barre',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'barChartIcon',
    requiredFields: ['categoryField', 'valueField']
  },
  [WIDGET_TYPES.LINE]: {
    name: 'Line Chart',
    description: 'Trend e andamenti temporali',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'lineChartIcon',
    requiredFields: ['categoryField', 'valueField']
  },
  [WIDGET_TYPES.AREA]: {
    name: 'Area Chart',
    description: 'Volume cumulativo con enfasi sull\'area',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'areaChartIcon',
    requiredFields: ['categoryField', 'valueField']
  },
  [WIDGET_TYPES.TABLE]: {
    name: 'Table',
    description: 'Dati dettagliati in formato tabellare',
    category: WIDGET_CATEGORIES.TABLES,
    icon: 'tableIcon',
    requiredFields: ['columns']
  },
  [WIDGET_TYPES.KPI]: {
    name: 'KPI Card',
    description: 'Metriche chiave con trend',
    category: WIDGET_CATEGORIES.METRICS,
    icon: 'kpiIcon',
    requiredFields: ['valueField']
  },
  [WIDGET_TYPES.GAUGE]: {
    name: 'Gauge',
    description: 'Indicatore di performance con soglie',
    category: WIDGET_CATEGORIES.METRICS,
    icon: 'gaugeIcon',
    requiredFields: ['valueField', 'min', 'max']
  },
  [WIDGET_TYPES.DONUT]: {
    name: 'Donut Chart',
    description: 'Pie chart con valore centrale',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'donutChartIcon',
    requiredFields: ['categoryField', 'valueField']
  },
  [WIDGET_TYPES.SCATTER]: {
    name: 'Scatter Plot',
    description: 'Correlazioni e distribuzioni',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'scatterChartIcon',
    requiredFields: ['xField', 'yField']
  },
  [WIDGET_TYPES.HEATMAP]: {
    name: 'Heatmap',
    description: 'Matrici di dati con intensità colore',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'heatmapIcon',
    requiredFields: ['xField', 'yField', 'valueField']
  },
  [WIDGET_TYPES.TIMELINE]: {
    name: 'Timeline',
    description: 'Eventi e milestone cronologici',
    category: WIDGET_CATEGORIES.TIMELINE,
    icon: 'timelineIcon',
    requiredFields: ['dateField', 'titleField']
  }
};

export const DEFAULT_COLORS = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#f39c12', // Orange
  '#e74c3c', // Red
  '#9b59b6', // Purple
  '#1abc9c', // Turquoise
  '#34495e', // Dark Gray
  '#f1c40f', // Yellow
  '#e67e22', // Carrot
  '#16a085'  // Green Sea
];

export const DATE_FORMATS = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
  { value: 'dd MMM yyyy', label: 'DD MMM YYYY' },
  { value: 'MMM yyyy', label: 'MMM YYYY' },
  { value: 'yyyy', label: 'YYYY' }
];

export const BASE_UNITS = [
  { value: 'days', label: 'Giorni' },
  { value: 'weeks', label: 'Settimane' },
  { value: 'months', label: 'Mesi' },
  { value: 'years', label: 'Anni' }
];

export const CHART_ORIENTATIONS = [
  { value: 'vertical', label: 'Verticale' },
  { value: 'horizontal', label: 'Orizzontale' }
];

export const LEGEND_POSITIONS = [
  { value: 'top', label: 'Alto' },
  { value: 'bottom', label: 'Basso' },
  { value: 'left', label: 'Sinistra' },
  { value: 'right', label: 'Destra' },
  { value: 'none', label: 'Nascosta' }
];