import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import { InstallationPage } from "../InstallationPage";

const RENDU_LENT = 20_000;
const LOCALES = ["fr", "en"] as const;
const VERSION_3_X = /(?<![\d.])3\.\d+\.\d+(?![\d.])/;

describe.each(LOCALES)("page Installation de la vitrine en %s", (locale) => {
  it(
    "ne mentionne aucune version 3.x.x de CanopUI",
    () => {
      const { container } = render(
        <CanopI18nProvider locale={locale}>
          <CanopThemeProvider>
            <InstallationPage />
          </CanopThemeProvider>
        </CanopI18nProvider>,
      );
      expect(container.textContent?.length ?? 0).toBeGreaterThan(0);
      expect(container.textContent ?? "").not.toMatch(VERSION_3_X);
    },
    RENDU_LENT,
  );
});
