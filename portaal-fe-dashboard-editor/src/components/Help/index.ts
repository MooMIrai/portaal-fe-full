// Main export for the Help System
export { HelpSystem } from './HelpSystem';

// Individual component exports
export { HelpProvider, useHelp } from './HelpProvider';
export { HelpTooltip } from './HelpTooltip';
export { HelpTrigger } from './HelpTrigger';
export { HelpTour } from './HelpTour';
export { HelpPanel } from './HelpPanel';
export { default as HelpContextualSuggestions } from './HelpContextualSuggestions';

// Service exports
export { helpAnalytics, useHelpAnalytics } from './services/helpAnalytics';

// Data exports
export { helpContent } from './data/helpContent';
export { helpTours } from './data/helpTours';

// Type exports
export type {
  HelpContent,
  HelpTooltipProps,
  HelpTourStep,
  HelpTour,
  HelpContextValue,
  HelpSystemConfig
} from '../../types/help.types';

export type {
  HelpAnalyticsEvent,
  HelpUsageStats
} from './services/helpAnalytics';