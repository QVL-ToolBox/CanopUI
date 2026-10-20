import { describe, expect, it } from "vitest";
import { sliderMetrics, sliderTrackBackgroundSize, sliderTrackGradient } from "../sliderHelpers";
import { formatSliderValue, stepDecimals } from "../sliderHelpers";

describe("stepDecimals", () => {
  it("ne compte aucune décimale pour un step entier", () => {
    expect(stepDecimals(1)).toBe(0);
    expect(stepDecimals(5)).toBe(0);
  });

  it("compte une décimale pour un step de 0.5", () => {
    expect(stepDecimals(0.5)).toBe(1);
  });

  it("compte deux décimales pour un step de 0.25", () => {
    expect(stepDecimals(0.25)).toBe(2);
  });

  it("compte les décimales d'un step écrit en notation exponentielle", () => {
    expect(stepDecimals(1e-7)).toBe(7);
    expect(stepDecimals(2.5e-3)).toBe(4);
  });

  it("ne compte aucune décimale pour un step entier écrit en notation exponentielle", () => {
    expect(stepDecimals(1e2)).toBe(0);
  });

  it("ne compte aucune décimale pour un step nul ou négatif", () => {
    expect(stepDecimals(0)).toBe(0);
    expect(stepDecimals(-1)).toBe(0);
    expect(stepDecimals(-0.5)).toBe(0);
  });
});

describe("formatSliderValue", () => {
  it("formate sans décimale quand le step vaut 1", () => {
    expect(formatSliderValue(3, 1)).toBe("3");
  });

  it("formate avec une décimale quand le step vaut 0.5", () => {
    expect(formatSliderValue(3, 0.5)).toBe("3.0");
    expect(formatSliderValue(2.5, 0.5)).toBe("2.5");
  });

  it("formate avec deux décimales quand le step vaut 0.25", () => {
    expect(formatSliderValue(2, 0.25)).toBe("2.00");
    expect(formatSliderValue(2.25, 0.25)).toBe("2.25");
  });

  it("formate avec les décimales d'un step exponentiel", () => {
    expect(formatSliderValue(1, 1e-7)).toBe("1.0000000");
    expect(formatSliderValue(0.0000001, 1e-7)).toBe("0.0000001");
  });

  it("formate sans décimale quand le step est nul ou négatif", () => {
    expect(formatSliderValue(4, 0)).toBe("4");
    expect(formatSliderValue(4, -1)).toBe("4");
  });
});

describe("sliderTrackGradient", () => {
  it("reprend les trois teintes de la famille demandee", () => {
    expect(sliderTrackGradient("accent")).toBe(
      "linear-gradient(90deg, var(--canop-palette-accent-light) 0%," +
        " var(--canop-palette-accent-main) 55%," +
        " var(--canop-palette-accent-dark) 100%)",
    );
  });
});

describe("sliderTrackBackgroundSize", () => {
  it("etire la rampe pour qu'elle couvre tout le rail", () => {
    expect(sliderTrackBackgroundSize(50, 0, 100)).toBe("200% 100%");
    expect(sliderTrackBackgroundSize(25, 0, 100)).toBe("400% 100%");
    expect(sliderTrackBackgroundSize(100, 0, 100)).toBe("100% 100%");
  });

  it("tient compte de la borne basse", () => {
    expect(sliderTrackBackgroundSize(15, 10, 20)).toBe("200% 100%");
  });

  it("borne l'etirement au lieu de diviser par zero", () => {
    expect(sliderTrackBackgroundSize(0, 0, 100)).toBe("100% 100%");
    expect(sliderTrackBackgroundSize(5, 5, 5)).toBe("100% 100%");
    expect(sliderTrackBackgroundSize(0.001, 0, 100)).toBe("4000% 100%");
  });
});

describe("sliderMetrics", () => {
  it("fait de la pastille une pilule couchee, a chaque taille", () => {
    for (const size of ["small", "medium"] as const) {
      const { thumbWidth, thumbHeight, thumbRadius, rail } = sliderMetrics[size];
      expect(parseFloat(thumbWidth)).toBeGreaterThan(parseFloat(thumbHeight));
      expect(parseFloat(thumbRadius)).toBeCloseTo(parseFloat(thumbHeight) / 2, 5);
      expect(parseFloat(thumbHeight)).toBeGreaterThan(parseFloat(rail));
    }
  });
});
