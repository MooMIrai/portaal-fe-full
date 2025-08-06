import React from "react";
import EditorPage from "./pages/EditorPage/component";
import TemplatesPage from "./pages/TemplatesPage/component";
import PreviewPage from "./pages/PreviewPage/component";
import { HelpSystem } from "./components/Help";

// Wrapper per fornire HelpSystem a tutte le pagine
// Disabilitiamo completamente l'help system per evitare sovrapposizioni
const DashboardEditorWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HelpSystem
    config={{
      enabled: false, // Disabilitato completamente in modalità MFE
      showTooltipsInHelpMode: false,
      enableKeyboardShortcuts: false,
      defaultCategory: 'getting-started'
    }}
  >
    {children}
  </HelpSystem>
);

// Esporta un oggetto con le route per l'applicazione principale
export default {
  "/dashboard-editor": () => (
    <DashboardEditorWrapper>
      <EditorPage />
    </DashboardEditorWrapper>
  ),
  "/dashboard-editor/templates": () => (
    <DashboardEditorWrapper>
      <TemplatesPage />
    </DashboardEditorWrapper>
  ),
  "/dashboard-editor/preview": () => (
    <DashboardEditorWrapper>
      <PreviewPage />
    </DashboardEditorWrapper>
  )
};