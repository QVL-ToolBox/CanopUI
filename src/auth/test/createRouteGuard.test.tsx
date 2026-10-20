import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRouteGuard } from "../createRouteGuard";

interface Utilisateur {
  roles: string[];
}

function fabriquer(
  surcharges: Partial<Parameters<typeof createRouteGuard<Utilisateur>>[0]> = {},
  roles: string[] = ["budgy"],
) {
  return createRouteGuard<Utilisateur>({
    fetchUser: () => Promise.resolve({ roles }),
    hasAccess: (user) => user.roles.includes("budgy"),
    isUnauthorizedError: () => false,
    onUnauthorized: vi.fn(),
    loadingLabel: "Chargement",
    errorLabel: "Erreur",
    renderForbidden: () => <p>Acces refuse</p>,
    ...surcharges,
  });
}

describe("createRouteGuard", () => {
  it("rend ses enfants quand l'acces est accorde", async () => {
    const Garde = fabriquer();
    render(
      <Garde>
        <p>Contenu protege</p>
      </Garde>,
    );

    expect(await screen.findByText("Contenu protege")).toBeInTheDocument();
  });

  it("rend le refus quand le role manque", async () => {
    const Garde = fabriquer({}, ["drive"]);
    render(
      <Garde>
        <p>Contenu protege</p>
      </Garde>,
    );

    expect(await screen.findByText("Acces refuse")).toBeInTheDocument();
    expect(screen.queryByText("Contenu protege")).not.toBeInTheDocument();
  });

  it("prend renderAuthorized quand la garde n'a pas d'enfants a elle", async () => {
    const Garde = fabriquer({ renderAuthorized: () => <p>Sortie du routeur</p> });
    render(<Garde />);

    expect(await screen.findByText("Sortie du routeur")).toBeInTheDocument();
  });

  it("resout les libelles a chaque rendu, pour qu'ils puissent etre traduits", async () => {
    let langue = "fr";
    const Garde = fabriquer({
      loadingLabel: () => (langue === "fr" ? "Chargement" : "Loading"),
      fetchUser: () => new Promise(() => undefined),
    });

    const { unmount } = render(<Garde />);
    expect(await screen.findByLabelText("Chargement")).toBeInTheDocument();
    unmount();

    langue = "en";
    render(<Garde />);
    expect(await screen.findByLabelText("Loading")).toBeInTheDocument();
  });

  it("accepte encore un libelle en chaine", async () => {
    const Garde = fabriquer({
      loadingLabel: "Patientez",
      fetchUser: () => new Promise(() => undefined),
    });
    render(<Garde />);

    expect(await screen.findByLabelText("Patientez")).toBeInTheDocument();
  });
});
