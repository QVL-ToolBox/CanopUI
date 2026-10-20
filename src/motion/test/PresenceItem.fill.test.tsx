import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../theme";
import {
  BentoGrid,
  BentoTile,
  Card,
  Presence,
  PresenceItem,
  type PresenceItemProps,
} from "../../index";
import { declarationsDe, valeurFixe } from "../../test/cssRules";
import { mockReducedMotion } from "./presenceTestKit";

function renderItem(props: Omit<PresenceItemProps, "children"> = {}): HTMLElement {
  render(
    <CanopThemeProvider>
      <Presence>
        <PresenceItem {...props}>
          <span>Contenu</span>
        </PresenceItem>
      </Presence>
    </CanopThemeProvider>,
  );
  return screen.getByText("Contenu").parentElement as HTMLElement;
}

function renderFilledCards() {
  const { container } = render(
    <CanopThemeProvider>
      <BentoGrid columns={{ xs: 2 }}>
        <BentoTile rowSpan={2}>
          <Card fill title="Haute">
            Longue
          </Card>
        </BentoTile>
        <BentoTile>
          <Card fill title="Basse">
            Courte
          </Card>
        </BentoTile>
      </BentoGrid>
    </CanopThemeProvider>,
  );
  const grid = container.firstElementChild as HTMLElement;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>(".MuiCard-root"));
  return { grid, cards };
}

function ancestorsBetween(descendant: HTMLElement, ancestor: HTMLElement): HTMLElement[] {
  const chain: HTMLElement[] = [];
  let current = descendant.parentElement;
  while (current && current !== ancestor) {
    chain.push(current);
    current = current.parentElement;
  }
  return chain;
}

function etireSurLaHauteur(element: HTMLElement): boolean {
  const flex = valeurFixe(element, "flex");
  const height = valeurFixe(element, "height");
  return flex.startsWith("1") || height === "100%";
}

beforeEach(() => {
  mockReducedMotion(false);
});

describe("PresenceItem - remplissage", () => {
  it("devient une colonne flexible qui occupe la place disponible avec fill", () => {
    const item = renderItem({ fill: true });
    expect(valeurFixe(item, "display")).toBe("flex");
    expect(valeurFixe(item, "flex-direction")).toBe("column");
    expect(valeurFixe(item, "flex-grow")).toBe("1");
    expect(valeurFixe(item, "min-height")).toBe("0px");
  });

  it("n'applique aucun style de remplissage sans fill", () => {
    const item = renderItem();
    expect(declarationsDe(item, "display")).toEqual([]);
    expect(declarationsDe(item, "flex-direction")).toEqual([]);
    expect(declarationsDe(item, "flex")).toEqual([]);
    expect(declarationsDe(item, "min-height")).toEqual([]);
  });

  it("n'applique aucun style de remplissage avec fill a false", () => {
    const item = renderItem({ fill: false });
    expect(declarationsDe(item, "flex")).toEqual([]);
    expect(declarationsDe(item, "min-height")).toEqual([]);
  });

  it("conserve role et aria-busy avec fill", () => {
    const item = renderItem({ fill: true, role: "status", ariaBusy: true });
    expect(item).toHaveAttribute("role", "status");
    expect(item).toHaveAttribute("aria-busy", "true");
  });

  it("reste visible avec fill en mouvement reduit", () => {
    mockReducedMotion(true);
    const item = renderItem({ fill: true });
    expect(item.style.opacity).not.toBe("0");
    expect(valeurFixe(item, "flex-grow")).toBe("1");
  });
});

describe("Card fill dans une grille bento", () => {
  it("etire chaque carte et chacun de ses conteneurs sur toute la hauteur de la cellule", () => {
    const { grid, cards } = renderFilledCards();
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(etireSurLaHauteur(card)).toBe(true);
      const conteneurs = ancestorsBetween(card, grid);
      const tile = conteneurs[conteneurs.length - 1];
      for (const conteneur of conteneurs.filter((element) => element !== tile)) {
        expect(etireSurLaHauteur(conteneur)).toBe(true);
      }
      expect(valeurFixe(tile, "display")).toBe("flex");
      expect(valeurFixe(tile, "flex-direction")).toBe("column");
    }
  });

  it("laisse les tuiles d'une meme rangee s'etirer a la meme hauteur", () => {
    const { grid } = renderFilledCards();
    const alignements = declarationsDe(grid, "align-items").map((entree) => entree.valeur);
    expect(alignements.every((valeur) => valeur === "stretch" || valeur === "normal")).toBe(true);
    for (const tile of Array.from(grid.children)) {
      const propres = declarationsDe(tile, "align-self").map((entree) => entree.valeur);
      expect(propres.every((valeur) => valeur === "stretch" || valeur === "auto")).toBe(true);
    }
  });
});
