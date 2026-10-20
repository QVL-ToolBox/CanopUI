import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CardGrid } from "../CardGrid";

function renderGrid(ui: React.ReactElement): HTMLElement {
  const { container } = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  return container.firstElementChild as HTMLElement;
}

function injectedStyles(): string {
  return Array.from(document.querySelectorAll("style"))
    .map((node) => node.textContent ?? "")
    .join("");
}

describe("CardGrid", () => {
  it("dispose ses enfants dans une grille", () => {
    const grid = renderGrid(
      <CardGrid>
        <span>Atlas</span>
        <span>Nimbus</span>
      </CardGrid>,
    );
    expect(grid).toHaveStyle({ display: "grid" });
    expect(screen.getByText("Atlas")).toBeInTheDocument();
    expect(screen.getByText("Nimbus")).toBeInTheDocument();
  });

  it("laisse un ecart moyen entre les elements par defaut", () => {
    const grid = renderGrid(
      <CardGrid>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(grid).toHaveStyle({ gap: "1rem" });
  });

  it("applique l'ecart demande sur l'echelle d'espacement", () => {
    const grid = renderGrid(
      <CardGrid gap="xl">
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(grid).toHaveStyle({ gap: "2rem" });
  });

  it("reserve seize rem par colonne par defaut", () => {
    renderGrid(
      <CardGrid>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(injectedStyles()).toContain("min(16rem, 100%)");
  });

  it("resserre les colonnes quand la largeur minimale est reduite", () => {
    renderGrid(
      <CardGrid minItemWidth="12rem">
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(injectedStyles()).toContain("min(12rem, 100%)");
  });

  it("accepte un enfant unique", () => {
    const grid = renderGrid(
      <CardGrid>
        <span>Atlas</span>
      </CardGrid>,
    );
    expect(grid.childElementCount).toBe(1);
  });
});
