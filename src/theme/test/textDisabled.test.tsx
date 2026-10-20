import { describe, expect, it } from "vitest";
import { tokens } from "../../tokens";
import { canopTheme, createCanopTheme } from "../createCanopTheme";

describe("token text.disabled", () => {
  it("expose text.disabled en CSS variable préfixée --canop-palette-text-disabled", () => {
    expect(canopTheme.vars?.palette.text.disabled).toBe(
      `var(--canop-palette-text-disabled, ${tokens.palette.text.disabled})`,
    );
  });

  it("résout text.disabled vers la valeur brute du token en clair et en sombre", () => {
    expect(createCanopTheme("light").palette.text.disabled).toBe(tokens.palette.text.disabled);
    expect(createCanopTheme("dark").palette.text.disabled).toBe(tokens.paletteDark.text.disabled);
  });

  it("adapte la teinte d'argent au mode en distinguant les deux valeurs", () => {
    expect(tokens.palette.text.disabled).not.toBe(tokens.paletteDark.text.disabled);
  });
});
