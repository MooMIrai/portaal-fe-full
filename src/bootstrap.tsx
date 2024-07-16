import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = createRoot(document.getElementById("lookups-root")!);
root.render(<BrowserRouter basename="lookups">
   <App /></BrowserRouter>);

export {};
