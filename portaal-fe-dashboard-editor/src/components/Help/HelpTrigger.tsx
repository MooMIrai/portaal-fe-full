import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownButton } from '@progress/kendo-react-buttons';
import { useHelp } from './HelpProvider';
import { helpTours } from './data/helpTours';
import './HelpTrigger.scss';

export const HelpTrigger: React.FC = () => {
  const { isHelpMode, toggleHelpMode, toggleHelpPanel, startTour } = useHelp();

  const tourItems = helpTours.map(tour => ({
    text: tour.name,
    icon: 'play',
    click: () => startTour(tour.id)
  }));

  const helpMenuItems = [
    {
      text: 'Help Documentation',
      icon: 'book',
      click: toggleHelpPanel
    },
    { separator: true },
    {
      text: 'Quick Tours',
      icon: 'play',
      items: tourItems
    },
    { separator: true },
    {
      text: isHelpMode ? 'Exit Help Mode' : 'Enter Help Mode',
      icon: isHelpMode ? 'eye-slash' : 'eye',
      click: toggleHelpMode
    },
    { separator: true },
    {
      text: 'Keyboard Shortcuts',
      icon: 'keyboard',
      click: () => {
        toggleHelpPanel();
        // Could also open directly to shortcuts section
      }
    }
  ];

  return (
    <div className="help-trigger" data-help-id="help-trigger">
      <DropDownButton
        text="Help"
        icon="question"
        items={helpMenuItems}
        themeColor={isHelpMode ? 'primary' : undefined}
        className={`help-trigger-button ${isHelpMode ? 'help-mode-active' : ''}`}
      />
      
      {isHelpMode && (
        <div className="help-mode-indicator">
          <span className="help-mode-text">Help Mode Active</span>
          <Button
            icon="x"
            look="flat"
            size="small"
            onClick={toggleHelpMode}
            className="help-mode-close"
          />
        </div>
      )}
    </div>
  );
};