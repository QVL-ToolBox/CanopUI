import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import { VersionsPage } from "../VersionsPage";

const RENDU_LENT = 20_000;
const VERSIONS_ANTERIEURES = [
  "1.3.2",
  "1.3.1",
  "1.3.0",
  "1.2.0",
  "1.1.0",
  "1.0.0",
  "3.1.1",
  "3.1.0",
  "3.0.2",
  "3.0.1",
  "3.0.0",
];

function monte(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function carteDeVersion(version: string) {
  return screen.getByRole("button", { name: `Afficher ou masquer la version ${version}` });
}

describe("page Versions de la vitrine", () => {
  it(
    "marque 1.3.3 comme la version en production",
    () => {
      monte(<VersionsPage />);
      expect(within(carteDeVersion("1.3.3")).getByText("En production")).not.toBeNull();
    },
    RENDU_LENT,
  );

  it(
    "ne marque aucune autre version comme en production",
    () => {
      monte(<VersionsPage />);
      const enProduction = screen
        .getAllByRole("button", { name: /^Afficher ou masquer la version / })
        .filter((carte) => within(carte).queryByText("En production"));
      expect(enProduction).toHaveLength(1);
    },
    RENDU_LENT,
  );

  it.each(VERSIONS_ANTERIEURES)(
    "marque %s comme une version antérieure",
    (version) => {
      monte(<VersionsPage />);
      expect(within(carteDeVersion(version)).getByText("Antérieure")).not.toBeNull();
    },
    RENDU_LENT,
  );

  it(
    "annonce 1.3.3 comme la version publiée",
    () => {
      monte(<VersionsPage />);
      expect(screen.getAllByText("1.3.3").length).toBeGreaterThan(0);
      expect(screen.getByText(/1\.3\.3 publiée le/)).not.toBeNull();
    },
    RENDU_LENT,
  );
});
