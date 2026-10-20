import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { EmptyState } from "../EmptyState";

function renderEmptyState(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("EmptyState", () => {
  it("rend le titre comme titre de niveau 2 par défaut", () => {
    renderEmptyState(<EmptyState title="Aucun fichier" />);
    expect(screen.getByRole("heading", { level: 2, name: "Aucun fichier" })).toBeInTheDocument();
  });

  it("affiche la description quand elle est fournie", () => {
    renderEmptyState(
      <EmptyState title="Aucun fichier" description="Importez votre premier document." />,
    );
    expect(screen.getByText("Importez votre premier document.")).toBeInTheDocument();
  });

  it("n'affiche pas de description quand elle est absente", () => {
    renderEmptyState(<EmptyState title="Aucun fichier" />);
    expect(screen.queryByText("Importez votre premier document.")).not.toBeInTheDocument();
  });

  it("applique le niveau de titre personnalisé", () => {
    renderEmptyState(<EmptyState title="Aucun fichier" headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Aucun fichier" })).toBeInTheDocument();
  });

  it("rend l'icône illustrative fournie", () => {
    renderEmptyState(
      <EmptyState title="Aucun fichier" icon={<span data-testid="illustration" />} />,
    );
    expect(screen.getByTestId("illustration")).toBeInTheDocument();
  });

  it("rend l'action principale fournie", () => {
    renderEmptyState(
      <EmptyState title="Aucun fichier" action={<button type="button">Importer</button>} />,
    );
    expect(screen.getByRole("button", { name: "Importer" })).toBeInTheDocument();
  });

  it("rend titre, description, action et icône sans formes ambient en surface plain", () => {
    const { container } = renderEmptyState(
      <EmptyState
        surface="plain"
        title="Aucun fichier"
        description="Importez votre premier document."
        icon={<span data-testid="illustration" />}
        action={<button type="button">Importer</button>}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Aucun fichier" })).toBeInTheDocument();
    expect(screen.getByText("Importez votre premier document.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Importer" })).toBeInTheDocument();
    expect(screen.getByTestId("illustration")).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it("conserve les formes ambient par défaut", () => {
    const { container } = renderEmptyState(<EmptyState title="Aucun fichier" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("conserve les formes ambient avec surface ambient explicite", () => {
    const { container } = renderEmptyState(<EmptyState surface="ambient" title="Aucun fichier" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
