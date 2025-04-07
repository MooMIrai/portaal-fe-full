import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Theme from "common/Theme";
import initFn from "./MfeInit";

const root = createRoot(document.getElementById("chatbot-root")!);
root.render(
  <BrowserRouter basename="">
    <Theme>
      <App />
    </Theme>
  </BrowserRouter>
);

initFn()

export {};
