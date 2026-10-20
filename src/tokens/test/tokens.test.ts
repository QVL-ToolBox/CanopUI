import { describe, expect, it } from "vitest";
import {
  breakpoints,
  map,
  motion,
  palette,
  paletteDark,
  paletteHalloween,
  paletteHalloweenDark,
  radius,
  scrollbar,
  shadows,
  spacing,
  squircle,
  tokens,
  typography,
} from "../index";

describe("tokens", () => {
  it("regroupe les treize familles de tokens", () => {
    expect(tokens).toEqual({
      palette,
      paletteDark,
      paletteHalloween,
      paletteHalloweenDark,
      typography,
      spacing,
      radius,
      shadows,
      motion,
      breakpoints,
      squircle,
      scrollbar,
      map,
    });
  });

  it("expose la palette de marque CustHome (clair)", () => {
    expect(palette.primary.main).toBe("#1e6244");
    expect(palette.secondary.main).toBe("#8f9a74");
    expect(palette.secondary.light).toBe("#bcc2a8");
    expect(palette.accent.main).toBe("#f4ad15");
    expect(palette.background.default).toBe("#f7f4ef");
    expect(palette.text.primary).toBe("#14100b");
    expect(palette.error.main).toBe("#b3261e");
  });

  it("expose la palette de marque CustHome (sombre)", () => {
    expect(paletteDark.primary.main).toBe("#62a886");
    expect(paletteDark.primary.light).toBe("#8bcfa9");
    expect(paletteDark.primary.dark).toBe("#3e7d5e");
    expect(paletteDark.secondary.main).toBe("#a9b48c");
    expect(paletteDark.accent.main).toBe("#f4ad15");
    expect(paletteDark.background.default).toBe("#0c0f0d");
    expect(paletteDark.text.primary).toBe("#f3f1ec");
  });

  it("expose la ramp de surfaces d'élévation dans les deux déclinaisons", () => {
    for (const p of [palette, paletteDark]) {
      expect(p.surface.sunken).toMatch(/^#[0-9a-f]{6}$/);
      expect(p.surface.base).toMatch(/^#[0-9a-f]{6}$/);
      expect(p.surface.raised).toMatch(/^#[0-9a-f]{6}$/);
      expect(p.surface.overlay).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(palette.background.paper).toBe(palette.surface.raised);
    expect(paletteDark.background.paper).toBe(paletteDark.surface.raised);
  });

  it("expose des couleurs hexadécimales valides dans les deux déclinaisons", () => {
    for (const p of [palette, paletteDark]) {
      const flat = [
        ...Object.values(p.primary),
        ...Object.values(p.secondary),
        ...Object.values(p.accent),
        ...Object.values(p.error),
        ...Object.values(p.warning),
        ...Object.values(p.info),
        ...Object.values(p.success),
        ...Object.values(p.background),
        ...Object.values(p.surface),
        ...Object.values(p.text),
        p.divider,
      ];
      for (const color of flat) {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("expose la typo Chivo et les deux registres Display et App", () => {
    expect(typography.fontFamily).toContain("Chivo");
    expect(typography.heading.h1.fontSize).toBe("4.21rem");
    expect(typography.display["display-1"].fontSize).toBe("3.815rem");
    expect(typography.display["display-4"].fontSize).toBe("1.61rem");
    expect(typography.app["title-lg"].fontSize).toBe("1.5rem");
    expect(typography.app.metric.fontSize).toBe("1.75rem");
    expect(typography.lineHeight.snug).toBe(1.3);
  });

  it("resserre le crénage d'autant plus que le texte est grand", () => {
    const styles = [
      ...Object.values(typography.heading),
      ...Object.values(typography.display),
      ...Object.values(typography.app),
    ].filter((style) => style !== typography.app.overline);

    for (const bigger of styles) {
      for (const smaller of styles) {
        if (parseFloat(bigger.fontSize) <= parseFloat(smaller.fontSize)) continue;
        expect(
          parseFloat(bigger.letterSpacing),
          `${bigger.fontSize} doit être plus resserré que ${smaller.fontSize}`,
        ).toBeLessThanOrEqual(parseFloat(smaller.letterSpacing));
      }
    }
  });

  it("ouvre le crénage du surtitre pour le rendre lisible en capitales", () => {
    expect(parseFloat(typography.app.overline.letterSpacing)).toBeGreaterThan(0.05);
  });

  it("expose les six graisses de la variable Chivo", () => {
    expect(Object.values(typography.fontWeight)).toEqual([300, 400, 500, 600, 700, 800]);
  });

  it("expose espacements et radius étendus", () => {
    expect(spacing.unit).toBe(8);
    expect(spacing["3xs"]).toBe("0.125rem");
    expect(spacing["4xl"]).toBe("6rem");
    expect(radius.xs).toBe("0.5rem");
    expect(radius.sm).toBe("1rem");
    expect(radius.md).toBe("1.375rem");
    expect(radius.lg).toBe("1.75rem");
    expect(radius.xl).toBe("2.25rem");
    expect(radius["2xl"]).toBe("2.875rem");
    expect(radius.pill).toBe("62.4375rem");
  });

  it("garde l'échelle de rayons strictement croissante", () => {
    const scale = [radius.xs, radius.sm, radius.md, radius.lg, radius.xl, radius["2xl"]];
    const measured = scale.map((value) => parseFloat(value));
    expect(measured).toEqual([...measured].sort((a, b) => a - b));
    expect(new Set(measured).size).toBe(measured.length);
  });

  it("expose un exposant de squircle réglable par famille de forme", () => {
    const families = Object.entries(tokens.squircle.exponent);
    expect(families.map(([family]) => family).sort()).toEqual([
      "circle",
      "dot",
      "pill",
      "rectangle",
    ]);

    for (const [family, exponent] of families) {
      expect(exponent, `${family} doit dépasser le cercle`).toBeGreaterThan(2);
      expect(exponent, `${family} doit rester une courbe`).toBeLessThan(20);
    }
  });

  it("expose des ombres adaptatives light et dark sur cinq niveaux", () => {
    for (const level of ["e1", "e2", "e3", "e4", "e5"] as const) {
      expect(shadows.light[level]).toMatch(/rgba/);
      expect(shadows.dark[level]).toMatch(/rgba/);
    }
    expect(shadows.dark.e5).toContain("rgba(157,225,196");
  });

  it("expose les tokens de motion et de breakpoints", () => {
    expect(motion.duration.base).toBe("220ms");
    expect(motion.easing.organic).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
    expect(breakpoints.unit).toBe("rem");
    expect(breakpoints.values.md).toBe(64);
    expect(breakpoints.values.lg).toBe(90);
  });

  it("pose un texte fonce sur le primary sombre", () => {
    expect(paletteDark.primary.contrastText).toBe("#08130d");
    expect(paletteDark.text.onPrimary).toBe("#08130d");
  });
});
