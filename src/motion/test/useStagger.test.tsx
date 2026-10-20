import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CanopEnterDirection, CanopEnterOffset } from "../enterOffset";
import { motionDurationSeconds, motionEasing } from "../motionTokens";
import { useStagger, type UseStaggerOptions, type UseStaggerResult } from "../useStagger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface CascadeTransition {
  staggerChildren: number;
  delayChildren: number;
}

interface ItemTarget {
  opacity: number;
  x?: string | number;
  y?: string | number;
  transition?: { duration: number; ease: number[] };
}

const DIRECTIONS: [CanopEnterDirection, CanopEnterOffset][] = [
  ["up", { y: "3rem" }],
  ["down", { y: "-3rem" }],
  ["left", { x: "3rem" }],
  ["right", { x: "-3rem" }],
];

function matchMediaMock(matchedQueries: string[]) {
  return vi.fn().mockImplementation((query: string) => ({
    matches: matchedQueries.includes(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function stagger(options?: UseStaggerOptions): UseStaggerResult {
  return renderHook(() => useStagger(options)).result.current;
}

function cascade(result: UseStaggerResult): CascadeTransition {
  const visible = result.container.variants.visible as unknown as {
    transition: CascadeTransition;
  };
  return visible.transition;
}

function itemState(result: UseStaggerResult, name: "hidden" | "visible"): ItemTarget {
  return result.item.variants[name] as unknown as ItemTarget;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useStagger - reglages par defaut", () => {
  it("declenche la cascade a l'entree dans le viewport", () => {
    const result = stagger();
    expect(result.container.initial).toBe("hidden");
    expect(result.container.whileInView).toBe("visible");
  });

  it("n'observe le viewport qu'une fois et des le premier dixieme visible", () => {
    expect(stagger().container.viewport).toEqual({ once: true, amount: 0.1 });
  });

  it("espace les enfants d'un intervalle instantane sans delai initial", () => {
    expect(cascade(stagger())).toEqual({
      staggerChildren: motionDurationSeconds.instant,
      delayChildren: 0,
    });
  });

  it("fait monter les elements depuis un rem plus bas", () => {
    expect(itemState(stagger(), "hidden")).toEqual({ opacity: 0, y: "1rem" });
  });

  it("anime l'arrivee sur la duree de base et l'easing organique", () => {
    const visible = itemState(stagger(), "visible");
    expect(visible.opacity).toBe(1);
    expect(visible.transition).toEqual({
      duration: motionDurationSeconds.base,
      ease: motionEasing.organic,
    });
  });

  it("ne signale aucun mouvement reduit par defaut", () => {
    expect(stagger().reducedMotion).toBe(false);
  });
});

describe("useStagger - reglages personnalises", () => {
  it("honore l'intervalle et le delai initial demandes", () => {
    expect(cascade(stagger({ stagger: 0.25, delayChildren: 0.75 }))).toEqual({
      staggerChildren: 0.25,
      delayChildren: 0.75,
    });
  });

  it("accepte une cascade sans intervalle", () => {
    expect(cascade(stagger({ stagger: 0 })).staggerChildren).toBe(0);
  });

  it("honore un viewport rejouable et un seuil de visibilite total", () => {
    expect(stagger({ once: false, amount: 1 }).container.viewport).toEqual({
      once: false,
      amount: 1,
    });
  });

  it("accepte un seuil de visibilite nul", () => {
    expect(stagger({ amount: 0 }).container.viewport.amount).toBe(0);
  });

  it.each(DIRECTIONS)("decale l'entree vers %s", (direction, offset) => {
    expect(itemState(stagger({ direction, distance: "3rem" }), "hidden")).toEqual({
      opacity: 0,
      ...offset,
    });
  });

  it("n'applique aucun decalage quand la direction est none", () => {
    expect(itemState(stagger({ direction: "none" }), "hidden")).toEqual({ opacity: 0 });
  });

  it("remet les elements a leur place a l'etat visible", () => {
    const visible = itemState(stagger({ direction: "left" }), "visible");
    expect(visible.x).toBe(0);
    expect(visible.y).toBe(0);
  });

  it("applique la duree et l'easing demandes", () => {
    const visible = itemState(stagger({ duration: "slower", easing: "decelerate" }), "visible");
    expect(visible.transition).toEqual({
      duration: motionDurationSeconds.slower,
      ease: motionEasing.decelerate,
    });
  });
});

describe("useStagger - mouvement reduit", () => {
  it("supprime la cascade quand le systeme demande moins d'animation", () => {
    vi.stubGlobal("matchMedia", matchMediaMock([REDUCED_MOTION_QUERY]));
    const result = stagger({ stagger: 0.5, delayChildren: 0.5 });
    expect(result.reducedMotion).toBe(true);
    expect(cascade(result)).toEqual({ staggerChildren: 0, delayChildren: 0 });
  });

  it("affiche les elements sans transparence ni decalage sous mouvement reduit", () => {
    vi.stubGlobal("matchMedia", matchMediaMock([REDUCED_MOTION_QUERY]));
    const result = stagger({ direction: "left", distance: "5rem" });
    expect(itemState(result, "hidden")).toEqual({ opacity: 1 });
    expect(itemState(result, "visible")).toEqual({ opacity: 1 });
  });

  it("supprime la cascade quand l'appelant desactive l'animation", () => {
    vi.stubGlobal("matchMedia", matchMediaMock([]));
    const result = stagger({ stagger: 0.5, delayChildren: 0.5, disabled: true });
    expect(result.reducedMotion).toBe(true);
    expect(cascade(result)).toEqual({ staggerChildren: 0, delayChildren: 0 });
    expect(itemState(result, "hidden")).toEqual({ opacity: 1 });
  });

  it("conserve les reglages de viewport malgre le mouvement reduit", () => {
    vi.stubGlobal("matchMedia", matchMediaMock([REDUCED_MOTION_QUERY]));
    expect(stagger({ once: false, amount: 0.5 }).container.viewport).toEqual({
      once: false,
      amount: 0.5,
    });
  });

  it("anime normalement quand le systeme n'exprime aucune preference", () => {
    vi.stubGlobal("matchMedia", matchMediaMock([]));
    const result = stagger({ stagger: 0.3 });
    expect(result.reducedMotion).toBe(false);
    expect(cascade(result).staggerChildren).toBe(0.3);
  });
});
