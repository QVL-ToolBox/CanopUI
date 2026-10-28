import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { HomePage } from "../HomePage";
import { resolvePage } from "../../../router/resolvePage";
import { NotFoundPage } from "../../NotFoundPage";
import {
  countGridTracks,
  cssValueAtWidth,
  installClipboardSpy,
  mdBreakpointRem,
  removeClipboardSpy,
  renderInVitrine,
  stubScrollIntoView,
} from "../../../test/vitrineTestKit";

const RENDU_LENT = 15_000;
const INSTALL_COMMAND = "npm i @canop/ui";

function renderHome() {
  window.location.hash = "";
  return renderInVitrine(<HomePage />);
}

function hero(): HTMLElement {
  return screen.getByRole("heading", { level: 1 }).closest("section") as HTMLElement;
}

function heroColumnsAt(widthRem: number): number {
  const template = cssValueAtWidth(hero(), "grid-template-columns", widthRem);
  return template === "" ? 1 : countGridTracks(template);
}

function routeIsKnown(hash: string): boolean {
  const segments = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const { element } = resolvePage(segments);
  return !(
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    element.type === NotFoundPage
  );
}

beforeEach(() => {
  stubScrollIntoView();
});

afterEach(() => {
  removeClipboardSpy();
  window.location.hash = "";
});

describe("AC11 hero responsive", () => {
  it(
    "s'affiche sur une colonne sous md",
    () => {
      renderHome();
      expect(heroColumnsAt(20)).toBe(1);
      expect(heroColumnsAt(mdBreakpointRem() - 0.5)).toBe(1);
    },
    RENDU_LENT,
  );

  it(
    "s'affiche sur deux colonnes à partir de md",
    () => {
      renderHome();
      expect(heroColumnsAt(mdBreakpointRem())).toBe(2);
      expect(heroColumnsAt(mdBreakpointRem() + 40)).toBe(2);
    },
    RENDU_LENT,
  );
});

describe("AC11 contenu du hero", () => {
  it(
    "porte un h1 unique",
    () => {
      renderHome();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    },
    RENDU_LENT,
  );

  it.each(["Commencer", "Parcourir les composants"])(
    "propose le bouton « %s » dans le hero",
    (label) => {
      renderHome();
      expect(within(hero()).getByRole("button", { name: label })).toBeInTheDocument();
    },
    RENDU_LENT,
  );

  it(
    "affiche la commande npm i @canop/ui",
    () => {
      renderHome();
      expect(within(hero()).getByText(INSTALL_COMMAND)).toBeInTheDocument();
    },
    RENDU_LENT,
  );

  it(
    "copie la commande npm i @canop/ui",
    async () => {
      const copies = installClipboardSpy();
      renderHome();
      await act(async () => {
        fireEvent.click(within(hero()).getByRole("button", { name: "Copier" }));
      });
      expect(copies).toEqual([INSTALL_COMMAND]);
    },
    RENDU_LENT,
  );

  it(
    "intègre la carte d'inscription bêta dans le hero",
    () => {
      renderHome();
      expect(within(hero()).getByText("Rejoindre la bêta")).toBeInTheDocument();
      expect(within(hero()).getByRole("button", { name: "S'inscrire" })).toBeInTheDocument();
    },
    RENDU_LENT,
  );
});

describe("AC11 plus de halo rectangulaire", () => {
  it(
    "ne pose aucun dégradé radial derrière le hero",
    () => {
      const { container } = renderHome();
      const backdrops = [];
      for (
        let node: HTMLElement | null = hero();
        node && node !== container.parentElement;
        node = node.parentElement
      ) {
        const style = getComputedStyle(node);
        if (/radial-gradient/.test(`${style.backgroundImage} ${style.background}`))
          backdrops.push(node);
      }
      expect(backdrops).toEqual([]);
    },
    RENDU_LENT,
  );
});

describe("AC11 grille des points forts", () => {
  function featureGrid(): HTMLElement {
    return screen
      .getByRole("heading", { level: 2, name: /soin du détail/i })
      .closest("section") as HTMLElement;
  }

  it(
    "fait mener chaque point fort à une page de doc existante par un vrai lien",
    () => {
      renderHome();
      const destinations = within(featureGrid())
        .getAllByRole("link")
        .map((tile) => tile.getAttribute("href") ?? "");
      expect(destinations.length).toBeGreaterThan(0);
      expect(destinations.filter((hash) => !hash.startsWith("#/") || !routeIsKnown(hash))).toEqual(
        [],
      );
      expect(destinations.every((hash) => hash !== "#/")).toBe(true);
    },
    RENDU_LENT,
  );

  it(
    "ne rend plus les points forts comme des boutons",
    () => {
      renderHome();
      expect(within(featureGrid()).queryAllByRole("button")).toEqual([]);
    },
    RENDU_LENT,
  );
});
