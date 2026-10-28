import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { canopBaseMessages, CanopI18nProvider } from "@canop/ui";
import { App } from "../../../App";
import { VitrineThemeRoot } from "../../../season/VitrineThemeRoot";

const RENDU_LENT = 20_000;
const LOCALES = ["fr", "en"] as const;
const MENTIONS_INTERDITES = [/fork/i, /CH-UI-Library/i, /QVL-Studio/i, /\bMUI\b/];

function monteAccueil(locale: (typeof LOCALES)[number]) {
  return render(
    <VitrineThemeRoot>
      <CanopI18nProvider locale={locale} messages={canopBaseMessages}>
        <App />
      </CanopI18nProvider>
    </VitrineThemeRoot>,
  );
}

beforeEach(() => {
  window.location.hash = "";
});

afterEach(cleanup);

describe.each(LOCALES)("page d'accueil de la vitrine en %s", (locale) => {
  it(
    "n'affiche aucun pied de page",
    () => {
      const { container } = monteAccueil(locale);
      expect(container.querySelector("footer")).toBeNull();
      expect(container.querySelector('[role="contentinfo"]')).toBeNull();
    },
    RENDU_LENT,
  );

  it.each(MENTIONS_INTERDITES)(
    "ne mentionne nulle part %s",
    (mention) => {
      const { container } = monteAccueil(locale);
      expect(container.textContent ?? "").not.toMatch(mention);
    },
    RENDU_LENT,
  );

  it(
    "affiche bien le contenu de l'accueil",
    () => {
      const { container } = monteAccueil(locale);
      expect(container.querySelector("h1")?.textContent?.length ?? 0).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );
});
