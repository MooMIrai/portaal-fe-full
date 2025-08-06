import React from 'react';
import { HelpTooltip } from './HelpTooltip';
import { HelpTooltipProps } from '../../types/help.types';

// Wrapper che gestisce il caso in cui HelpProvider non sia disponibile
export const SafeHelpTooltip: React.FC<HelpTooltipProps> = (props) => {
  try {
    return <HelpTooltip {...props} />;
  } catch (error) {
    // Se HelpProvider non è disponibile, renderizza solo i children
    return <>{props.children}</>;
  }
};