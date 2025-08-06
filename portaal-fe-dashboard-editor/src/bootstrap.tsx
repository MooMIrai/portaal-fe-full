import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import Theme from "common/Theme";
import "./tailwind.css";
import "./index.scss";

// Standalone mode - quando l'app viene eseguita direttamente
const root = ReactDOM.createRoot(document.getElementById("dashboard-editor-root")!);
root.render(
  <BrowserRouter>
    {/* Temporaneamente disabilitiamo Theme per evitare conflitti */}
    {/* <Theme insertionPoint="css-theme-switcher-insertion-point"> */}
      <App />
    {/* </Theme> */}
  </BrowserRouter>
);

export {};