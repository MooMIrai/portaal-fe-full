import { chartTemplateParser } from './ChartTemplateParser';
import { Gantt } from '../../components/widgets/GanttChart';

/**
 * Register custom components for use in chart templates
 */
export function registerCustomComponents() {
  // Register Gantt component
  chartTemplateParser.registerComponent('Gantt', Gantt);
  
  // Add more custom components here as needed
  // Example:
  // chartTemplateParser.registerComponent('Timeline', TimelineComponent);
  // chartTemplateParser.registerComponent('Heatmap', HeatmapComponent);
}