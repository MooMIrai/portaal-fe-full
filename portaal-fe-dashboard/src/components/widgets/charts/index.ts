export { DeclarativePieChart } from './DeclarativePieChart';
export { DeclarativeBarChart } from './DeclarativeBarChart';
export { DeclarativeLineChart } from './DeclarativeLineChart';
export { ProblematicWidgetAdapter } from './ProblematicWidgetAdapter';

// Chart type enum for the dispatcher
export enum DeclarativeChartType {
  PIE = 'pie',
  BAR = 'bar',
  LINE = 'line',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  SCATTER = 'scatter',
  BUBBLE = 'bubble',
  RADAR = 'radar',
  POLAR_AREA = 'polarArea'
}