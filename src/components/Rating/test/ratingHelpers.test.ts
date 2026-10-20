import { describe, expect, it } from "vitest";
import {
  RATING_PRECISION,
  formatRatingValue,
  normalizeRatingMax,
  normalizeRatingValue,
  ratingAriaLabel,
  ratingTextVariant,
  type CanopRatingTextVariant,
} from "../ratingHelpers";
import type { CanopIconSize } from "../../Icon";

const sizes: CanopIconSize[] = ["xs", "sm", "md", "lg", "xl"];
const textVariantRank: Record<CanopRatingTextVariant, number> = { caption: 0, body2: 1, body1: 2 };

function isMultipleOfPrecision(value: number) {
  const steps = value / RATING_PRECISION;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

describe("RATING_PRECISION", () => {
  it("découpe chaque étoile au dixième", () => {
    expect(RATING_PRECISION).toBe(0.1);
  });
});

describe("normalizeRatingMax", () => {
  it("conserve un nombre d'étoiles entier et positif", () => {
    expect(normalizeRatingMax(1)).toBe(1);
    expect(normalizeRatingMax(2)).toBe(2);
    expect(normalizeRatingMax(5)).toBe(5);
    expect(normalizeRatingMax(10)).toBe(10);
  });

  it("ramène un max nul à une étoile", () => {
    expect(normalizeRatingMax(0)).toBe(1);
  });

  it("ramène un max négatif à une étoile", () => {
    expect(normalizeRatingMax(-3)).toBe(1);
  });

  it("ramène un max non numérique à une étoile", () => {
    expect(normalizeRatingMax(NaN)).toBe(1);
  });

  it.each([0, -3, -0.5, 0.5, 3.7, 5, NaN, Infinity, -Infinity])(
    "renvoie pour %s un entier strictement positif exploitable par un tableau d'étoiles",
    (max) => {
      const normalized = normalizeRatingMax(max);
      expect(Number.isInteger(normalized)).toBe(true);
      expect(normalized).toBeGreaterThanOrEqual(1);
      expect(() => Array.from(new Array(normalized))).not.toThrow();
    },
  );
});

describe("normalizeRatingValue", () => {
  it("conserve une note déjà exprimée au dixième", () => {
    expect(normalizeRatingValue(4.3, 5)).toBe(4.3);
    expect(normalizeRatingValue(0, 5)).toBe(0);
    expect(normalizeRatingValue(5, 5)).toBe(5);
  });

  it("borne une note supérieure au max", () => {
    expect(normalizeRatingValue(7, 5)).toBe(5);
    expect(normalizeRatingValue(12, 10)).toBe(10);
  });

  it("ramène une note négative à zéro", () => {
    expect(normalizeRatingValue(-2, 5)).toBe(0);
  });

  it("ramène une note non numérique à zéro", () => {
    expect(normalizeRatingValue(NaN, 5)).toBe(0);
  });

  it.each([NaN, Infinity, -Infinity])("borne la note non finie %s dans l'intervalle", (value) => {
    const normalized = normalizeRatingValue(value, 5);
    expect(normalized).toBeGreaterThanOrEqual(0);
    expect(normalized).toBeLessThanOrEqual(5);
  });

  it("arrondit la note au dixième", () => {
    expect(normalizeRatingValue(2.449999, 5)).toBe(2.4);
    expect(normalizeRatingValue(4.949, 5)).toBe(4.9);
    expect(normalizeRatingValue(3.999, 5)).toBe(4);
    expect(normalizeRatingValue(0.05, 5)).toBe(0.1);
  });

  it.each([0, 0.04, 0.05, 2.449999, 3.999, 4.15, 4.25, 4.35, 4.949, 5, 7, -2, NaN])(
    "renvoie pour %s une note multiple du dixième",
    (value) => {
      expect(isMultipleOfPrecision(normalizeRatingValue(value, 5))).toBe(true);
    },
  );

  it("ne dépasse jamais l'intervalle du max normalisé", () => {
    expect(normalizeRatingValue(3, normalizeRatingMax(0))).toBeLessThanOrEqual(1);
    expect(normalizeRatingValue(3, normalizeRatingMax(-3))).toBeLessThanOrEqual(1);
  });
});

describe("formatRatingValue", () => {
  it("affiche toujours une décimale", () => {
    expect(formatRatingValue(0)).toBe("0.0");
    expect(formatRatingValue(4)).toBe("4.0");
    expect(formatRatingValue(10)).toBe("10.0");
  });

  it("affiche la décimale de la note", () => {
    expect(formatRatingValue(4.3)).toBe("4.3");
    expect(formatRatingValue(0.1)).toBe("0.1");
  });

  it.each([0, 0.1, 1, 4.3, 4.9, 5, 7.5, 10])("formate %s avec exactement une décimale", (value) => {
    expect(formatRatingValue(value)).toMatch(/^\d+\.\d$/);
  });
});

describe("ratingAriaLabel", () => {
  it("annonce la note et le max sans libellé", () => {
    expect(ratingAriaLabel(4.3, 5)).toBe("4.3/5");
  });

  it("préfixe l'annonce par le libellé fourni", () => {
    expect(ratingAriaLabel(4.3, 5, "Ambiance")).toBe("Ambiance 4.3/5");
  });

  it("ignore un libellé vide", () => {
    expect(ratingAriaLabel(4.3, 5, "")).toBe("4.3/5");
  });

  it("annonce la note avec une décimale même pour un entier", () => {
    expect(ratingAriaLabel(4, 5)).toBe("4.0/5");
    expect(ratingAriaLabel(0, 5)).toBe("0.0/5");
  });

  it("annonce le max fourni", () => {
    expect(ratingAriaLabel(7.5, 10)).toBe("7.5/10");
    expect(ratingAriaLabel(1, 1)).toBe("1.0/1");
  });
});

describe("ratingTextVariant", () => {
  it.each(sizes)("renvoie une variante de typographie pour la taille %s", (size) => {
    expect(textVariantRank[ratingTextVariant(size)]).toBeGreaterThanOrEqual(0);
  });

  it("ne réduit jamais la typographie quand la taille de l'icône augmente", () => {
    const ranks = sizes.map((size) => textVariantRank[ratingTextVariant(size)]);
    const sorted = [...ranks].sort((left, right) => left - right);
    expect(ranks).toEqual(sorted);
  });

  it("distingue la typographie de la plus petite et de la plus grande taille", () => {
    expect(ratingTextVariant("xs")).not.toBe(ratingTextVariant("xl"));
  });
});
