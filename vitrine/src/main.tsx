import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { canopBaseMessages, CanopI18nProvider } from "@canop/ui";
import { App } from "./App";
import { VitrineThemeRoot } from "./season/VitrineThemeRoot";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VitrineThemeRoot>
      <CanopI18nProvider messages={canopBaseMessages}>
        <App />
      </CanopI18nProvider>
    </VitrineThemeRoot>
  </StrictMode>,
);
