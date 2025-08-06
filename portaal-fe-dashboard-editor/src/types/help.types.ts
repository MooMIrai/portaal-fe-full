export interface HelpContent {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  searchKeywords: string[];
}

export interface HelpTooltipProps {
  id: string;
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  children: React.ReactNode;
}

export interface HelpTourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  optional?: boolean;
}

export interface HelpTour {
  id: string;
  name: string;
  description: string;
  steps: HelpTourStep[];
  category: string;
}

export interface HelpContextValue {
  isHelpMode: boolean;
  activeTour: string | null;
  currentTourStep: number;
  helpPanelOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  toggleHelpMode: () => void;
  startTour: (tourId: string) => void;
  stopTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  toggleHelpPanel: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export interface HelpSystemConfig {
  enabled: boolean;
  showTooltipsInHelpMode: boolean;
  autoStartTour: string | null;
  defaultCategory: string;
  enableKeyboardShortcuts: boolean;
}