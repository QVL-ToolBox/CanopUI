import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { App } from "../App";
import { DocShell } from "../shell/DocShell";
import { groupEntries, navGroups } from "../registry/nav";
import { renderInVitrine, stubScrollIntoView } from "./vitrineTestKit";

const RENDU_LENT = 15_000;
const VITRINE = "vitrine/src";

const RUBRIQUES_MULTI_CATEGORIES = navGroups.filter((group) => group.categories.length > 1);

function sourcesDeLaVitrine(dossier = VITRINE): string[] {
  return readdirSync(dossier).flatMap((entree) => {
    const chemin = join(dossier, entree);
    if (statSync(chemin).isDirectory()) return sourcesDeLaVitrine(chemin);
    return /\.tsx?$/.test(entree) && !/\.test\.tsx?$/.test(entree) ? [chemin] : [];
  });
}

function source(chemin: string): string {
  return readFileSync(join(VITRINE, chemin), "utf8");
}

function importeDeLaLib(contenu: string, symbole: string): boolean {
  return new RegExp(`import\\s*\\{[^}]*\\b${symbole}\\b[^}]*\\}\\s*from\\s*"@canop/ui"`).test(
    contenu,
  );
}

function rendreRoute(chemin: string) {
  window.location.hash = `#${chemin}`;
  return renderInVitrine(<App />);
}

function navigationPrincipale(): HTMLElement {
  return screen.getByRole("navigation", { name: "Navigation principale" });
}

beforeEach(() => {
  stubScrollIntoView();
  window.location.hash = "";
});

afterEach(() => {
  window.location.hash = "";
});

describe("AC7 vitrine en accent", () => {
  it("passe le fond de DocShell en accent", () => {
    expect(source("shell/DocShell.tsx")).toMatch(/backgroundTone=["{]+accent/);
  });
});

describe("AC8 recherche de la vitrine sur la liste de palette", () => {
  const recherche = () =>
    readdirSync(join(VITRINE, "shell/search"))
      .filter((fichier) => fichier.endsWith(".tsx"))
      .map((fichier) => source(`shell/search/${fichier}`))
      .join("\n");

  it.each(["CommandList", "CommandGroup", "CommandOption", "CommandEmpty"])(
    "utilise %s de @canop/ui",
    (composant) => {
      expect(importeDeLaLib(recherche(), composant)).toBe(true);
    },
  );
});

describe("AC9 réserves de page", () => {
  it("ne lit plus les variables --canop-page-*-inset en dur", () => {
    const fautifs = sourcesDeLaVitrine().filter((chemin) =>
      /--canop-page-[\w-]*inset/.test(readFileSync(chemin, "utf8")),
    );
    expect(fautifs).toEqual([]);
  });
});

describe("AC12 CardDoc sur la recette de verre partagée", () => {
  it("utilise FROSTED_CARD_LIQUID_GLASS", () => {
    expect(
      importeDeLaLib(source("pages/components/CardDoc.tsx"), "FROSTED_CARD_LIQUID_GLASS"),
    ).toBe(true);
  });
});

describe("AC16 navigation par catégories", () => {
  it("compte au moins une rubrique à plusieurs catégories", () => {
    expect(RUBRIQUES_MULTI_CATEGORIES.length).toBeGreaterThan(0);
  });

  it.each(RUBRIQUES_MULTI_CATEGORIES.map((group) => [group.title.fr, group] as const))(
    "range les pages de %s sous des intertitres de catégorie",
    (_, group) => {
      renderInVitrine(
        <DocShell activePath={groupEntries(group)[0].path} contentWidth="lg">
          <p>Contenu</p>
        </DocShell>,
      );
      const groupes = within(navigationPrincipale())
        .queryAllByRole("group")
        .filter((groupe) => groupe.hasAttribute("aria-labelledby"));
      const intertitres = groupes.map(
        (groupe) =>
          document.getElementById(groupe.getAttribute("aria-labelledby") ?? "")?.textContent,
      );
      expect(intertitres).toEqual(group.categories.map((categorie) => categorie.title.fr));
      group.categories.forEach((categorie, rang) => {
        const liens = within(groupes[rang])
          .getAllByRole("link")
          .map((lien) => lien.getAttribute("href"));
        expect(liens).toEqual(categorie.entries.map((entry) => `#${entry.path}`));
      });
    },
    RENDU_LENT,
  );

  it.each(navGroups.map((group) => [group.id] as const))(
    "rend les cartes du sommaire %s comme de vrais liens",
    async (id) => {
      rendreRoute(`/categories/${id}`);
      const article = await screen.findByRole("article", {}, { timeout: 4000 });
      const group = navGroups.find((candidat) => candidat.id === id);
      const attendus = groupEntries(group!).map((entry) => `#${entry.path}`);
      const hrefs = within(article)
        .getAllByRole("link")
        .map((lien) => lien.getAttribute("href"));
      expect(hrefs).toEqual(expect.arrayContaining(attendus));
      const titres = groupEntries(group!).map((entry) => entry.title.fr);
      expect(
        within(article)
          .queryAllByRole("button")
          .filter((bouton) => titres.some((titre) => bouton.textContent?.includes(titre))),
      ).toEqual([]);
    },
    RENDU_LENT,
  );

  it("n'a plus de ScrollFrame", () => {
    expect(existsSync(join(VITRINE, "kit/ScrollFrame.tsx"))).toBe(false);
    expect(
      sourcesDeLaVitrine().filter((chemin) => /\bScrollFrame\b/.test(readFileSync(chemin, "utf8"))),
    ).toEqual([]);
  });
});
