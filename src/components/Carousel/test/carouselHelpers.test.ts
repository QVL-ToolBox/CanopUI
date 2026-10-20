import { describe, expect, it } from "vitest";
import {
  CAROUSEL_SWIPE_DISTANCE,
  clampIndex,
  slideTransform,
  stepIndex,
  swipeDirection,
} from "../carouselHelpers";

describe("clampIndex", () => {
  it("ramene un index hors bornes dans la plage", () => {
    expect(clampIndex(-3, 4)).toBe(0);
    expect(clampIndex(9, 4)).toBe(3);
    expect(clampIndex(2, 4)).toBe(2);
  });

  it("renvoie zero sans carte, plutot qu'un index negatif", () => {
    expect(clampIndex(2, 0)).toBe(0);
  });
});

describe("stepIndex", () => {
  it("bute aux extremites sans boucle", () => {
    expect(stepIndex(0, 3, -1, false)).toBe(0);
    expect(stepIndex(2, 3, 1, false)).toBe(2);
  });

  it("repart de l'autre bord en boucle", () => {
    expect(stepIndex(0, 3, -1, true)).toBe(2);
    expect(stepIndex(2, 3, 1, true)).toBe(0);
  });
});

describe("slideTransform", () => {
  it("deplace sur l'axe horizontal par defaut", () => {
    expect(slideTransform(1, "horizontal")).toBe("translateX(100%)");
    expect(slideTransform(-2, "horizontal")).toBe("translateX(-200%)");
  });

  it("deplace sur l'axe vertical", () => {
    expect(slideTransform(1, "vertical")).toBe("translateY(100%)");
  });

  it("laisse la carte active en place", () => {
    expect(slideTransform(0, "horizontal")).toBe("translateX(0%)");
  });
});

describe("swipeDirection", () => {
  it("avance vers la gauche, recule vers la droite", () => {
    expect(swipeDirection(-120, 0, "horizontal")).toBe(1);
    expect(swipeDirection(120, 0, "horizontal")).toBe(-1);
  });

  it("ignore un geste sous le seuil", () => {
    expect(swipeDirection(-(CAROUSEL_SWIPE_DISTANCE - 1), 0, "horizontal")).toBe(0);
  });

  it("ignore un geste surtout perpendiculaire", () => {
    expect(swipeDirection(-60, 200, "horizontal")).toBe(0);
    expect(swipeDirection(200, -60, "vertical")).toBe(0);
  });

  it("lit l'axe vertical quand le carrousel est vertical", () => {
    expect(swipeDirection(0, -120, "vertical")).toBe(1);
    expect(swipeDirection(0, 120, "vertical")).toBe(-1);
  });
});
