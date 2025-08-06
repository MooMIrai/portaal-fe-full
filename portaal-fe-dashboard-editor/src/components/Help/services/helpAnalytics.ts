// Help System Analytics Service
// Tracks usage of help features for insights and improvements

export interface HelpAnalyticsEvent {
  type: 'tooltip_viewed' | 'tour_started' | 'tour_completed' | 'tour_skipped' | 'help_panel_opened' | 'help_content_viewed' | 'help_search_performed';
  timestamp: number;
  helpId?: string;
  tourId?: string;
  contentId?: string;
  searchQuery?: string;
  duration?: number;
  stepReached?: number;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

export interface HelpUsageStats {
  totalTooltipViews: number;
  totalTourStarts: number;
  totalTourCompletions: number;
  totalPanelOpens: number;
  totalSearches: number;
  popularContent: { id: string; views: number }[];
  popularTooltips: { id: string; views: number }[];
  tourCompletionRates: { tourId: string; starts: number; completions: number; rate: number }[];
  averageTourDuration: { tourId: string; avgDuration: number }[];
  searchQueries: { query: string; count: number }[];
}

class HelpAnalyticsService {
  private events: HelpAnalyticsEvent[] = [];
  private isEnabled: boolean = true;
  private maxEvents: number = 1000; // Keep last 1000 events
  private storageKey: string = 'dashboard-editor-help-analytics';

  constructor() {
    this.loadFromStorage();
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Track a help system event
  track(event: Omit<HelpAnalyticsEvent, 'timestamp' | 'userAgent' | 'viewport'>): void {
    if (!this.isEnabled) return;

    const fullEvent: HelpAnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.events.push(fullEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    this.saveToStorage();
  }

  // Track tooltip view
  trackTooltipView(helpId: string, duration?: number): void {
    this.track({
      type: 'tooltip_viewed',
      helpId,
      duration
    });
  }

  // Track tour events
  trackTourStart(tourId: string): void {
    this.track({
      type: 'tour_started',
      tourId
    });
  }

  trackTourCompleted(tourId: string, duration: number): void {
    this.track({
      type: 'tour_completed',
      tourId,
      duration
    });
  }

  trackTourSkipped(tourId: string, stepReached: number, duration: number): void {
    this.track({
      type: 'tour_skipped',
      tourId,
      stepReached,
      duration
    });
  }

  // Track help panel usage
  trackHelpPanelOpen(): void {
    this.track({
      type: 'help_panel_opened'
    });
  }

  trackHelpContentView(contentId: string): void {
    this.track({
      type: 'help_content_viewed',
      contentId
    });
  }

  trackHelpSearch(searchQuery: string): void {
    this.track({
      type: 'help_search_performed',
      searchQuery: searchQuery.toLowerCase().trim()
    });
  }

  // Get usage statistics
  getUsageStats(): HelpUsageStats {
    const stats: HelpUsageStats = {
      totalTooltipViews: 0,
      totalTourStarts: 0,
      totalTourCompletions: 0,
      totalPanelOpens: 0,
      totalSearches: 0,
      popularContent: [],
      popularTooltips: [],
      tourCompletionRates: [],
      averageTourDuration: [],
      searchQueries: []
    };

    // Count events by type
    const eventCounts = new Map<string, number>();
    const contentViews = new Map<string, number>();
    const tooltipViews = new Map<string, number>();
    const tourStats = new Map<string, { starts: number; completions: number; durations: number[] }>();
    const searchQueries = new Map<string, number>();

    this.events.forEach(event => {
      // Count by type
      eventCounts.set(event.type, (eventCounts.get(event.type) || 0) + 1);

      // Track content views
      if (event.type === 'help_content_viewed' && event.contentId) {
        contentViews.set(event.contentId, (contentViews.get(event.contentId) || 0) + 1);
      }

      // Track tooltip views
      if (event.type === 'tooltip_viewed' && event.helpId) {
        tooltipViews.set(event.helpId, (tooltipViews.get(event.helpId) || 0) + 1);
      }

      // Track tour statistics
      if (event.tourId) {
        if (!tourStats.has(event.tourId)) {
          tourStats.set(event.tourId, { starts: 0, completions: 0, durations: [] });
        }
        const tourStat = tourStats.get(event.tourId)!;

        if (event.type === 'tour_started') {
          tourStat.starts++;
        } else if (event.type === 'tour_completed' && event.duration) {
          tourStat.completions++;
          tourStat.durations.push(event.duration);
        }
      }

      // Track search queries
      if (event.type === 'help_search_performed' && event.searchQuery) {
        searchQueries.set(event.searchQuery, (searchQueries.get(event.searchQuery) || 0) + 1);
      }
    });

    // Populate basic stats
    stats.totalTooltipViews = eventCounts.get('tooltip_viewed') || 0;
    stats.totalTourStarts = eventCounts.get('tour_started') || 0;
    stats.totalTourCompletions = eventCounts.get('tour_completed') || 0;
    stats.totalPanelOpens = eventCounts.get('help_panel_opened') || 0;
    stats.totalSearches = eventCounts.get('help_search_performed') || 0;

    // Popular content
    stats.popularContent = Array.from(contentViews.entries())
      .map(([id, views]) => ({ id, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Popular tooltips
    stats.popularTooltips = Array.from(tooltipViews.entries())
      .map(([id, views]) => ({ id, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Tour completion rates
    stats.tourCompletionRates = Array.from(tourStats.entries())
      .map(([tourId, data]) => ({
        tourId,
        starts: data.starts,
        completions: data.completions,
        rate: data.starts > 0 ? (data.completions / data.starts) * 100 : 0
      }))
      .sort((a, b) => b.rate - a.rate);

    // Average tour duration
    stats.averageTourDuration = Array.from(tourStats.entries())
      .filter(([_, data]) => data.durations.length > 0)
      .map(([tourId, data]) => ({
        tourId,
        avgDuration: data.durations.reduce((sum, duration) => sum + duration, 0) / data.durations.length
      }))
      .sort((a, b) => a.avgDuration - b.avgDuration);

    // Search queries
    stats.searchQueries = Array.from(searchQueries.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return stats;
  }

  // Get events within a time range
  getEventsInRange(startTime: number, endTime: number): HelpAnalyticsEvent[] {
    return this.events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  // Get events for the last N days
  getRecentEvents(days: number = 7): HelpAnalyticsEvent[] {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.events.filter(event => event.timestamp >= cutoffTime);
  }

  // Export analytics data
  exportData(): string {
    const data = {
      events: this.events,
      stats: this.getUsageStats(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Clear all analytics data
  clearData(): void {
    this.events = [];
    this.saveToStorage();
  }

  // Get insights and recommendations
  getInsights(): string[] {
    const stats = this.getUsageStats();
    const insights: string[] = [];

    // Tour completion insights
    const lowCompletionTours = stats.tourCompletionRates.filter(tour => tour.rate < 50 && tour.starts >= 5);
    if (lowCompletionTours.length > 0) {
      insights.push(`Tours with low completion rates: ${lowCompletionTours.map(t => t.tourId).join(', ')}. Consider simplifying or shortening these tours.`);
    }

    // Popular content insights
    if (stats.popularContent.length > 0) {
      insights.push(`Most viewed help content: "${stats.popularContent[0].id}" (${stats.popularContent[0].views} views). Consider promoting similar content.`);
    }

    // Search insights
    if (stats.searchQueries.length > 0) {
      const topSearches = stats.searchQueries.slice(0, 3).map(s => s.query);
      insights.push(`Top search queries: ${topSearches.join(', ')}. Consider creating dedicated content for these topics.`);
    }

    // Usage patterns
    if (stats.totalTooltipViews > stats.totalPanelOpens * 5) {
      insights.push('Users prefer contextual tooltips over the help panel. Focus on improving tooltip content.');
    }

    if (stats.totalTourStarts > 0 && (stats.totalTourCompletions / stats.totalTourStarts) < 0.3) {
      insights.push('Overall tour completion rate is low. Consider making tours shorter or more engaging.');
    }

    return insights;
  }

  // Private methods
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        events: this.events,
        lastSaved: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save help analytics to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.events = data.events || [];
      }
    } catch (error) {
      console.warn('Failed to load help analytics from localStorage:', error);
      this.events = [];
    }
  }
}

// Create singleton instance
export const helpAnalytics = new HelpAnalyticsService();

// Hook for React components
export const useHelpAnalytics = () => {
  return {
    track: helpAnalytics.track.bind(helpAnalytics),
    trackTooltipView: helpAnalytics.trackTooltipView.bind(helpAnalytics),
    trackTourStart: helpAnalytics.trackTourStart.bind(helpAnalytics),
    trackTourCompleted: helpAnalytics.trackTourCompleted.bind(helpAnalytics),
    trackTourSkipped: helpAnalytics.trackTourSkipped.bind(helpAnalytics),
    trackHelpPanelOpen: helpAnalytics.trackHelpPanelOpen.bind(helpAnalytics),
    trackHelpContentView: helpAnalytics.trackHelpContentView.bind(helpAnalytics),
    trackHelpSearch: helpAnalytics.trackHelpSearch.bind(helpAnalytics),
    getUsageStats: helpAnalytics.getUsageStats.bind(helpAnalytics),
    getInsights: helpAnalytics.getInsights.bind(helpAnalytics),
    exportData: helpAnalytics.exportData.bind(helpAnalytics)
  };
};