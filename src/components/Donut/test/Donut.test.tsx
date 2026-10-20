import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Donut } from "../Donut";
import type { CanopDonutSegment } from "../useDonut";

function renderDonut(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const halves: CanopDonutSegment[] = [
  { label: "Utilisé", value: 50 },
  { label: "Libre", value: 50 },
];

describe("Donut", () => {
  it("rend un graphique image accessible", () => {
    renderDonut(<Donut segments={halves} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("construit un libellé accessible décrivant chaque segment", () => {
    renderDonut(<Donut segments={halves} />);
    expect(screen.getByRole("img", { name: "Utilisé : 50 %, Libre : 50 %" })).toBeInTheDocument();
  });

  it("privilégie un ariaLabel explicite", () => {
    renderDonut(<Donut segments={halves} ariaLabel="Occupation du stockage" />);
    expect(screen.getByRole("img", { name: "Occupation du stockage" })).toBeInTheDocument();
  });

  it("dessine la piste de fond avec le token surface sunken", () => {
    const { container } = renderDonut(<Donut segments={halves} />);
    expect(
      container.querySelector('circle[stroke="var(--canop-palette-surface-sunken)"]'),
    ).toBeInTheDocument();
  });

  it("affiche la légende avec libellés et valeurs quand demandée", () => {
    renderDonut(<Donut segments={halves} showLegend />);
    expect(screen.getByText("Utilisé")).toBeInTheDocument();
    expect(screen.getByText("Libre")).toBeInTheDocument();
    expect(screen.getAllByText("50 %")).toHaveLength(2);
  });

  it("n'affiche pas de légende par défaut", () => {
    renderDonut(<Donut segments={halves} />);
    expect(screen.queryByText("Utilisé")).not.toBeInTheDocument();
  });

  it("rend le contenu central fourni", () => {
    renderDonut(<Donut segments={halves} centerContent={<span>128 Go</span>} />);
    expect(screen.getByText("128 Go")).toBeInTheDocument();
  });

  it("applique la mise en forme personnalisée des valeurs", () => {
    renderDonut(
      <Donut
        segments={[{ label: "Images", value: 30 }]}
        showLegend
        formatValue={(segment) => `${segment.value} u`}
      />,
    );
    expect(screen.getByText("30 u")).toBeInTheDocument();
  });
});
