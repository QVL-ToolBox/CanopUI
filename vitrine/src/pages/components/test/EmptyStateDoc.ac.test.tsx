import type { ReactNode } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
  Card,
  CanopI18nProvider,
  CanopThemeProvider,
  EmptyState,
  type CanopEmptyStateSize,
} from "@canop/ui";
import EmptyStateDoc from "../EmptyStateDoc";
import { allComponentEntries } from "../../../registry/nav";
import { componentPage } from "../../../registry/componentPages";

const RENDU_LENT = 20_000;

function monte(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function hauteurMinimaleDeLEtatVide(titre: HTMLElement): string {
  for (let element = titre.parentElement; element; element = element.parentElement) {
    const hauteur = getComputedStyle(element).minHeight;
    if (hauteur !== "" && hauteur !== "auto") return hauteur;
  }
  return "";
}

function flouDuVerreFrosted(): string {
  const { container, unmount } = monte(<Card variant="frosted">Référence</Card>);
  const flou = getComputedStyle(
    container.querySelector(".MuiCard-root") as HTMLElement,
  ).backdropFilter;
  unmount();
  return flou;
}

function hauteurDeLaTaille(size: CanopEmptyStateSize): string {
  const { unmount } = monte(<EmptyState title="Référence" size={size} />);
  const hauteur = hauteurMinimaleDeLEtatVide(screen.getByRole("heading", { name: "Référence" }));
  unmount();
  return hauteur;
}

function demo(titreDeDemo: string): HTMLElement {
  return screen.getByRole("heading", { name: titreDeDemo }).parentElement as HTMLElement;
}

function titresDEtatVide(zone: HTMLElement): HTMLElement[] {
  return within(zone)
    .getAllByRole("heading")
    .filter((titre) => hauteurMinimaleDeLEtatVide(titre) !== "" && titre.closest("pre") === null)
    .filter((titre) => titre !== zone.querySelector("h3"));
}

function estEnVerreFrosted(carte: Element | null, flou: string): boolean {
  return carte !== null && getComputedStyle(carte).backdropFilter === flou;
}

function porteUnNeon(zone: Element): boolean {
  return Array.from(zone.querySelectorAll("*")).some((element) =>
    getComputedStyle(element).filter.includes("--canop-glow"),
  );
}

describe("AC10 - doc vitrine de l'EmptyState", () => {
  let flouFrosted = "";
  let hauteurLg = "";
  let hauteurMd = "";

  beforeAll(() => {
    flouFrosted = flouDuVerreFrosted();
    hauteurLg = hauteurDeLaTaille("lg");
    hauteurMd = hauteurDeLaTaille("md");
  });

  it("publie la page sous /components/empty-state", () => {
    expect(allComponentEntries.map((entree) => entree.path)).toContain("/components/empty-state");
    expect(componentPage("empty-state")).toBeDefined();
  });

  it(
    "montre l'usage par défaut dans une Card frosted",
    () => {
      monte(<EmptyStateDoc />);
      const [titre] = titresDEtatVide(demo("Icône, description et action"));
      expect(flouFrosted).not.toBe("");
      expect(estEnVerreFrosted(titre.closest(".MuiCard-root"), flouFrosted)).toBe(true);
    },
    RENDU_LENT,
  );

  it(
    "montre l'état vide en plain directement dans une Card",
    () => {
      monte(<EmptyStateDoc />);
      const zone = demo("Dans une carte");
      const [titre] = titresDEtatVide(zone);
      const carte = titre.closest(".MuiCard-root");
      expect(carte).not.toBeNull();
      expect(estEnVerreFrosted(carte, flouFrosted)).toBe(false);
      expect(carte?.querySelectorAll(".MuiCard-root")).toHaveLength(0);
    },
    RENDU_LENT,
  );

  it(
    "montre l'état vide en plain dans un DataTable vide",
    () => {
      monte(<EmptyStateDoc />);
      const zone = demo("Dans un DataTable vide");
      const [titre] = titresDEtatVide(zone);
      const tableau = titre.closest("table");
      expect(tableau).not.toBeNull();
      expect(tableau?.querySelector(".MuiCard-root")).toBeNull();
    },
    RENDU_LENT,
  );

  it(
    "montre la pleine page en taille lg",
    () => {
      monte(<EmptyStateDoc />);
      const [titre] = titresDEtatVide(demo("En pleine page"));
      expect(hauteurLg).not.toBe(hauteurMd);
      expect(hauteurMinimaleDeLEtatVide(titre)).toBe(hauteurLg);
    },
    RENDU_LENT,
  );

  it(
    "montre le même état vide en clair et en sombre côte à côte",
    () => {
      monte(<EmptyStateDoc />);
      const zone = demo("Le même état vide, thème clair puis sombre");
      const titres = titresDEtatVide(zone);
      expect(titres).toHaveLength(2);
      expect(titres[0].textContent).toBe(titres[1].textContent);
      const surfaces = titres.map((titre) => titre.closest(".MuiCard-root") as HTMLElement);
      expect(surfaces.map(porteUnNeon)).toEqual([false, true]);
    },
    RENDU_LENT,
  );
});
