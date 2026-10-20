import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { tokens } from "../../../tokens";
import { Text } from "../Text";

function renderText(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Text", () => {
  it("rend un paragraphe body-md par defaut", () => {
    renderText(<Text>Contenu</Text>);
    const node = screen.getByText("Contenu");
    expect(node.tagName).toBe("P");
    expect(node).toHaveStyle({ fontSize: tokens.typography.app["body-md"].fontSize });
  });

  it.each([
    ["lead", "P"],
    ["body-lg", "P"],
    ["body-sm", "P"],
    ["label", "SPAN"],
    ["caption", "SPAN"],
    ["overline", "SPAN"],
    ["metric", "SPAN"],
    ["code", "CODE"],
  ] as const)("rend la variante %s dans une balise %s", (variant, tagName) => {
    renderText(<Text variant={variant}>Texte</Text>);
    const node = screen.getByText("Texte");
    expect(node.tagName).toBe(tagName);
    expect(node).toHaveStyle({ fontSize: tokens.typography.app[variant].fontSize });
  });

  it("applique le resserrement optique propre a chaque variante", () => {
    renderText(
      <>
        <Text variant="metric">Metrique</Text>
        <Text variant="body-md">Corps</Text>
        <Text variant="overline">Surtitre</Text>
      </>,
    );
    expect(screen.getByText("Metrique")).toHaveStyle({
      letterSpacing: tokens.typography.letterSpacing.snug,
    });
    expect(screen.getByText("Corps")).toHaveStyle({
      letterSpacing: tokens.typography.letterSpacing.normal,
    });
    expect(screen.getByText("Surtitre")).toHaveStyle({
      letterSpacing: tokens.typography.letterSpacing.wider,
    });
  });

  it("resserre d'autant plus que le texte est grand", () => {
    const ladder = ["metric", "body-lg", "body-sm", "caption", "overline"] as const;
    const spacings = ladder.map((variant) =>
      parseFloat(tokens.typography.app[variant].letterSpacing),
    );
    const sorted = [...spacings].sort((a, b) => a - b);
    expect(spacings).toEqual(sorted);
  });

  it("remplace la graisse de la variante quand weight est fourni", () => {
    renderText(
      <Text variant="body-md" weight="extrabold">
        Insiste
      </Text>,
    );
    expect(screen.getByText("Insiste")).toHaveStyle({
      fontWeight: `${tokens.typography.fontWeight.extrabold}`,
    });
  });

  it("expose les graisses etendues de la variable Chivo", () => {
    renderText(
      <>
        <Text weight="light">Fin</Text>
        <Text weight="extrabold">Epais</Text>
      </>,
    );
    expect(screen.getByText("Fin")).toHaveStyle({ fontWeight: "300" });
    expect(screen.getByText("Epais")).toHaveStyle({ fontWeight: "800" });
  });

  it("passe les chiffres en tabulaire par defaut sur la variante metric", () => {
    renderText(<Text variant="metric">1 204</Text>);
    expect(screen.getByText("1 204")).toHaveStyle({ fontVariantNumeric: "tabular-nums" });
  });

  it("laisse les chiffres proportionnels sur les variantes de corps de texte", () => {
    renderText(<Text variant="body-md">1 204</Text>);
    expect(screen.getByText("1 204")).not.toHaveStyle({ fontVariantNumeric: "tabular-nums" });
  });

  it("combine tabular-nums et slashed-zero", () => {
    renderText(
      <Text tabularNums slashedZero>
        0 807
      </Text>,
    );
    expect(screen.getByText("0 807")).toHaveStyle({
      fontVariantNumeric: "tabular-nums slashed-zero",
    });
  });

  it("desactive le tabulaire hérité de la variante metric sur demande", () => {
    renderText(
      <Text variant="metric" tabularNums={false}>
        1 204
      </Text>,
    );
    expect(screen.getByText("1 204")).not.toHaveStyle({ fontVariantNumeric: "tabular-nums" });
  });

  it("met la variante overline en capitales", () => {
    renderText(<Text variant="overline">Categorie</Text>);
    expect(screen.getByText("Categorie")).toHaveStyle({ textTransform: "uppercase" });
  });

  it("rend la variante code en police monospace", () => {
    renderText(<Text variant="code">npm i @canop/ui</Text>);
    expect(screen.getByText("npm i @canop/ui")).toHaveStyle({
      fontFamily: tokens.typography.fontFamilyMono,
    });
  });

  it.each([
    ["muted", "--canop-palette-text-secondary"],
    ["subtle", "--canop-palette-text-disabled"],
  ] as const)("applique la tonalite %s", (tone, cssVariable) => {
    renderText(<Text tone={tone}>Discret</Text>);
    expect(screen.getByText("Discret")).toHaveStyle({ color: `var(${cssVariable})` });
  });

  it.each(["primary", "secondary", "accent", "error", "warning", "info", "success"] as const)(
    "applique la couleur de palette %s",
    (tone) => {
      renderText(<Text tone={tone}>Colore</Text>);
      expect(screen.getByText("Colore")).toHaveStyle({
        color: `var(--canop-palette-${tone}-main)`,
      });
    },
  );

  it("reste sur la couleur de texte du theme sans tonalite explicite", () => {
    renderText(<Text>Neutre</Text>);
    expect(screen.getByText("Neutre")).toHaveStyle({
      color: "var(--canop-palette-text-primary)",
    });
  });

  it("laisse la prop color primer sur la tonalite", () => {
    renderText(
      <Text tone="muted" color="primary.main">
        Accentue
      </Text>,
    );
    expect(screen.getByText("Accentue")).toHaveStyle({
      color: "var(--canop-palette-primary-main)",
    });
  });

  it("remplace la balise par defaut via as", () => {
    renderText(
      <Text variant="body-md" as="strong">
        Important
      </Text>,
    );
    expect(screen.getByText("Important").tagName).toBe("STRONG");
  });

  it("aligne le texte a gauche par defaut et au centre sur demande", () => {
    renderText(
      <>
        <Text>Gauche</Text>
        <Text align="center">Centre</Text>
      </>,
    );
    expect(screen.getByText("Gauche").className).not.toContain("alignCenter");
    expect(screen.getByText("Centre").className).toContain("alignCenter");
  });

  it("n'ajoute pas de marge basse sans gutterBottom", () => {
    renderText(
      <>
        <Text>Colle</Text>
        <Text gutterBottom>Espace</Text>
      </>,
    );
    expect(screen.getByText("Colle")).toHaveStyle({ marginBottom: "0px" });
    expect(screen.getByText("Espace")).not.toHaveStyle({ marginBottom: "0px" });
  });
});
