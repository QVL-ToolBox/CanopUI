import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { EmptyState } from "../EmptyState";
import { Card } from "../../Card";
import { racineDeCarte } from "../../../test/cardTestKit";
import { derniereValeurEmise } from "../../../test/cssRules";

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

  it("rend titre, description, action et icône sans Card en surface plain", () => {
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
    expect(racineDeCarte(container)).toBeNull();
  });

  it.each([
    ["par défaut", undefined],
    ["avec surface ambient explicite", "ambient"],
  ] as const)("rend le contenu dans une Card frosted %s", (_cas, surface) => {
    const { container } = renderEmptyState(<EmptyState surface={surface} title="Aucun fichier" />);
    const carte = racineDeCarte(container);
    expect(carte).not.toBeNull();
    expect(carte).toContainElement(screen.getByRole("heading", { name: "Aucun fichier" }));
    const flouAttendu = flouDUneCarteFrosted();
    expect(flouAttendu).not.toBe("");
    expect(derniereValeurEmise(carte, "backdrop-filter")).toBe(flouAttendu);
  });

  it("ne rend aucun canvas de lave quelle que soit la surface", () => {
    const { container } = renderEmptyState(
      <>
        <EmptyState title="Ambient" />
        <EmptyState title="Plain" surface="plain" />
      </>,
    );
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("ne place pas de div dans un paragraphe pour une description non textuelle", () => {
    const { container } = renderEmptyState(
      <EmptyState title="Aucun fichier" description={<div>Bloc riche</div>} />,
    );
    expect(screen.getByText("Bloc riche")).toBeInTheDocument();
    expect(container.querySelector("p div")).toBeNull();
  });
});

function flouDUneCarteFrosted(): string {
  const { container, unmount } = renderEmptyState(<Card variant="frosted">Référence</Card>);
  const flou = derniereValeurEmise(racineDeCarte(container), "backdrop-filter");
  unmount();
  return flou;
}
