import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";
import { HalloweenDecor } from "../../../index";
import {
  MACHINE_PUISSANTE,
  mockMatchMedia,
  preparerDecorDeterministe,
  quitterDecor,
  renderDecor,
  simulerMachine,
  type MachineSimulee,
} from "../../../test/halloweenDecorTestKit";
import { installerIntersectionObserver } from "../../ShapeBackground/test/lavaTestKit";

const PROPRIETES_ANIMABLES = new Set(["transform", "opacity", "animation-timing-function"]);

function decorLayers(): HTMLElement[] {
  return Array.from(
    document.body.querySelectorAll<HTMLElement>('[aria-hidden="true"][data-paused]'),
  );
}

function elementsDuDecor(): Element[] {
  return decorLayers().flatMap((layer) => [layer, ...Array.from(layer.querySelectorAll("*"))]);
}

function acteursVisibles(): number {
  return decorLayers().reduce((total, layer) => total + layer.querySelectorAll("svg").length, 0);
}

function reglesDeStyle(regles: CSSRuleList): CSSStyleRule[] {
  return Array.from(regles).flatMap((regle) => {
    if (regle instanceof CSSStyleRule) return [regle];
    if (regle instanceof CSSMediaRule || regle instanceof CSSSupportsRule) {
      return reglesDeStyle(regle.cssRules);
    }
    return [];
  });
}

function toutesLesReglesDeStyle(): CSSStyleRule[] {
  return Array.from(document.styleSheets).flatMap((feuille) => reglesDeStyle(feuille.cssRules));
}

function nomsAnimation(regle: CSSStyleRule): string[] {
  const nom =
    regle.style.getPropertyValue("animation-name") ||
    regle.style.getPropertyValue("animation").split(" ")[0] ||
    "";
  return nom === "" || nom === "none" ? [] : [nom];
}

interface CibleAnimee {
  element: Element;
  animation: string;
}

function ciblesAnimees(): CibleAnimee[] {
  const elements = elementsDuDecor();
  return toutesLesReglesDeStyle().flatMap((regle) =>
    nomsAnimation(regle).flatMap((animation) =>
      elements
        .filter((element) => element.matches(regle.selectorText))
        .map((element) => ({ element, animation })),
    ),
  );
}

function keyframesNommees(noms: Set<string>): CSSKeyframesRule[] {
  return Array.from(document.styleSheets)
    .flatMap((feuille) => Array.from(feuille.cssRules))
    .filter(
      (regle): regle is CSSKeyframesRule =>
        regle instanceof CSSKeyframesRule && noms.has(regle.name),
    );
}

function sansPrefixeVendeur(propriete: string): string {
  return propriete.replace(/^-(webkit|moz|ms|o)-/, "");
}

function proprietesAnimees(keyframes: CSSKeyframesRule): string[] {
  return Array.from(keyframes.cssRules).flatMap((image) =>
    Array.from((image as CSSKeyframeRule).style).map(sansPrefixeVendeur),
  );
}

function matchMediaEcranEtroit() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function acteursSur(machine: MachineSimulee): number {
  simulerMachine(machine);
  const { unmount } = renderDecor(<HalloweenDecor density="medium" />);
  const total = acteursVisibles();
  unmount();
  return total;
}

afterEach(() => {
  quitterDecor();
  vi.useRealTimers();
});

describe("AC1 — acteurs animes en HTML, SVG statiques", () => {
  beforeEach(() => {
    preparerDecorDeterministe();
    mockMatchMedia(false);
  });

  it.each(["low", "medium"] as const)(
    "n'anime aucun element SVG du decor en densite %s",
    (density) => {
      renderDecor(<HalloweenDecor density={density} />);

      const cibles = ciblesAnimees();
      expect(cibles.length).toBeGreaterThan(0);
      cibles.forEach(({ element }) => expect(element).not.toBeInstanceOf(SVGElement));
    },
  );

  it("n'anime que des wrappers span ou div", () => {
    renderDecor(<HalloweenDecor density="medium" />);

    ciblesAnimees().forEach(({ element }) => expect(["SPAN", "DIV"]).toContain(element.tagName));
  });

  it("n'anime que transform et opacity dans les keyframes du decor", () => {
    renderDecor(<HalloweenDecor density="medium" />);

    const noms = new Set(ciblesAnimees().map(({ animation }) => animation));
    const keyframes = keyframesNommees(noms);
    expect(keyframes.length).toBeGreaterThan(0);
    keyframes.forEach((regle) =>
      proprietesAnimees(regle).forEach((propriete) =>
        expect(PROPRIETES_ANIMABLES).toContain(propriete),
      ),
    );
  });

  it("ne contient aucune animation SMIL dans les SVG du decor", () => {
    renderDecor(<HalloweenDecor density="medium" />);

    const smil = decorLayers().flatMap((layer) =>
      Array.from(layer.querySelectorAll("animate, animateTransform, animateMotion, set")),
    );
    expect(smil).toEqual([]);
  });
});

describe("AC1 — montage differe des acteurs", () => {
  beforeEach(() => {
    simulerMachine(MACHINE_PUISSANTE);
    mockMatchMedia(false);
  });

  it("attend requestIdleCallback avant de monter les acteurs", () => {
    const rappels: IdleRequestCallback[] = [];
    vi.stubGlobal(
      "requestIdleCallback",
      vi.fn((rappel: IdleRequestCallback) => rappels.push(rappel)),
    );
    vi.stubGlobal("cancelIdleCallback", vi.fn());

    renderDecor(<HalloweenDecor density="medium" />);

    expect(acteursVisibles()).toBe(0);
    expect(rappels.length).toBeGreaterThan(0);

    act(() => rappels.forEach((rappel) => rappel({ didTimeout: false, timeRemaining: () => 50 })));

    expect(acteursVisibles()).toBeGreaterThan(0);
  });

  it("monte les acteurs apres 200 ms sans requestIdleCallback", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    vi.stubGlobal("requestIdleCallback", undefined);

    renderDecor(<HalloweenDecor density="medium" />);
    expect(acteursVisibles()).toBe(0);

    act(() => vi.advanceTimersByTime(199));
    expect(acteursVisibles()).toBe(0);

    act(() => vi.advanceTimersByTime(1));
    expect(acteursVisibles()).toBeGreaterThan(0);
  });
});

describe("AC1 — nombre d'acteurs reduit sur petit ecran ou machine modeste", () => {
  beforeEach(() => {
    preparerDecorDeterministe();
    mockMatchMedia(false);
  });

  it.each<[string, MachineSimulee]>([
    ["2 coeurs", { coeurs: 2, memoireGo: 8 }],
    ["1 coeur", { coeurs: 1, memoireGo: 8 }],
    ["2 Go", { coeurs: 8, memoireGo: 2 }],
    ["1 Go", { coeurs: 8, memoireGo: 1 }],
  ])("reduit les acteurs sur une machine a %s", (_label, machine) => {
    const complet = acteursSur(MACHINE_PUISSANTE);

    expect(acteursSur(machine)).toBeLessThan(complet);
  });

  it.each<[string, MachineSimulee]>([
    ["4 coeurs et 4 Go", { coeurs: 4, memoireGo: 4 }],
    ["3 coeurs et 3 Go", { coeurs: 3, memoireGo: 3 }],
  ])("garde le decor complet sur une machine a %s", (_label, machine) => {
    const complet = acteursSur(MACHINE_PUISSANTE);

    expect(acteursSur(machine)).toBe(complet);
  });

  it("garde le decor complet quand deviceMemory n'est pas expose", () => {
    const complet = acteursSur(MACHINE_PUISSANTE);
    Reflect.deleteProperty(navigator, "deviceMemory");
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });

    const { unmount } = renderDecor(<HalloweenDecor density="medium" />);

    expect(acteursVisibles()).toBe(complet);
    unmount();
  });

  it("reduit les acteurs sous le point de rupture sm", () => {
    const complet = acteursSur(MACHINE_PUISSANTE);
    matchMediaEcranEtroit();

    expect(acteursSur(MACHINE_PUISSANTE)).toBeLessThan(complet);
  });

  it("garde des acteurs sur une machine modeste", () => {
    expect(acteursSur({ coeurs: 2, memoireGo: 2 })).toBeGreaterThan(0);
  });
});

describe("AC1 — pause hors ecran", () => {
  beforeEach(() => {
    preparerDecorDeterministe();
    mockMatchMedia(false);
  });

  it.each(["container", "viewport"] as const)(
    "met les calques en pause quand le decor sort de l'ecran en scope %s",
    (scope) => {
      const visibilite = installerIntersectionObserver();
      renderDecor(<HalloweenDecor scope={scope} />);

      visibilite.masquer();

      expect(decorLayers().length).toBeGreaterThan(0);
      decorLayers().forEach((layer) => expect(layer).toHaveAttribute("data-paused", "true"));
    },
  );

  it.each(["container", "viewport"] as const)(
    "reprend les calques quand le decor revient a l'ecran en scope %s",
    (scope) => {
      const visibilite = installerIntersectionObserver();
      renderDecor(<HalloweenDecor scope={scope} />);
      visibilite.masquer();

      visibilite.afficher();

      decorLayers().forEach((layer) => expect(layer).toHaveAttribute("data-paused", "false"));
    },
  );
});

describe("AC1 — mouvement reduit sur machine modeste", () => {
  it("n'anime rien sous mouvement reduit meme sur machine modeste", () => {
    preparerDecorDeterministe({ coeurs: 2, memoireGo: 2 });
    mockMatchMedia(true);

    renderDecor(<HalloweenDecor density="medium" />);

    expect(acteursVisibles()).toBeGreaterThan(0);
    expect(ciblesAnimees()).toEqual([]);
  });
});
