import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { tokens } from "../../../tokens";
import { Text } from "../Text";
import { declarationsDe, valeurAuPalier } from "../../../test/cssRules";

const XS = 0;
const MD = 64;

function renderDisplay(ui: React.ReactElement, label: string): HTMLElement {
  render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  return screen.getByText(label);
}

function tailles(element: HTMLElement): string[] {
  return declarationsDe(element, "font-size").map((entree) => entree.valeur);
}

describe("Text - variante display", () => {
  it("rend la variante display dans un span", () => {
    const node = renderDisplay(<Text variant="display">1 248</Text>, "1 248");
    expect(node.tagName).toBe("SPAN");
  });

  it("prend la taille display-3 en xs", () => {
    const node = renderDisplay(<Text variant="display">42</Text>, "42");
    expect(valeurAuPalier(node, "font-size", XS)).toBe(
      tokens.typography.display["display-3"].fontSize,
    );
  });

  it("prend la taille display-2 a partir de md", () => {
    const node = renderDisplay(<Text variant="display">42</Text>, "42");
    expect(valeurAuPalier(node, "font-size", MD)).toBe(
      tokens.typography.display["display-2"].fontSize,
    );
  });

  it("n'utilise que des tailles issues des tokens display au-dela du repli de base", () => {
    const node = renderDisplay(<Text variant="display">42</Text>, "42");
    const tokensDisplay: string[] = Object.values(tokens.typography.display).map(
      (entree) => entree.fontSize,
    );
    const responsives = declarationsDe(node, "font-size")
      .filter((entree) => entree.condition !== "")
      .map((entree) => entree.valeur);
    expect(responsives.length).toBeGreaterThan(0);
    expect(responsives.every((taille) => tokensDisplay.includes(taille))).toBe(true);
  });

  it("est plus grande que la variante metric a chaque palier", () => {
    const node = renderDisplay(<Text variant="display">42</Text>, "42");
    const metric = parseFloat(tokens.typography.app.metric.fontSize);
    expect(parseFloat(valeurAuPalier(node, "font-size", XS))).toBeGreaterThan(metric);
    expect(parseFloat(valeurAuPalier(node, "font-size", MD))).toBeGreaterThan(metric);
  });

  it("aligne les chiffres en tabulaire par defaut", () => {
    const node = renderDisplay(<Text variant="display">42</Text>, "42");
    expect(declarationsDe(node, "font-variant-numeric").map((entree) => entree.valeur)).toContain(
      "tabular-nums",
    );
  });

  it("respecte tabularNums a false", () => {
    const node = renderDisplay(
      <Text variant="display" tabularNums={false}>
        42
      </Text>,
      "42",
    );
    expect(
      declarationsDe(node, "font-variant-numeric").map((entree) => entree.valeur),
    ).not.toContain("tabular-nums");
  });

  it("ne change pas la taille de la variante metric", () => {
    const node = renderDisplay(<Text variant="metric">42</Text>, "42");
    expect(tailles(node)).toContain(tokens.typography.app.metric.fontSize);
    expect(tailles(node)).not.toContain(tokens.typography.display["display-2"].fontSize);
  });
});
