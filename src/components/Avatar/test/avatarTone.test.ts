import { describe, expect, it } from "vitest";
import { palette, paletteDark } from "../../../tokens";
import { avatarTone } from "../avatarTone";

const sampleNames = Array.from({ length: 500 }, (_, index) => `Utilisateur ${index} Canop`).concat([
  "Martin Queval",
  "Élodie Durand",
  "Jean-Pierre Lefèvre",
  "Ana María de la Peña",
  "Œdipe",
  "42 Zoé",
  "",
]);

const producedTones = [...new Set(sampleNames.map(avatarTone))];

function channelLuminance(channel: number): number {
  const ratio = channel / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const value = hex.replace("#", "");
  const [red, green, blue] = [0, 2, 4].map((start) =>
    channelLuminance(parseInt(value.slice(start, start + 2), 16)),
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string): number {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe("avatarTone", () => {
  it("given un meme nom, when on calcule la teinte plusieurs fois, then elle est identique", () => {
    expect(avatarTone("Martin Queval")).toBe(avatarTone("Martin Queval"));
  });

  it("given un nom ecrit avec une autre casse, when on calcule la teinte, then elle est identique", () => {
    expect(avatarTone("MARTIN queval")).toBe(avatarTone("Martin Queval"));
  });

  it("given un nom avec des espaces superflus, when on calcule la teinte, then elle est identique", () => {
    expect(avatarTone("   Martin    Queval  ")).toBe(avatarTone("Martin Queval"));
  });

  it("given un nom en forme decomposee, when on calcule la teinte, then elle est identique a la forme composee", () => {
    expect(avatarTone("Élodie Durand")).toBe(avatarTone("Élodie Durand"));
  });

  it("given un large echantillon de noms, when on calcule les teintes, then warning n'apparait jamais", () => {
    expect(producedTones).not.toContain("warning");
  });

  it("given un large echantillon de noms, when on calcule les teintes, then plusieurs teintes sont utilisees", () => {
    expect(producedTones.length).toBeGreaterThan(1);
  });

  it.each([
    ["palette", palette],
    ["paletteDark", paletteDark],
  ] as const)(
    "given le theme %s, when on mesure le contraste des initiales sur chaque teinte, then il atteint 4,5:1",
    (_, themePalette) => {
      const ratios = producedTones.map((tone) => ({
        tone,
        ratio: contrastRatio(themePalette[tone].main, themePalette[tone].contrastText),
      }));

      expect(ratios.filter(({ ratio }) => ratio < 4.5)).toEqual([]);
    },
  );
});
