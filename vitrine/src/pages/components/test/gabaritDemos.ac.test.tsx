import type { ComponentType } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import NavbarDoc from "../NavbarDoc";
import PageScaffoldDoc from "../PageScaffoldDoc";
import LayoutDoc from "../LayoutDoc";
import PageContentDoc from "../PageContentDoc";
import SettingsMenuDoc from "../SettingsMenuDoc";
import CommandPaletteDoc from "../CommandPaletteDoc";
import { DemoScreen } from "../../../kit/DemoScreen";
import {
  establishesContainingBlock,
  renderInVitrine,
  stubScrollIntoView,
} from "../../../test/vitrineTestKit";

const RENDU_LENT = 15_000;

const GABARITS: [string, ComponentType, string][] = [
  ["Navbar", NavbarDoc, "navbar"],
  ["PageScaffold", PageScaffoldDoc, "page-scaffold"],
  ["Layout", LayoutDoc, "layout"],
  ["PageContent", PageContentDoc, "page-content"],
  ["SettingsMenu", SettingsMenuDoc, "settings-menu"],
];

interface DemoCardParts {
  title: string;
  stage: Element;
}

function demoCards(): DemoCardParts[] {
  return screen.getAllByRole("button", { name: "Afficher le code" }).map((toggle) => {
    const toolbar = toggle.parentElement as HTMLElement;
    let card = toolbar.parentElement;
    while (card && !card.querySelector(":scope > h3")) card = card.parentElement;
    return {
      title: card?.querySelector(":scope > h3")?.textContent ?? "",
      stage: toolbar.previousElementSibling as Element,
    };
  });
}

function wrapsWholeDemo(stage: Element, candidate: Element): boolean {
  return Array.from(stage.querySelectorAll("*")).every(
    (node) => node === candidate || candidate.contains(node) || node.contains(candidate),
  );
}

function isContainedScreen(stage: Element): boolean {
  return [stage, ...Array.from(stage.querySelectorAll("*"))].some(
    (candidate) => establishesContainingBlock(candidate) && wrapsWholeDemo(stage, candidate),
  );
}

beforeEach(() => {
  stubScrollIntoView();
});

describe("AC7 DemoScreen fournit un containing block", () => {
  it("retient un élément fixe dans un ancêtre transformé ou contenu", () => {
    renderInVitrine(
      <DemoScreen>
        <span style={{ position: "fixed" }}>barre fixe</span>
      </DemoScreen>,
    );
    const fixed = screen.getByText("barre fixe");
    const holders = [];
    for (let node = fixed.parentElement; node; node = node.parentElement) {
      if (establishesContainingBlock(node)) holders.push(node);
    }
    expect(holders.length).toBeGreaterThan(0);
  });
});

describe.each(GABARITS)("AC7 démos %s contenues", (_name, Doc, slug) => {
  it(
    "rend chaque démo dans un écran qui retient ses éléments fixes",
    () => {
      window.location.hash = `#/components/${slug}`;
      renderInVitrine(<Doc />);
      const cards = demoCards();
      expect(cards.length).toBeGreaterThan(0);
      const uncontained = cards
        .filter((card) => !isContainedScreen(card.stage))
        .map((card) => card.title);
      expect(uncontained).toEqual([]);
    },
    RENDU_LENT,
  );
});

describe("AC7 les démos CommandPalette laissent Ctrl+K à la vitrine", () => {
  it.each([
    ["Ctrl+K", { ctrlKey: true }],
    ["⌘K", { metaKey: true }],
  ])(
    "n'ouvre aucune palette et ne capture pas %s",
    (_label, modifiers) => {
      window.location.hash = "#/components/command-palette";
      renderInVitrine(<CommandPaletteDoc />);
      const notPrevented = fireEvent.keyDown(document, { key: "k", ...modifiers });
      expect(notPrevented).toBe(true);
      expect(screen.queryByRole("dialog")).toBeNull();
    },
    RENDU_LENT,
  );

  it(
    "ouvre toujours la palette de démo par son bouton",
    () => {
      window.location.hash = "#/components/command-palette";
      renderInVitrine(<CommandPaletteDoc />);
      fireEvent.click(screen.getByRole("button", { name: "Ouvrir la palette" }));
      expect(within(screen.getByRole("dialog")).getByRole("combobox")).toBeInTheDocument();
    },
    RENDU_LENT,
  );
});
