import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = createRoot(document.getElementById("login-root")!);
root.render(<BrowserRouter>
   <App /></BrowserRouter>);

export {};
