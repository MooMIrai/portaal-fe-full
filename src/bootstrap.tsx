import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Theme from "common/Theme";

const root = createRoot(document.getElementById("lookups-root")!);
root.render(
  <BrowserRouter basename="">
    <Theme>
      <App />
    </Theme>
  </BrowserRouter>
);

export {};
