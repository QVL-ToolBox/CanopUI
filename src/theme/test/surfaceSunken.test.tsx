import { describe, expect, it } from "vitest";
import { tokens } from "../../tokens";
import { canopTheme, createCanopTheme } from "../createCanopTheme";

describe("token surface.sunken", () => {
  it("expose surface.sunken en CSS variable préfixée --canop-palette-surface-sunken", () => {
    expect(canopTheme.vars?.palette.surface.sunken).toBe(
      `var(--canop-palette-surface-sunken, ${tokens.palette.surface.sunken})`,
    );
  });

  it("résout surface.sunken vers la valeur brute du token dans les deux modes", () => {
    expect(createCanopTheme("light").palette.surface.sunken).toBe(tokens.palette.surface.sunken);
    expect(createCanopTheme("dark").palette.surface.sunken).toBe(tokens.paletteDark.surface.sunken);
  });
});
