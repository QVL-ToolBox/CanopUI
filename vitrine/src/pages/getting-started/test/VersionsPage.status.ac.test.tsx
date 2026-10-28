import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import { VersionsPage } from "../VersionsPage";

const RENDU_LENT = 20_000;
const VERSIONS_ANTERIEURES = [
  "2.0.0",
  "1.3.4",
  "1.3.3",
  "1.3.2",
  "1.3.1",
  "1.3.0",
  "1.2.0",
  "1.1.0",
  "1.0.0",
  "0.1.1",
  "0.1.0",
  "0.0.2",
  "0.0.1",
  "0.0.0",
];
const VERSIONS_RENUMEROTEES = ["1.0.0", "0.1.1", "0.1.0", "0.0.2", "0.0.1", "0.0.0"];

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

function precede(avant: Element, apres: Element) {
  return Boolean(avant.compareDocumentPosition(apres) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe("page Versions de la vitrine", () => {
  it(
    "marque 2.1.0 comme la version en production",
    () => {
      monte(<VersionsPage />);
      expect(within(carteDeVersion("2.1.0")).getByText("En production")).not.toBeNull();
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
    "annonce 2.1.0 comme la version publiée",
    () => {
      monte(<VersionsPage />);
      expect(screen.getAllByText("2.1.0").length).toBeGreaterThan(0);
      expect(screen.getByText(/2\.1\.0 publiée le/)).not.toBeNull();
    },
    RENDU_LENT,
  );

  it(
    "range les versions renumérotées 0.x sous la 1.0.0, de la plus récente à la plus ancienne",
    () => {
      monte(<VersionsPage />);
      const cartes = VERSIONS_RENUMEROTEES.map(carteDeVersion);
      cartes.slice(1).forEach((carte, index) => {
        expect(precede(cartes[index], carte)).toBe(true);
      });
    },
    RENDU_LENT,
  );

  it(
    "n'affiche plus aucune version 3.x de CanopUI",
    () => {
      monte(<VersionsPage />);
      expect(
        screen.queryAllByRole("button", { name: /^Afficher ou masquer la version 3\./ }),
      ).toHaveLength(0);
      expect(document.body.textContent ?? "").not.toMatch(/(?<![\d.v])3\.[01]\.\d+(?![\d.])/);
    },
    RENDU_LENT,
  );
});
