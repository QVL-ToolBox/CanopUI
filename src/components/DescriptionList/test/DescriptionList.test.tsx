import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { DescriptionList } from "../DescriptionList";

function renderList(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("DescriptionList", () => {
  it("rend une liste de définitions sémantique (dl/dt/dd)", () => {
    const { container } = renderList(
      <DescriptionList items={[{ label: "Email", value: "martin@custhome.fr" }]} />,
    );
    expect(container.querySelector("dl")).toBeInTheDocument();
    expect(screen.getByRole("term")).toHaveTextContent("Email");
    expect(screen.getByRole("definition")).toHaveTextContent("martin@custhome.fr");
  });

  it("rend les paires libellé/valeur dans l'ordre", () => {
    renderList(
      <DescriptionList
        items={[
          { label: "Email", value: "martin@custhome.fr" },
          { label: "Compte créé le", value: "05/06/2026" },
        ]}
      />,
    );
    const terms = screen.getAllByRole("term").map((dt) => dt.textContent);
    const definitions = screen.getAllByRole("definition").map((dd) => dd.textContent);
    expect(terms).toEqual(["Email", "Compte créé le"]);
    expect(definitions).toEqual(["martin@custhome.fr", "05/06/2026"]);
  });

  it("accepte une valeur riche (liste à puces)", () => {
    renderList(
      <DescriptionList
        items={[
          {
            label: "Rôles",
            value: (
              <ul>
                <li>portal-admin : admin</li>
                <li>portal-client : user</li>
              </ul>
            ),
          },
        ]}
      />,
    );
    const definition = screen.getByRole("definition");
    expect(definition.querySelectorAll("li")).toHaveLength(2);
    expect(definition).toHaveTextContent("portal-admin : admin");
  });

  it("affiche un tiret pour une valeur vide ou absente", () => {
    renderList(
      <DescriptionList items={[{ label: "Sans valeur" }, { label: "Valeur vide", value: "" }]} />,
    );
    const definitions = screen.getAllByRole("definition").map((dd) => dd.textContent);
    expect(definitions).toEqual(["—", "—"]);
  });

  it("met les libellés en semi-gras", () => {
    renderList(<DescriptionList items={[{ label: "Email", value: "a@b.fr" }]} />);
    expect(screen.getByRole("term")).toHaveStyle({ fontWeight: 600 });
  });
});
