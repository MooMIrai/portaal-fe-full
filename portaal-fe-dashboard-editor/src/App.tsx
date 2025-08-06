import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from "./pages/EditorPage/component";
import TemplatesPage from "./pages/TemplatesPage/component";
import PreviewPage from "./pages/PreviewPage/component";
import { HelpSystem } from "./components/Help";

const App = () => {
  return (
    <HelpSystem
      config={{
        enabled: true,
        showTooltipsInHelpMode: true,
        enableKeyboardShortcuts: true,
        defaultCategory: 'getting-started'
      }}
    >
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/unauthorized" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Accesso non autorizzato</h1>
              <p className="text-gray-600">Non hai i permessi necessari per accedere a questa pagina.</p>
            </div>
          </div>
        } />
      </Routes>
    </HelpSystem>
  );
};

export default App;