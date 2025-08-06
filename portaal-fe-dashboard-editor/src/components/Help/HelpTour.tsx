import React, { useEffect, useRef } from 'react';
import { Popup } from '@progress/kendo-react-popup';
import { Button } from '@progress/kendo-react-buttons';
import { useHelp } from './HelpProvider';
import { helpTours } from './data/helpTours';
import './HelpTour.scss';

export const HelpTour: React.FC = () => {
  const {
    activeTour,
    currentTourStep,
    stopTour,
    nextTourStep,
    prevTourStep
  } = useHelp();

  const anchorRef = useRef<HTMLElement | null>(null);

  const currentTour = helpTours.find(tour => tour.id === activeTour);
  const currentStep = currentTour?.steps[currentTourStep];

  useEffect(() => {
    if (currentStep) {
      const targetElement = document.querySelector(currentStep.target) as HTMLElement;
      anchorRef.current = targetElement;
      
      if (targetElement) {
        // Add highlight class
        targetElement.classList.add('tour-highlight');
        
        // Cleanup function
        return () => {
          targetElement.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep]);

  if (!currentTour || !currentStep || !anchorRef.current) {
    return null;
  }

  const isFirstStep = currentTourStep === 0;
  const isLastStep = currentTourStep === currentTour.steps.length - 1;
  const progress = ((currentTourStep + 1) / currentTour.steps.length) * 100;

  const getPopupPosition = () => {
    switch (currentStep.position) {
      case 'bottom':
        return { origin: 'top center', position: 'bottom center' };
      case 'left':
        return { origin: 'center right', position: 'center left' };
      case 'right':
        return { origin: 'center left', position: 'center right' };
      default:
        return { origin: 'bottom center', position: 'top center' };
    }
  };

  return (
    <>
      {/* Tour overlay */}
      <div className="tour-overlay" onClick={stopTour} />
      
      {/* Tour popup */}
      <Popup
        show={true}
        anchor={anchorRef.current}
        {...getPopupPosition()}
        className="help-tour-popup"
      >
        <div className="help-tour-content">
          {/* Header */}
          <div className="help-tour-header">
            <div className="help-tour-info">
              <h3 className="help-tour-title">{currentStep.title}</h3>
              <div className="help-tour-meta">
                <span className="help-tour-step">
                  Step {currentTourStep + 1} of {currentTour.steps.length}
                </span>
                <span className="help-tour-name">{currentTour.name}</span>
              </div>
            </div>
            <Button
              icon="x"
              look="flat"
              size="small"
              onClick={stopTour}
              className="help-tour-close"
            />
          </div>

          {/* Progress bar */}
          <div className="help-tour-progress">
            <div 
              className="help-tour-progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="help-tour-body">
            <p>{currentStep.content}</p>
          </div>

          {/* Actions */}
          <div className="help-tour-actions">
            <div className="help-tour-navigation">
              <Button
                onClick={prevTourStep}
                disabled={isFirstStep}
                icon="arrow-left"
                size="small"
              >
                Previous
              </Button>
              
              {isLastStep ? (
                <Button
                  onClick={stopTour}
                  themeColor="primary"
                  size="small"
                >
                  Finish Tour
                </Button>
              ) : (
                <Button
                  onClick={nextTourStep}
                  themeColor="primary"
                  iconClass="k-icon k-i-arrow-right"
                  size="small"
                >
                  Next
                </Button>
              )}
            </div>

            <div className="help-tour-skip">
              <Button
                onClick={stopTour}
                look="flat"
                size="small"
              >
                Skip Tour
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};