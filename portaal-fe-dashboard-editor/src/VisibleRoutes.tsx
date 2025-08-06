import React from "react";
import Routes from "common/Routes";
import TemplatesPage from "./pages/TemplatesPage/component";
import PreviewPage from "./pages/PreviewPage/component";
import { HelpSystem } from "./components/Help";

// Wrapper per fornire HelpSystem a tutte le pagine
// Disabilitiamo l'help system in modalità MFE per evitare sovrapposizioni
const WithHelpSystem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HelpSystem
    config={{
      enabled: false, // Disabilitato per evitare sovrapposizioni
      showTooltipsInHelpMode: false,
      enableKeyboardShortcuts: false,
      defaultCategory: 'getting-started'
    }}
  >
    {children}
  </HelpSystem>
);

export default function VisibleRoutes() {
  return (
    <Routes data={[
      {
        path: "/dashboard-editor/templates", 
        element: <WithHelpSystem><TemplatesPage /></WithHelpSystem>,
        permissions: []
      },
      {
        path: "/dashboard-editor/preview",
        element: <WithHelpSystem><PreviewPage /></WithHelpSystem>,
        permissions: []
      }
    ]} />
  );
}