import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import {
  BentoGrid,
  BentoTile,
  type CanopBentoColumns,
  type CanopBentoGridProps,
  type CanopBentoSpan,
  type CanopBentoTileProps,
  type CanopCardGridColumns,
} from "../../../index";
import { declarationsDe, valeurAuPalier, valeurFixe } from "../../../test/cssRules";

const PALIERS = { xs: 0, sm: 37.5, md: 64, lg: 90 } as const;

type Palier = keyof typeof PALIERS;

function renderBento(
  grid: Omit<CanopBentoGridProps, "children">,
  tile: Omit<CanopBentoTileProps, "children">,
) {
  const { container } = render(
    <CanopThemeProvider>
      <BentoGrid {...grid}>
        <BentoTile {...tile}>
          <span>Tuile</span>
        </BentoTile>
        <BentoTile>
          <span>Voisine</span>
        </BentoTile>
      </BentoGrid>
    </CanopThemeProvider>,
  );
  const gridElement = container.firstElementChild as HTMLElement;
  const [tileElement, neighbourElement] = Array.from(gridElement.children) as HTMLElement[];
  return { grid: gridElement, tile: tileElement, neighbour: neighbourElement };
}

function parPalier(element: Element, propriete: string): Record<Palier, string> {
  return {
    xs: valeurAuPalier(element, propriete, PALIERS.xs),
    sm: valeurAuPalier(element, propriete, PALIERS.sm),
    md: valeurAuPalier(element, propriete, PALIERS.md),
    lg: valeurAuPalier(element, propriete, PALIERS.lg),
  };
}

function spans(xs: number, sm: number, md: number, lg: number): Record<Palier, string> {
  return { xs: `span ${xs}`, sm: `span ${sm}`, md: `span ${md}`, lg: `span ${lg}` };
}

function colonnes(xs: number, sm: number, md: number, lg: number): Record<Palier, string> {
  const repeat = (count: number) => `repeat(${count}, minmax(0, 1fr))`;
  return { xs: repeat(xs), sm: repeat(sm), md: repeat(md), lg: repeat(lg) };
}

describe("BentoTile - etendue horizontale", () => {
  it("etend la tuile sur 2 colonnes des que la grille en compte 3 et reste a 1 avant", () => {
    const columns: CanopCardGridColumns = { md: 3 };
    const { grid, tile } = renderBento({ columns }, { span: 2 });
    expect(parPalier(grid, "grid-template-columns")).toEqual(colonnes(1, 1, 3, 3));
    expect(parPalier(tile, "grid-column")).toEqual(spans(1, 1, 2, 2));
  });

  it("ramene une etendue superieure au nombre de colonnes a ce nombre", () => {
    const { grid, tile } = renderBento({ columns: { xs: 2 } }, { span: 4 });
    expect(parPalier(grid, "grid-template-columns")).toEqual(colonnes(2, 2, 2, 2));
    expect(parPalier(tile, "grid-column")).toEqual(spans(2, 2, 2, 2));
  });

  it("ramene une etendue fixe de 4 a 2 sur une grille de 2 colonnes des sm", () => {
    const { tile } = renderBento({ columns: 2 }, { span: 4 });
    expect(parPalier(tile, "grid-column")).toEqual(spans(1, 2, 2, 2));
  });

  it("fait heriter chaque palier omis de la valeur du palier inferieur", () => {
    const span: CanopBentoSpan = { sm: 2, lg: 4 };
    const { tile } = renderBento({ columns: { xs: 4 } }, { span });
    expect(parPalier(tile, "grid-column")).toEqual(spans(1, 2, 2, 4));
  });

  it("laisse les tuiles voisines sur une seule colonne", () => {
    const { neighbour } = renderBento({ columns: { md: 3 } }, { span: 2, rowSpan: 2 });
    expect(parPalier(neighbour, "grid-column")).toEqual(spans(1, 1, 1, 1));
    expect(parPalier(neighbour, "grid-row")).toEqual(spans(1, 1, 1, 1));
  });
});

describe("BentoTile - etendue verticale", () => {
  it("garde une seule rangee tant que la grille n'a qu'une colonne", () => {
    const { grid, tile } = renderBento({ columns: { xs: 1, lg: 3 } }, { rowSpan: { md: 2 } });
    expect(parPalier(grid, "grid-template-columns")).toEqual(colonnes(1, 1, 1, 3));
    expect(parPalier(tile, "grid-row")).toEqual(spans(1, 1, 1, 2));
  });

  it("etend la tuile sur 2 rangees des que la grille a plusieurs colonnes", () => {
    const { tile } = renderBento({ columns: { md: 3 } }, { rowSpan: { md: 2 } });
    expect(parPalier(tile, "grid-row")).toEqual(spans(1, 1, 2, 2));
  });
});

describe("BentoTile - valeurs invalides", () => {
  it.each([
    ["nulle", 0],
    ["negative", -2],
    ["decimale", 2.5],
    ["decimale inferieure a un", 0.4],
  ])("produit une etendue entiere et positive pour une valeur %s", (_, valeur) => {
    const { tile } = renderBento({ columns: { xs: 3 } }, { span: valeur, rowSpan: valeur });
    for (const propriete of ["grid-column", "grid-row"]) {
      for (const declaration of Object.values(parPalier(tile, propriete))) {
        expect(declaration).toMatch(/^span [1-9]\d*$/);
      }
    }
  });

  it("traite une etendue par palier invalide comme une etendue entiere positive", () => {
    const { tile } = renderBento({ columns: { xs: 3 } }, { span: { xs: 0, md: 1.5 } });
    for (const declaration of Object.values(parPalier(tile, "grid-column"))) {
      expect(declaration).toMatch(/^span [1-9]\d*$/);
    }
  });
});

describe("BentoGrid - colonnes", () => {
  it("affiche une seule colonne en xs puis 3 des sm avec columns fixe", () => {
    const { grid } = renderBento({ columns: 3 }, {});
    expect(parPalier(grid, "grid-template-columns")).toEqual(colonnes(1, 3, 3, 3));
  });

  it("respecte un nombre de colonnes impose des xs", () => {
    const columns: CanopBentoColumns = { xs: 2 };
    const { grid } = renderBento({ columns }, {});
    expect(valeurAuPalier(grid, "grid-template-columns", PALIERS.xs)).toBe(
      "repeat(2, minmax(0, 1fr))",
    );
  });

  it("affiche une seule colonne en mobile sans configuration", () => {
    const { grid, tile } = renderBento({}, { span: 3 });
    expect(valeurAuPalier(grid, "grid-template-columns", PALIERS.xs)).toBe(
      "repeat(1, minmax(0, 1fr))",
    );
    expect(valeurAuPalier(tile, "grid-column", PALIERS.xs)).toBe("span 1");
  });

  it("dispose ses tuiles en grille", () => {
    const { grid } = renderBento({}, {});
    expect(valeurFixe(grid, "display")).toBe("grid");
  });
});

describe("BentoGrid - hauteur des rangees", () => {
  it("impose une hauteur minimale extensible aux rangees", () => {
    const { grid } = renderBento({ rowHeight: "10rem" }, {});
    expect(valeurFixe(grid, "grid-auto-rows")).toBe("minmax(10rem, auto)");
  });

  it("n'impose aucune hauteur de rangee sans rowHeight", () => {
    const { grid } = renderBento({}, {});
    expect(declarationsDe(grid, "grid-auto-rows").map((entree) => entree.valeur)).not.toContain(
      "minmax(10rem, auto)",
    );
  });
});

describe("BentoTile - hors grille", () => {
  function renderIsolee(tile: Omit<CanopBentoTileProps, "children">): HTMLElement {
    const { container } = render(
      <CanopThemeProvider>
        <BentoTile {...tile}>
          <span>Isolee</span>
        </BentoTile>
      </CanopThemeProvider>,
    );
    return container.firstElementChild as HTMLElement;
  }

  it("occupe une colonne et une rangee a tous les paliers sans etendue", () => {
    const tile = renderIsolee({});
    expect(parPalier(tile, "grid-column")).toEqual(spans(1, 1, 1, 1));
    expect(parPalier(tile, "grid-row")).toEqual(spans(1, 1, 1, 1));
  });

  it("se comporte comme dans une grille sans configuration", () => {
    const isolee = renderIsolee({ span: 3, rowSpan: 2 });
    const { tile: dansGrille } = renderBento({}, { span: 3, rowSpan: 2 });
    expect(parPalier(isolee, "grid-column")).toEqual(parPalier(dansGrille, "grid-column"));
    expect(parPalier(isolee, "grid-row")).toEqual(parPalier(dansGrille, "grid-row"));
  });
});
