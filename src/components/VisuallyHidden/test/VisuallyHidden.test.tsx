import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisuallyHidden } from "../VisuallyHidden";

describe("VisuallyHidden", () => {
  it("given un texte masque, when on le rend, then il reste trouvable dans le document", () => {
    render(<VisuallyHidden>Texte pour lecteur d'ecran</VisuallyHidden>);

    expect(screen.getByText("Texte pour lecteur d'ecran")).toBeInTheDocument();
  });

  it("given un texte masque dans un lien, when on calcule le nom accessible, then il en fait partie", () => {
    render(
      <a href="/articles/1">
        Lire la suite <VisuallyHidden>de l'article Canop</VisuallyHidden>
      </a>,
    );

    expect(
      screen.getByRole("link", { name: "Lire la suite de l'article Canop" }),
    ).toBeInTheDocument();
  });

  it("given un lien dont seul le texte masque porte le libelle, when on le cherche par nom, then il est trouve", () => {
    render(
      <a href="/profil">
        <VisuallyHidden>Mon profil</VisuallyHidden>
      </a>,
    );

    expect(screen.getByRole("link", { name: "Mon profil" })).toBeInTheDocument();
  });

  it("given un texte masque, when on le rend, then il n'est ni en display none ni en visibility hidden", () => {
    render(<VisuallyHidden>Invisible mais lu</VisuallyHidden>);

    const element = screen.getByText("Invisible mais lu");
    expect(element).not.toHaveStyle({ display: "none" });
    expect(element).not.toHaveStyle({ visibility: "hidden" });
    expect(element).not.toHaveAttribute("aria-hidden");
    expect(element).not.toHaveAttribute("hidden");
  });

  it("given un texte masque, when on le rend, then il est sorti du flux et reduit a un pixel rogne", () => {
    render(<VisuallyHidden>Masque visuellement</VisuallyHidden>);

    expect(screen.getByText("Masque visuellement")).toHaveStyle({
      position: "absolute",
      overflow: "hidden",
      width: "0.0625rem",
      height: "0.0625rem",
    });
  });

  it("given aucun element demande, when on le rend, then un span est utilise", () => {
    render(<VisuallyHidden>Par defaut</VisuallyHidden>);

    expect(screen.getByText("Par defaut").tagName).toBe("SPAN");
  });

  it("given as div et un id, when on le rend, then l'element et l'id sont respectes", () => {
    render(
      <VisuallyHidden as="div" id="aide-mot-de-passe">
        Huit caracteres minimum
      </VisuallyHidden>,
    );

    const element = screen.getByText("Huit caracteres minimum");
    expect(element.tagName).toBe("DIV");
    expect(element).toHaveAttribute("id", "aide-mot-de-passe");
  });

  it("given un id reference par aria-describedby, when on calcule la description, then le texte masque est utilise", () => {
    render(
      <>
        <input aria-label="Mot de passe" aria-describedby="aide" />
        <VisuallyHidden id="aide">Huit caracteres minimum</VisuallyHidden>
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Mot de passe" })).toHaveAccessibleDescription(
      "Huit caracteres minimum",
    );
  });
});
