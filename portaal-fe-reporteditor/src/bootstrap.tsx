import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ReportEditorProvider } from "./contexts/ReportEditorContext";
import "./index.scss";

const root = createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <ReportEditorProvider>
      <App />
    </ReportEditorProvider>
  </BrowserRouter>
);