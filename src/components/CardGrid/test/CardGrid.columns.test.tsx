import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CardGrid } from "../CardGrid";
import { declarationsDe, valeurAuPalier, valeurFixe } from "../../../test/cssRules";

const COLONNES = "grid-template-columns";

function renderGrid(ui: React.ReactElement): HTMLElement {
  const { container } = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  return container.firstElementChild as HTMLElement;
}

describe("CardGrid — colonnes imposées", () => {
  it("reste en auto-fit sans la prop", () => {
    const grid = renderGrid(
      <CardGrid>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(valeurFixe(grid, COLONNES)).toContain("auto-fit");
    expect(declarationsDe(grid, COLONNES)).toHaveLength(1);
  });

  it("impose un nombre fixe de colonnes à tous les paliers", () => {
    const grid = renderGrid(
      <CardGrid columns={3}>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(declarationsDe(grid, COLONNES)).toEqual([
      { condition: "", valeur: "repeat(3, minmax(0, 1fr))" },
    ]);
  });

  it("change de nombre de colonnes au palier demandé", () => {
    const grid = renderGrid(
      <CardGrid columns={{ sm: 2, lg: 4 }}>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(valeurAuPalier(grid, COLONNES, 37.5)).toBe("repeat(2, minmax(0, 1fr))");
    expect(valeurAuPalier(grid, COLONNES, 90)).toBe("repeat(4, minmax(0, 1fr))");
  });

  it("retombe sur la grille automatique en xs quand le palier est omis", () => {
    const grid = renderGrid(
      <CardGrid columns={{ md: 4 }}>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(valeurAuPalier(grid, COLONNES, 0)).toContain("auto-fit");
    expect(valeurAuPalier(grid, COLONNES, 64)).toBe("repeat(4, minmax(0, 1fr))");
  });

  it("garde la largeur minimale demandée dans le repli automatique", () => {
    const grid = renderGrid(
      <CardGrid columns={{ md: 4 }} minItemWidth="12rem">
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(valeurAuPalier(grid, COLONNES, 0)).toContain("min(12rem, 100%)");
  });
});
