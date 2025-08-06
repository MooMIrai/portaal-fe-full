import React, { useState, useRef, useEffect } from 'react';
import { Popup } from '@progress/kendo-react-popup';
import { Button } from '@progress/kendo-react-buttons';
import { HelpTooltipProps } from '../../types/help.types';
import { useHelp } from './HelpProvider';
import './HelpTooltip.scss';

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  id,
  content,
  title,
  position = 'top',
  trigger = 'hover',
  children
}) => {
  const { isHelpMode } = useHelp();
  const [show, setShow] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Show tooltip in help mode or when triggered
  const shouldShow = show && (isHelpMode || trigger !== 'hover');

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      const timeout = setTimeout(() => setShow(true), 300);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setShow(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setShow(prev => !prev);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      setShow(true);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      setShow(false);
    }
  };

  const getPopupPosition = () => {
    switch (position) {
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
    <div className="help-tooltip-wrapper">
      <div
        ref={anchorRef}
        className={`help-tooltip-anchor ${isHelpMode ? 'help-mode-active' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-help-id={id}
      >
        {children}
        {isHelpMode && (
          <div className="help-indicator">
            <i className="k-icon k-i-question" />
          </div>
        )}
      </div>

      <Popup
        show={shouldShow}
        anchor={anchorRef.current}
        {...getPopupPosition()}
        className="help-tooltip-popup"
      >
        <div className="help-tooltip-content">
          {title && (
            <div className="help-tooltip-header">
              <h4 className="help-tooltip-title">{title}</h4>
              <Button
                icon="x"
                look="flat"
                size="small"
                onClick={() => setShow(false)}
                className="help-tooltip-close"
              />
            </div>
          )}
          <div className="help-tooltip-body">
            <p>{content}</p>
          </div>
        </div>
      </Popup>
    </div>
  );
};