import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Breadcrumb } from "../Breadcrumb";
import type { CanopBreadcrumbItem } from "../breadcrumbTypes";

function renderBreadcrumb(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const shortPath: CanopBreadcrumbItem[] = [
  { id: "root", label: "Accueil", onClick: () => undefined },
  { id: "docs", label: "Documents", onClick: () => undefined },
  { id: "reports", label: "Rapports" },
];

describe("Breadcrumb", () => {
  it("rend une navigation avec le libellé par défaut", () => {
    renderBreadcrumb(<Breadcrumb items={shortPath} />);
    expect(screen.getByRole("navigation", { name: "Fil d'Ariane" })).toBeInTheDocument();
  });

  it("applique un libellé de navigation personnalisé", () => {
    renderBreadcrumb(<Breadcrumb items={shortPath} ariaLabel="Chemin courant" />);
    expect(screen.getByRole("navigation", { name: "Chemin courant" })).toBeInTheDocument();
  });

  it("affiche tous les segments quand le chemin tient dans maxItems", () => {
    renderBreadcrumb(<Breadcrumb items={shortPath} />);
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Rapports")).toBeInTheDocument();
  });

  it("marque le dernier segment comme page courante", () => {
    renderBreadcrumb(<Breadcrumb items={shortPath} />);
    expect(screen.getByText("Rapports").closest('[aria-current="page"]')).toBeInTheDocument();
  });

  it("déclenche onClick sur un segment cliquable non courant", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderBreadcrumb(
      <Breadcrumb
        items={[
          { id: "root", label: "Accueil", onClick },
          { id: "reports", label: "Rapports" },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Accueil" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("condense les segments intermédiaires au-delà de maxItems", () => {
    const longPath: CanopBreadcrumbItem[] = [
      { id: "a", label: "Niveau A", onClick: () => undefined },
      { id: "b", label: "Niveau B", onClick: () => undefined },
      { id: "c", label: "Niveau C", onClick: () => undefined },
      { id: "d", label: "Niveau D", onClick: () => undefined },
      { id: "e", label: "Niveau E" },
    ];
    renderBreadcrumb(<Breadcrumb items={longPath} />);
    expect(screen.getByRole("button", { name: "Afficher le chemin complet" })).toBeInTheDocument();
    expect(screen.queryByText("Niveau B")).not.toBeInTheDocument();
  });

  it("révèle les segments condensés via le menu de dépassement", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const longPath: CanopBreadcrumbItem[] = [
      { id: "a", label: "Niveau A", onClick: () => undefined },
      { id: "b", label: "Niveau B", onClick },
      { id: "c", label: "Niveau C", onClick: () => undefined },
      { id: "d", label: "Niveau D", onClick: () => undefined },
      { id: "e", label: "Niveau E" },
    ];
    renderBreadcrumb(<Breadcrumb items={longPath} />);
    await user.click(screen.getByRole("button", { name: "Afficher le chemin complet" }));
    await user.click(screen.getByRole("menuitem", { name: "Niveau B" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
