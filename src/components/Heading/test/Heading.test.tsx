import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Heading } from "../Heading";

function renderHeading(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Heading", () => {
  it("rend un h2 par défaut (titre de page)", () => {
    renderHeading(<Heading>Connexion</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "Connexion" })).toBeInTheDocument();
  });

  it.each([
    [1, "4.21rem"],
    [2, "3.158rem"],
    [3, "2.369rem"],
    [4, "1.777rem"],
  ] as const)("rend un h%s avec la taille %s (échelle Chivo 1.333)", (level, fontSize) => {
    renderHeading(<Heading level={level}>Titre</Heading>);
    const heading = screen.getByRole("heading", { level, name: "Titre" });
    expect(heading.tagName).toBe(`H${level}`);
    expect(heading).toHaveStyle({ fontSize });
  });

  it("compose tous les niveaux dans la police de titre, a son poids reel", () => {
    renderHeading(
      <>
        <Heading level={1}>Principal</Heading>
        <Heading level={3}>Section</Heading>
      </>,
    );

    for (const level of [1, 3] as const) {
      const titre = screen.getByRole("heading", { level });
      expect(getComputedStyle(titre).fontFamily).toContain("Titan One");
      expect(getComputedStyle(titre).fontWeight).toBe("400");
    }
  });

  it("aligne à gauche par défaut et au centre sur demande", () => {
    renderHeading(
      <>
        <Heading>Gauche</Heading>
        <Heading align="center">Centre</Heading>
      </>,
    );
    expect(screen.getByRole("heading", { name: "Gauche" }).className).not.toContain("alignCenter");
    expect(screen.getByRole("heading", { name: "Centre" }).className).toContain("alignCenter");
  });

  it("reste sur la couleur de texte du thème sans tonalité explicite", () => {
    renderHeading(<Heading>Neutre</Heading>);
    expect(screen.getByRole("heading", { name: "Neutre" })).toHaveStyle({
      color: "var(--canop-palette-text-primary)",
    });
  });

  it.each(["primary", "secondary", "accent", "error", "warning", "info", "success"] as const)(
    "applique la couleur de palette %s",
    (tone) => {
      renderHeading(<Heading tone={tone}>Coloré</Heading>);
      expect(screen.getByRole("heading", { name: "Coloré" })).toHaveStyle({
        color: `var(--canop-palette-${tone}-main)`,
      });
    },
  );

  it("laisse la prop color primer sur la tonalité", () => {
    renderHeading(
      <Heading tone="muted" color="accent.main">
        Accentué
      </Heading>,
    );
    expect(screen.getByRole("heading", { name: "Accentué" })).toHaveStyle({
      color: "var(--canop-palette-accent-main)",
    });
  });

  it("applique une marge basse par défaut, désactivable", () => {
    renderHeading(
      <>
        <Heading>Avec marge</Heading>
        <Heading gutterBottom={false}>Sans marge</Heading>
      </>,
    );
    expect(screen.getByRole("heading", { name: "Avec marge" }).className).toContain("gutterBottom");
    expect(screen.getByRole("heading", { name: "Sans marge" }).className).not.toContain(
      "gutterBottom",
    );
  });
});
