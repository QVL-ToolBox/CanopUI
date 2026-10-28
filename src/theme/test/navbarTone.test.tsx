import { describe, expect, it } from "vitest";
import type { CanopThemeMode } from "../createCanopTheme";
import { palette, paletteDark } from "../../tokens/palette";
import { contrastRatio, mixSrgb } from "../../test/contrastRatio";
import {
  VARIABLES_NAVBAR,
  composerSur,
  rendreTonal,
  resoudreCouleur,
  variablesNavbarPoseesSurRoot,
} from "../../test/navbarToneKit";

const MODES: CanopThemeMode[] = ["light", "dark"];
const BLANC = "#ffffff";
const NOIR = "#000000";

function variablesDuMode(mode: CanopThemeMode) {
  rendreTonal(<span />, mode);
  return variablesNavbarPoseesSurRoot();
}

function couleurDuMode(mode: CanopThemeMode, nom: string) {
  return resoudreCouleur(variablesDuMode(mode)[nom], mode);
}

describe("AC1 - variables --canop-navbar-* posees par le theme sur :root", () => {
  it.each(MODES)("pose les douze variables de la barre en mode %s", (mode) => {
    expect(Object.keys(variablesDuMode(mode)).sort()).toEqual([...VARIABLES_NAVBAR].sort());
  });

  it.each(MODES)("ne pose plus de variable active-mark en mode %s", (mode) => {
    expect(variablesDuMode(mode)).not.toHaveProperty("active-mark");
  });

  it("donne des valeurs differentes en clair et en sombre", () => {
    const clair = variablesDuMode("light");
    const sombre = variablesDuMode("dark");
    expect(clair["bg-top"]).not.toBe(sombre["bg-top"]);
    expect(clair["bg-bottom"]).not.toBe(sombre["bg-bottom"]);
    expect(clair.text).not.toBe(sombre.text);
    expect(clair["text-muted"]).not.toBe(sombre["text-muted"]);
  });

  describe("clair", () => {
    it("degrade de primary.main en haut vers primary.dark en bas", () => {
      expect(couleurDuMode("light", "bg-top")).toEqual({ hex: palette.primary.main, alpha: 1 });
      expect(couleurDuMode("light", "bg-bottom")).toEqual({ hex: palette.primary.dark, alpha: 1 });
    });

    it.each([
      ["text", 0.88],
      ["text-hover", 1],
      ["text-muted", 0.8],
    ])("texte %s blanc a %s", (nom, alpha) => {
      expect(couleurDuMode("light", nom)).toEqual({ hex: BLANC, alpha });
    });
  });

  describe("sombre", () => {
    it("degrade de primary.dark melange au noir de 45 % a 33 %", () => {
      expect(couleurDuMode("dark", "bg-top").hex).toBe(
        mixSrgb(paletteDark.primary.dark, 0.45, NOIR),
      );
      expect(couleurDuMode("dark", "bg-bottom").hex).toBe(
        mixSrgb(paletteDark.primary.dark, 0.33, NOIR),
      );
    });

    it.each([
      ["text", 0.72],
      ["text-hover", 0.96],
      ["text-muted", 0.58],
    ])("texte %s blanc a %s", (nom, alpha) => {
      expect(couleurDuMode("dark", nom)).toEqual({ hex: BLANC, alpha });
    });

    it.each([
      ["halo", 0.42],
      ["foot-glow", 0.17],
    ])("%s en primary.light a %s", (nom, alpha) => {
      expect(couleurDuMode("dark", nom)).toEqual({ hex: paletteDark.primary.light, alpha });
    });
  });
});

describe("AC2 - pastille active blanche a texte fonce", () => {
  it.each(MODES)("pastille common.white en mode %s", (mode) => {
    expect(couleurDuMode(mode, "active-bg")).toEqual({ hex: BLANC, alpha: 1 });
  });

  it.each(MODES)("texte actif plus fonce que primary.dark en mode %s", (mode) => {
    const primaryDark = (mode === "light" ? palette : paletteDark).primary.dark;
    const actif = couleurDuMode(mode, "active-text");
    expect(actif.alpha).toBe(1);
    expect(contrastRatio(actif.hex, BLANC)).toBeGreaterThan(contrastRatio(primaryDark, BLANC));
  });
});

describe("AC5 - contraste AA du texte sur la barre", () => {
  const SEUIL_AA = 4.5;

  describe.each(MODES)("mode %s", (mode) => {
    it.each(["bg-top", "bg-bottom"])("texte normal et discret lisibles sur %s", (fondNom) => {
      const variables = variablesDuMode(mode);
      const fond = resoudreCouleur(variables[fondNom], mode).hex;
      for (const texte of ["text", "text-muted"]) {
        const visible = composerSur(resoudreCouleur(variables[texte], mode), fond);
        expect(contrastRatio(visible, fond)).toBeGreaterThanOrEqual(SEUIL_AA);
      }
    });

    it("texte actif lisible sur la pastille", () => {
      const fond = couleurDuMode(mode, "active-bg").hex;
      const actif = composerSur(couleurDuMode(mode, "active-text"), fond);
      expect(contrastRatio(actif, fond)).toBeGreaterThanOrEqual(SEUIL_AA);
    });
  });
});
