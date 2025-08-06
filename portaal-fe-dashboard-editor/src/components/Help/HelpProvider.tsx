import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HelpContextValue, HelpSystemConfig, HelpTour } from '../../types/help.types';
import { helpTours } from './data/helpTours';
import { helpAnalytics } from './services/helpAnalytics';

const HelpContext = createContext<HelpContextValue | undefined>(undefined);

interface HelpProviderProps {
  children: ReactNode;
  config?: Partial<HelpSystemConfig>;
}

const defaultConfig: HelpSystemConfig = {
  enabled: true,
  showTooltipsInHelpMode: true,
  autoStartTour: null,
  defaultCategory: 'general',
  enableKeyboardShortcuts: true,
};

export const HelpProvider: React.FC<HelpProviderProps> = ({ children, config = {} }) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [activeTour, setActiveTour] = useState<string | null>(null);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(finalConfig.defaultCategory);

  // Keyboard shortcuts
  useEffect(() => {
    if (!finalConfig.enableKeyboardShortcuts) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // F1 - Toggle help mode
      if (event.key === 'F1') {
        event.preventDefault();
        toggleHelpMode();
      }
      // Ctrl+Shift+H - Toggle help panel
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        toggleHelpPanel();
      }
      // Escape - Close help panel or exit help mode
      if (event.key === 'Escape') {
        if (helpPanelOpen) {
          setHelpPanelOpen(false);
        } else if (activeTour) {
          stopTour();
        } else if (isHelpMode) {
          setIsHelpMode(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [finalConfig.enableKeyboardShortcuts, helpPanelOpen, activeTour, isHelpMode]);

  // Auto-start tour
  useEffect(() => {
    if (finalConfig.autoStartTour) {
      startTour(finalConfig.autoStartTour);
    }
  }, [finalConfig.autoStartTour]);

  const toggleHelpMode = () => {
    setIsHelpMode(prev => !prev);
    if (activeTour) {
      stopTour();
    }
  };

  const startTour = (tourId: string) => {
    const tour = helpTours.find(t => t.id === tourId);
    if (tour && tour.steps.length > 0) {
      setActiveTour(tourId);
      setCurrentTourStep(0);
      setIsHelpMode(true);
      setHelpPanelOpen(false);
      
      // Track tour start
      helpAnalytics.trackTourStart(tourId);
      
      // Scroll to first step target
      setTimeout(() => {
        const targetElement = document.querySelector(tour.steps[0].target);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const stopTour = () => {
    setActiveTour(null);
    setCurrentTourStep(0);
  };

  const nextTourStep = () => {
    const tour = helpTours.find(t => t.id === activeTour);
    if (tour && currentTourStep < tour.steps.length - 1) {
      const nextStep = currentTourStep + 1;
      setCurrentTourStep(nextStep);
      
      // Execute step action if available
      const step = tour.steps[nextStep];
      if (step.action) {
        step.action();
      }
      
      // Scroll to next step target
      setTimeout(() => {
        const targetElement = document.querySelector(step.target);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      stopTour();
    }
  };

  const prevTourStep = () => {
    if (currentTourStep > 0) {
      const prevStep = currentTourStep - 1;
      setCurrentTourStep(prevStep);
      
      const tour = helpTours.find(t => t.id === activeTour);
      if (tour) {
        const step = tour.steps[prevStep];
        setTimeout(() => {
          const targetElement = document.querySelector(step.target);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  };

  const toggleHelpPanel = () => {
    setHelpPanelOpen(prev => {
      const newState = !prev;
      if (newState) {
        // Track help panel opening
        helpAnalytics.trackHelpPanelOpen();
      }
      return newState;
    });
  };

  const contextValue: HelpContextValue = {
    isHelpMode,
    activeTour,
    currentTourStep,
    helpPanelOpen,
    searchQuery,
    selectedCategory,
    toggleHelpMode,
    startTour,
    stopTour,
    nextTourStep,
    prevTourStep,
    toggleHelpPanel,
    setSearchQuery,
    setSelectedCategory,
  };

  if (!finalConfig.enabled) {
    return <>{children}</>;
  }

  return (
    <HelpContext.Provider value={contextValue}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = (): HelpContextValue => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};