import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { StatCard } from "../StatCard";

function renderCard(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("StatCard", () => {
  it("affiche le libellé et la valeur", () => {
    renderCard(<StatCard label="Fichiers" value="128" />);
    expect(screen.getByText("Fichiers")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
  });

  it("formate une variation positive avec un signe plus", () => {
    renderCard(<StatCard label="Ventes" value="128" variation={5} />);
    expect(screen.getByText("+5%")).toBeInTheDocument();
  });

  it("formate une variation négative avec son signe", () => {
    renderCard(<StatCard label="Ventes" value="128" variation={-3} />);
    expect(screen.getByText("-3%")).toBeInTheDocument();
  });

  it("n'affiche aucune variation quand elle n'est pas fournie", () => {
    renderCard(<StatCard label="Fichiers" value="128" />);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it("affiche le libellé de variation complémentaire", () => {
    renderCard(
      <StatCard label="Ventes" value="128" variation={5} variationLabel="vs mois dernier" />,
    );
    expect(screen.getByText("vs mois dernier")).toBeInTheDocument();
  });

  it("colore favorablement une hausse quand la hausse est bonne", () => {
    renderCard(<StatCard label="Ventes" value="128" variation={5} positiveIsGood />);
    expect(screen.getByText("+5%")).toHaveStyle({ color: "var(--canop-palette-success-main)" });
  });

  it("colore défavorablement une hausse quand la hausse est mauvaise", () => {
    renderCard(<StatCard label="Coûts" value="128" variation={5} positiveIsGood={false} />);
    expect(screen.getByText("+5%")).toHaveStyle({ color: "var(--canop-palette-error-main)" });
  });
});
