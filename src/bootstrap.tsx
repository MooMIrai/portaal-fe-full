import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Theme from "common/Theme";
import VisibleRoutes from "./VisibleRoutes";
const root = createRoot(document.getElementById("login-root")!);
root.render(<BrowserRouter>
   <Theme><App /><VisibleRoutes /></Theme></BrowserRouter>);

export {};
