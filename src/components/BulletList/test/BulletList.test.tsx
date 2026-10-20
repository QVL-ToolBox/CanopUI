import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { BulletList } from "../BulletList";

function renderList(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("BulletList", () => {
  it("rend une liste comportant un element par item", () => {
    renderList(
      <BulletList
        items={[
          { key: "a", content: "Analyse du besoin" },
          { key: "b", content: "Conception de la maquette" },
          { key: "c", content: "Developpement et recette" },
        ]}
      />,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("affiche le contenu de chaque item", () => {
    renderList(
      <BulletList
        items={[
          { key: "a", content: "Analyse du besoin" },
          { key: "b", content: "Conception de la maquette" },
        ]}
      />,
    );
    expect(screen.getByText("Analyse du besoin")).toBeInTheDocument();
    expect(screen.getByText("Conception de la maquette")).toBeInTheDocument();
  });

  it("n'affiche une action que sur les items qui en portent une", () => {
    renderList(
      <BulletList
        items={[
          { key: "spec", content: "Rediger la specification", action: <button>Editer</button> },
          { key: "review", content: "Relire la documentation" },
        ]}
      />,
    );
    const [withAction, withoutAction] = screen.getAllByRole("listitem");
    expect(within(withAction).getByRole("button", { name: "Editer" })).toBeInTheDocument();
    expect(within(withoutAction).queryByRole("button")).not.toBeInTheDocument();
  });

  it("rend une liste vide quand aucun item n'est fourni", () => {
    renderList(<BulletList items={[]} />);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("accepte un contenu React riche", () => {
    renderList(
      <BulletList items={[{ key: "riche", content: <strong>Contenu mis en avant</strong> }]} />,
    );
    expect(screen.getByText("Contenu mis en avant").tagName).toBe("STRONG");
  });

  it("rattache chaque item directement a la liste", () => {
    renderList(
      <BulletList
        items={[
          { key: "a", content: "Analyse" },
          { key: "b", content: "Conception" },
        ]}
      />,
    );
    const list = screen.getByRole("list");
    for (const item of screen.getAllByRole("listitem")) {
      expect(item.parentElement).toBe(list);
    }
  });
});
