import { existsSync, readFileSync } from "node:fs";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { DocShell } from "../DocShell";
import { groupEntries, navGroups } from "../../registry/nav";
import { renderInVitrine, stubScrollIntoView } from "../../test/vitrineTestKit";

const RUBRIQUES = ["Prise en main", "Saisie", "Affichage", "Navigation", "Modules"];

function renderShell(activePath = "/docs/installation") {
  return renderInVitrine(
    <DocShell activePath={activePath} contentWidth="lg">
      <p>Contenu de la page</p>
    </DocShell>,
  );
}

function mainNavigation() {
  return screen.getByRole("navigation", { name: "Navigation principale" });
}

function topLevelLabels() {
  return within(mainNavigation())
    .getAllByRole("link")
    .filter((link) => link.hasAttribute("aria-expanded"))
    .map((link) => link.getAttribute("aria-label"));
}

beforeEach(() => {
  stubScrollIntoView();
  window.location.hash = "";
});

describe("AC1 coque sur le gabarit de la lib", () => {
  it("bâtit DocShell sur PageScaffold et PageContent de @canop/ui", () => {
    const source = readFileSync("vitrine/src/shell/DocShell.tsx", "utf8");
    expect(source).toMatch(/import\s*\{[^}]*\bPageScaffold\b[^}]*\}\s*from\s*"@canop\/ui"/);
    expect(source).toMatch(/import\s*\{[^}]*\bPageContent\b[^}]*\}\s*from\s*"@canop\/ui"/);
    expect(source).toMatch(/<PageScaffold\b/);
    expect(source).toMatch(/<PageContent\b/);
  });

  it("n'a plus l'ancienne coque vitrine/src/layout", () => {
    expect(existsSync("vitrine/src/layout")).toBe(false);
  });

  it("rend la page dans la zone principale, sous la Navbar", () => {
    renderShell();
    expect(mainNavigation()).toBeInTheDocument();
    expect(within(screen.getByRole("main")).getByText("Contenu de la page")).toBeInTheDocument();
  });
});

describe("AC2 navigation unique par la Navbar", () => {
  it("n'expose qu'un seul repère de navigation dans la coque", () => {
    renderShell();
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("organise la Navbar en cinq rubriques dans l'ordre attendu", () => {
    renderShell();
    expect(topLevelLabels()).toEqual(RUBRIQUES);
  });

  it("fait pointer chaque rubrique vers sa page de sommaire /categories/:id", () => {
    renderShell();
    const hrefs = RUBRIQUES.map((label) =>
      within(mainNavigation()).getByRole("link", { name: label }).getAttribute("href"),
    );
    expect(hrefs).toEqual(navGroups.map((group) => `#/categories/${group.id}`));
  });

  it.each(navGroups.map((group) => [group.title.fr, group] as const))(
    "rend accessibles toutes les pages de la rubrique %s depuis la Navbar",
    (_title, group) => {
      const entries = groupEntries(group);
      renderShell(entries[0].path);
      const hrefs = within(mainNavigation())
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));
      expect(
        entries.map((entry) => `#${entry.path}`).filter((href) => !hrefs.includes(href)),
      ).toEqual([]);
    },
  );

  it("marque la page courante dans la Navbar", () => {
    renderShell("/components/card");
    expect(within(mainNavigation()).getByRole("link", { name: "Card" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

describe("AC3 la coque n'a plus de CommandPalette", () => {
  it("donne le focus au champ de recherche au Ctrl+K sans ouvrir de palette", () => {
    renderShell();
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("combobox", { name: "Rechercher dans la documentation" }),
    );
  });

  it("place le champ de recherche dans un repère search", () => {
    renderShell();
    expect(
      within(screen.getByRole("search")).getByRole("combobox", {
        name: "Rechercher dans la documentation",
      }),
    ).toBeInTheDocument();
  });

  it("affiche en permanence le champ de recherche dans la coque", () => {
    renderShell("/components/card");
    const field = screen.getByRole("combobox", { name: "Rechercher dans la documentation" });
    const hiddenAncestors = [];
    for (let node: Element | null = field; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") hiddenAncestors.push(node);
    }
    expect(hiddenAncestors).toEqual([]);
    expect(field).toBeEnabled();
  });
});
