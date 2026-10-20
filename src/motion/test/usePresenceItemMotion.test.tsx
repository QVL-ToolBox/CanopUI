import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { motionDurationSeconds, motionEasing } from "../motionTokens";
import { reducedOverlayMotion } from "../overlayMotion";
import { PresenceStaggerContext } from "../presenceStagger";
import { useEnterAnimation } from "../useEnterAnimation";
import { usePresenceItemMotion, type PresenceItemMotion } from "../usePresenceItemMotion";
import { mockReducedMotion } from "./presenceTestKit";

function presenceMotion(layout: boolean, delay = 0): PresenceItemMotion {
  return renderHook(() => usePresenceItemMotion(layout), {
    wrapper: ({ children }) => (
      <PresenceStaggerContext.Provider value={delay}>{children}</PresenceStaggerContext.Provider>
    ),
  }).result.current;
}

function transitionOf(motion: PresenceItemMotion): Record<string, unknown> {
  return motion.transition as Record<string, unknown>;
}

describe("usePresenceItemMotion - mouvement standard", () => {
  beforeEach(() => {
    mockReducedMotion(false);
  });

  it("part transparent et un demi rem plus bas", () => {
    expect(presenceMotion(false).initial).toEqual({ opacity: 0, y: "0.5rem" });
  });

  it("delegue l'entree a useEnterAnimation", () => {
    const enter = renderHook(() => useEnterAnimation({ distance: "0.5rem" })).result.current;
    const motion = presenceMotion(false);
    expect(motion.initial).toEqual(enter.initial);
    expect(motion.animate).toEqual(enter.animate);
    expect(motion.transition).toEqual({ ...enter.transition, layout: transitionOf(motion).layout });
  });

  it("anime la place sur la duree de base et l'easing organic, sans delai", () => {
    expect(transitionOf(presenceMotion(true)).layout).toEqual({
      duration: motionDurationSeconds.base,
      ease: motionEasing.organic,
    });
  });

  it("sort transparent, retreci et decale d'un rem et demi vers la droite", () => {
    expect(presenceMotion(false).exit).toMatchObject({ opacity: 0, scale: 0.97, x: "1.5rem" });
  });

  it("sort sur la duree de base et l'easing accelerate", () => {
    expect(presenceMotion(false).exit.transition).toEqual({
      duration: motionDurationSeconds.base,
      ease: motionEasing.accelerate,
    });
  });

  it("anime la position quand le layout est demande", () => {
    expect(presenceMotion(true).layout).toBe("position");
  });

  it("n'anime pas le layout par defaut", () => {
    expect(presenceMotion(false).layout).toBe(false);
  });
});

describe("usePresenceItemMotion - decalage d'entree", () => {
  beforeEach(() => {
    mockReducedMotion(false);
  });

  it("retarde l'entree du delai de decalage recu", () => {
    expect(presenceMotion(true, 0.2).transition).toMatchObject({ delay: 0.2 });
  });

  it("ne retarde jamais l'animation de place", () => {
    const layout = transitionOf(presenceMotion(true, 0.2)).layout as Record<string, unknown>;
    expect(layout.delay ?? 0).toBe(0);
  });

  it("ne retarde pas l'entree sans decalage", () => {
    const transition = transitionOf(presenceMotion(true, 0));
    expect(transition.delay ?? 0).toBe(0);
  });
});

describe("usePresenceItemMotion - mouvement reduit", () => {
  beforeEach(() => {
    mockReducedMotion(true);
  });

  it("n'anime pas l'entree", () => {
    expect(presenceMotion(false).initial).toBe(false);
  });

  it("sort instantanement comme les overlays reduits", () => {
    const exit = presenceMotion(false).exit;
    expect(exit).toEqual(reducedOverlayMotion.exit);
    expect(exit.transition).toEqual({ duration: 0 });
  });

  it("ignore le delai de decalage", () => {
    const transition = transitionOf(presenceMotion(false, 0.2));
    expect(transition.delay ?? 0).toBe(0);
  });

  it("force l'absence d'animation de layout meme si elle est demandee", () => {
    expect(presenceMotion(true).layout).toBe(false);
  });
});
