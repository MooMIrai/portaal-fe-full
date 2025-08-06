import React from "react";
import { Route } from 'react-router-dom';
import EditorPage from "./pages/EditorPage/component";
import TemplatesPage from "./pages/TemplatesPage/component";
import PreviewPage from "./pages/PreviewPage/component";
import { HelpSystem } from "./components/Help";

// Componente wrapper per fornire HelpSystem
const WithHelpSystem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HelpSystem
    config={{
      enabled: true,
      showTooltipsInHelpMode: true,
      enableKeyboardShortcuts: false,
      defaultCategory: 'getting-started'
    }}
  >
    {children}
  </HelpSystem>
);

// Esporta le route per l'applicazione principale
const MfeRoutes = [
  <Route 
    key="dashboard-editor" 
    path="/dashboard-editor" 
    element={<WithHelpSystem><EditorPage /></WithHelpSystem>} 
  />,
  <Route 
    key="dashboard-editor-templates" 
    path="/dashboard-editor/templates" 
    element={<WithHelpSystem><TemplatesPage /></WithHelpSystem>} 
  />,
  <Route 
    key="dashboard-editor-preview" 
    path="/dashboard-editor/preview" 
    element={<WithHelpSystem><PreviewPage /></WithHelpSystem>} 
  />
];

export default MfeRoutes;