import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import {
  BentoGrid,
  BentoTile,
  type CanopBentoGridProps,
  type CanopBentoTileProps,
} from "../../../index";

function renderBento(
  grid: Omit<CanopBentoGridProps, "children"> = {},
  tile: Omit<CanopBentoTileProps, "children"> = {},
) {
  const { container } = render(
    <CanopThemeProvider>
      <BentoGrid {...grid}>
        <BentoTile {...tile}>
          <span>Tuile</span>
        </BentoTile>
      </BentoGrid>
    </CanopThemeProvider>,
  );
  const gridElement = container.firstElementChild as HTMLElement;
  return { grid: gridElement, tile: gridElement.firstElementChild as HTMLElement };
}

describe("BentoGrid - accessibilite", () => {
  it("transmet le role et le libelle fournis au conteneur", () => {
    const { grid } = renderBento({ role: "list", ariaLabel: "Indicateurs" });
    expect(screen.getByRole("list", { name: "Indicateurs" })).toBe(grid);
  });

  it("n'expose ni role ni libelle quand ils ne sont pas fournis", () => {
    const { grid } = renderBento();
    expect(grid).not.toHaveAttribute("role");
    expect(grid).not.toHaveAttribute("aria-label");
  });

  it("transmet un role de region nomme", () => {
    renderBento({ role: "region", ariaLabel: "Tableau de bord" });
    expect(screen.getByRole("region", { name: "Tableau de bord" })).toBeInTheDocument();
  });
});

describe("BentoTile - accessibilite", () => {
  it("transmet le role et le libelle fournis a la tuile", () => {
    const { tile } = renderBento({ role: "list" }, { role: "listitem", ariaLabel: "Revenus" });
    expect(screen.getByRole("listitem", { name: "Revenus" })).toBe(tile);
  });

  it("n'expose ni role ni libelle quand ils ne sont pas fournis", () => {
    const { tile } = renderBento();
    expect(tile).not.toHaveAttribute("role");
    expect(tile).not.toHaveAttribute("aria-label");
  });
});
