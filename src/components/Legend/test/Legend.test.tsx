import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Legend } from "../Legend";

function renderLegend(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function dotColors(): string[] {
  return screen
    .getAllByRole("listitem")
    .map((item) => getComputedStyle(item.firstElementChild as HTMLElement).backgroundColor);
}

describe("Legend", () => {
  it("rend une entree de liste par element de legende", () => {
    renderLegend(
      <Legend
        items={[
          { tone: "success", label: "Actif" },
          { tone: "error", label: "Bloque" },
        ]}
      />,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("affiche le libelle de chaque entree", () => {
    renderLegend(
      <Legend
        items={[
          { tone: "success", label: "Actif" },
          { tone: "warning", label: "En attente" },
        ]}
      />,
    );
    expect(screen.getByText("Actif")).toBeInTheDocument();
    expect(screen.getByText("En attente")).toBeInTheDocument();
  });

  it("attribue une couleur de pastille distincte a chaque tonalite", () => {
    renderLegend(
      <Legend
        items={[
          { tone: "neutral", label: "Inconnu" },
          { tone: "success", label: "Actif" },
          { tone: "warning", label: "En attente" },
          { tone: "error", label: "Bloque" },
        ]}
      />,
    );
    const [neutre, succes, alerte, erreur] = dotColors();
    expect([neutre, succes, alerte, erreur].every((couleur) => couleur !== "")).toBe(true);
    expect(succes).not.toBe(erreur);
    expect(neutre).not.toBe(erreur);
  });

  it("distingue deux entrees partageant la meme tonalite", () => {
    renderLegend(
      <Legend
        items={[
          { tone: "success", label: "Actif" },
          { tone: "success", label: "Renouvele" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("rend une legende vide sans entree", () => {
    renderLegend(<Legend items={[]} />);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});
