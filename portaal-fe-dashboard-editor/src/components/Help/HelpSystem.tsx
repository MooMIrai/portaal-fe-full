import React from 'react';
import { HelpProvider } from './HelpProvider';
import { HelpTour } from './HelpTour';
import { HelpPanel } from './HelpPanel';
import { HelpSystemConfig } from '../../types/help.types';

interface HelpSystemProps {
  children: React.ReactNode;
  config?: Partial<HelpSystemConfig>;
}

export const HelpSystem: React.FC<HelpSystemProps> = ({ children, config }) => {
  // Se l'help è disabilitato, non renderizzare i componenti help
  if (config?.enabled === false) {
    return (
      <HelpProvider config={config}>
        {children}
      </HelpProvider>
    );
  }
  
  return (
    <HelpProvider config={config}>
      {children}
      <HelpTour />
      <HelpPanel />
    </HelpProvider>
  );
};

// Export all help components for easy importing
export { HelpProvider, useHelp } from './HelpProvider';
export { HelpTooltip } from './HelpTooltip';
export { HelpTrigger } from './HelpTrigger';
export { HelpTour } from './HelpTour';
export { HelpPanel } from './HelpPanel';