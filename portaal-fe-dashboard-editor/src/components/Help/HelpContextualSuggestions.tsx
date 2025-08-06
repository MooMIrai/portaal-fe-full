import React, { useMemo } from 'react';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useHelp } from './HelpProvider';
import { helpContent } from './data/helpContent';
import { helpTours } from './data/helpTours';
import { helpAnalytics } from './services/helpAnalytics';
import { HelpContent, HelpTour } from '../../types/help.types';

interface HelpContextualSuggestionsProps {
  context: string; // Current page/component context
  userAction?: string; // What the user is trying to do
  className?: string;
}

export const HelpContextualSuggestions: React.FC<HelpContextualSuggestionsProps> = ({
  context,
  userAction,
  className = ''
}) => {
  const { startTour, toggleHelpPanel } = useHelp();

  // Get contextual suggestions based on current context
  const suggestions = useMemo(() => {
    const contextualContent: HelpContent[] = [];
    const contextualTours: HelpTour[] = [];

    // Match content by context keywords
    const contextKeywords = context.toLowerCase().split(/[\s-_]+/);
    
    helpContent.forEach(content => {
      const contentKeywords = [
        ...content.searchKeywords,
        ...content.tags,
        content.category,
        content.title.toLowerCase()
      ];
      
      const hasMatch = contextKeywords.some(keyword => 
        contentKeywords.some(contentKeyword => 
          contentKeyword.includes(keyword) || keyword.includes(contentKeyword)
        )
      );
      
      if (hasMatch) {
        contextualContent.push(content);
      }
    });

    // Match tours by context
    helpTours.forEach(tour => {
      const tourKeywords = [
        tour.category,
        tour.name.toLowerCase(),
        tour.description.toLowerCase()
      ];
      
      const hasMatch = contextKeywords.some(keyword => 
        tourKeywords.some(tourKeyword => 
          tourKeyword.includes(keyword) || keyword.includes(tourKeyword)
        )
      );
      
      if (hasMatch) {
        contextualTours.push(tour);
      }
    });

    // Sort by relevance (more matches = higher relevance)
    contextualContent.sort((a, b) => {
      const aMatches = contextKeywords.filter(keyword => 
        [...a.searchKeywords, ...a.tags].some(k => k.includes(keyword))
      ).length;
      const bMatches = contextKeywords.filter(keyword => 
        [...b.searchKeywords, ...b.tags].some(k => k.includes(keyword))
      ).length;
      return bMatches - aMatches;
    });

    return {
      content: contextualContent.slice(0, 3), // Top 3 most relevant
      tours: contextualTours.slice(0, 2) // Top 2 most relevant
    };
  }, [context, userAction]);

  const handleContentClick = (content: HelpContent) => {
    helpAnalytics.trackHelpContentView(content.id);
    toggleHelpPanel();
    // The HelpPanel will handle showing the content
  };

  const handleTourStart = (tour: HelpTour) => {
    startTour(tour.id);
  };

  // Don't show if no suggestions
  if (suggestions.content.length === 0 && suggestions.tours.length === 0) {
    return null;
  }

  return (
    <Card className={`help-contextual-suggestions ${className}`}>
      <CardBody>
        <div className="help-suggestions-header mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            💡 Helpful Resources
          </h4>
          <p className="text-xs text-gray-500">
            Based on what you're working on
          </p>
        </div>

        {/* Contextual Content */}
        {suggestions.content.length > 0 && (
          <div className="help-content-suggestions mb-4">
            <h5 className="text-xs font-medium text-gray-600 mb-2">
              📚 Related Help Articles
            </h5>
            <div className="space-y-2">
              {suggestions.content.map(content => (
                <button
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="w-full text-left p-2 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    {content.title}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {content.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </div>
                  <div className="flex gap-1 mt-1">
                    {content.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="inline-block px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contextual Tours */}
        {suggestions.tours.length > 0 && (
          <div className="help-tour-suggestions">
            <h5 className="text-xs font-medium text-gray-600 mb-2">
              🎯 Guided Tours
            </h5>
            <div className="space-y-2">
              {suggestions.tours.map(tour => (
                <button
                  key={tour.id}
                  onClick={() => handleTourStart(tour)}
                  className="w-full text-left p-2 rounded-md border border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {tour.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {tour.description}
                      </div>
                      <div className="text-xs text-green-600">
                        {tour.steps.length} steps • {Math.ceil(tour.steps.length * 1.5)} min
                      </div>
                    </div>
                    <div className="ml-2 text-green-500">
                      ▶
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="help-quick-actions mt-4 pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              size="small"
              look="flat"
              onClick={toggleHelpPanel}
              className="text-xs"
            >
              📖 Browse All Help
            </Button>
            {userAction && (
              <Button
                size="small"
                look="flat"
                onClick={() => helpAnalytics.trackHelpSearch(userAction)}
                className="text-xs"
              >
                🔍 Search "{userAction}"
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default HelpContextualSuggestions;