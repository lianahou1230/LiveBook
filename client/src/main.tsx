import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DEFAULT_THEME_STYLE } from "@/lib/theme/default-theme";
import { App } from "./App";
import { AppErrorBoundary } from "./components/ErrorBoundary";
import "./globals.css";
import { Providers } from "./providers";

if (!document.documentElement.dataset.themeStyle) {
  document.documentElement.dataset.themeStyle = DEFAULT_THEME_STYLE;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <Providers>
          <App />
        </Providers>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);
