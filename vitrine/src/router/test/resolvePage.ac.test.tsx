import { existsSync } from "node:fs";
import { isValidElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { resolvePage } from "../resolvePage";
import { componentPage } from "../../registry/componentPages";
import { groupEntries, navGroups } from "../../registry/nav";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { renderInVitrine, stubScrollIntoView } from "../../test/vitrineTestKit";

const REGISTRY_PATHS = navGroups.flatMap((group) => groupEntries(group).map((entry) => entry.path));
const LAB_SLUGS = ["liquid-glass-lab", "neon-glow-lab", "canopy-quality-lab"];

function segmentsOf(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function resolvesToNotFound(path: string): boolean {
  const { element } = resolvePage(segmentsOf(path));
  return isValidElement(element) && element.type === NotFoundPage;
}

function renderRoute(path: string) {
  window.location.hash = `#${path}`;
  return renderInVitrine(resolvePage(segmentsOf(path)).element);
}

beforeEach(() => {
  stubScrollIntoView();
  window.location.hash = "";
});

describe("AC2 chaque page du registre a une route", () => {
  it.each(REGISTRY_PATHS)("résout %s vers une vraie page", (path) => {
    expect(resolvesToNotFound(path)).toBe(false);
  });

  it("sert une page pour chaque composant du registre", () => {
    const missing = REGISTRY_PATHS.filter((path) => path.startsWith("/components/")).filter(
      (path) => componentPage(segmentsOf(path)[1]) === undefined,
    );
    expect(missing).toEqual([]);
  });
});

describe("AC2 page de sommaire par rubrique", () => {
  it.each(navGroups.map((group) => [group.id, group] as const))(
    "affiche le sommaire de la rubrique %s avec toutes ses pages",
    (id, group) => {
      renderRoute(`/categories/${id}`);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(group.title.fr);
      const article = screen.getByRole("article");
      const missing = groupEntries(group)
        .map((entry) => entry.title.fr)
        .filter((title) => within(article).queryAllByText(title, { exact: true }).length === 0);
      expect(missing).toEqual([]);
    },
  );

  it("mène à la 404 pour une rubrique inconnue", () => {
    expect(resolvesToNotFound("/categories/inconnue")).toBe(true);
  });
});

describe("AC2 route inconnue", () => {
  it.each(["/inconnu", "/docs/inconnu", "/components/inconnu", "/categories"])(
    "mène %s à la 404",
    (path) => {
      expect(resolvesToNotFound(path)).toBe(true);
    },
  );

  it("affiche la page introuvable avec un titre h1", () => {
    renderRoute("/inconnu");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page introuvable");
  });

  it("garde l'accueil sur la route racine", () => {
    expect(resolvesToNotFound("/")).toBe(false);
  });
});

describe("AC6 labos supprimés", () => {
  it.each(LAB_SLUGS)("n'a plus d'entrée de navigation pour %s", (slug) => {
    expect(REGISTRY_PATHS.some((path) => path.includes(slug))).toBe(false);
  });

  it.each(LAB_SLUGS)("ne sert plus de page pour %s", (slug) => {
    expect(componentPage(slug)).toBeUndefined();
    expect(resolvesToNotFound(`/components/${slug}`)).toBe(true);
  });

  it("n'a plus aucune entrée de navigation nommée labo ou banc d'essai", () => {
    const titles = navGroups.flatMap((group) =>
      groupEntries(group).flatMap((entry) => [entry.title.fr, entry.title.en]),
    );
    expect(titles.filter((title) => /\blab\b|labo|banc d'essai|test bench/i.test(title))).toEqual(
      [],
    );
  });

  it("n'a plus de UnderConstructionPage", () => {
    expect(existsSync("vitrine/src/pages/UnderConstructionPage.tsx")).toBe(false);
  });
});
