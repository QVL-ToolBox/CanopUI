import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup } from "@testing-library/react";
import { ThemeProvider, useTheme, type Theme } from "@mui/material/styles";
import { HalloweenDecor, tokens, type CanopHalloweenDecorDensity } from "../../../index";
import { reglesEmises, type CanopRegleEmise } from "../../../test/cssRules";
import {
  mockMatchMedia,
  renderDecor,
  runningAnimations,
} from "../../../test/halloweenDecorTestKit";

const densities: CanopHalloweenDecorDensity[] = ["low", "medium"];
const spiderSelector = 'svg:has([data-part="legs"])';
const webSelector = 'svg:has([data-part="strand"])';
const witchSelector = 'svg:has([data-part="hat"])';
const smBreakpointRem = tokens.breakpoints.values.sm;

function decorLayers(): HTMLElement[] {
  return Array.from(
    document.body.querySelectorAll<HTMLElement>('[aria-hidden="true"][data-paused]'),
  );
}

function layerHolding(selector: string): HTMLElement {
  const layer = decorLayers().find((candidate) => candidate.querySelector(selector));
  if (!layer) throw new Error(`calque contenant ${selector} introuvable`);
  return layer;
}

function upperLayer(): HTMLElement {
  return layerHolding(spiderSelector);
}

function backdropLayer(): HTMLElement {
  return layerHolding(webSelector);
}

function setDocumentVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => state === "hidden" });
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

function pausesDescendants(rule: CanopRegleEmise): boolean {
  return (
    rule.conditions.length === 0 &&
    rule.style.getPropertyValue("animation-play-state") === "paused" &&
    rule.style.getPropertyPriority("animation-play-state") === "important"
  );
}

function descendantsArePaused(layer: HTMLElement): boolean {
  return reglesEmises(layer)
    .filter(pausesDescendants)
    .some((rule) =>
      Array.from(layer.querySelectorAll("*")).some((descendant) =>
        descendant.matches(rule.selecteur),
      ),
    );
}

function maxWidthRem(condition: string): number | null {
  const match = condition.match(/max-width\s*:\s*([\d.]+)rem/);
  return match ? Number(match[1]) : null;
}

function isBelowSm(rule: CSSRule): rule is CSSMediaRule {
  if (!(rule instanceof CSSMediaRule)) return false;
  const limit = maxWidthRem(rule.conditionText);
  return limit !== null && limit < smBreakpointRem;
}

function hidesElement(rule: CSSRule): rule is CSSStyleRule {
  return rule instanceof CSSStyleRule && rule.style.getPropertyValue("display") === "none";
}

function selectorsHiddenBelowSm(): string[] {
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .filter(isBelowSm)
    .flatMap((media) => Array.from(media.cssRules))
    .filter(hidesElement)
    .map((rule) => rule.selectorText);
}

function isHiddenBelowSm(element: Element): boolean {
  return selectorsHiddenBelowSm().some((selector) => element.matches(selector));
}

function hiddenBelowSm(layer: HTMLElement): HTMLElement[] {
  const selectors = selectorsHiddenBelowSm();
  return Array.from(layer.querySelectorAll<HTMLElement>("*")).filter((element) =>
    selectors.some((selector) => element.matches(selector)),
  );
}

function anchorOf(element: HTMLElement): "left" | "right" {
  const base = reglesEmises(element).filter((rule) => rule.conditions.length === 0);
  const anchoredLeft = base.some((rule) => rule.style.getPropertyValue("left") !== "");
  const anchoredRight = base.some((rule) => rule.style.getPropertyValue("right") !== "");
  if (anchoredLeft === anchoredRight) throw new Error("ancrage horizontal indetermine");
  return anchoredLeft ? "left" : "right";
}

function placedAncestor(element: Element, layer: HTMLElement): HTMLElement {
  let current = element.parentElement;
  while (current && current !== layer) {
    if (current.parentElement === layer) return current;
    current = current.parentElement;
  }
  throw new Error("element hors du calque");
}

function spidersOf(layer: HTMLElement): HTMLElement[] {
  return Array.from(layer.querySelectorAll(spiderSelector)).map((spider) =>
    placedAncestor(spider, layer),
  );
}

function websOf(layer: HTMLElement): HTMLElement[] {
  return Array.from(layer.querySelectorAll(webSelector)).map((web) => placedAncestor(web, layer));
}

function ThemeTooltipProbe({ onTheme }: { onTheme: (theme: Theme) => void }) {
  onTheme(useTheme());
  return null;
}

function renderedTooltipZIndex(): number {
  let tooltip = Number.NaN;
  renderDecor(<ThemeTooltipProbe onTheme={(theme) => (tooltip = theme.zIndex.tooltip)} />);
  return tooltip;
}

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "visibilityState");
  Reflect.deleteProperty(document, "hidden");
});

describe("HalloweenDecor — pause quand l'onglet est masque", () => {
  it("expose data-paused a false sur les deux calques quand l'onglet est visible", () => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor />);

    expect(decorLayers()).toHaveLength(2);
    decorLayers().forEach((layer) => expect(layer).toHaveAttribute("data-paused", "false"));
  });

  it.each(["container", "viewport"] as const)(
    "met en pause les deux calques quand l'onglet passe a hidden en scope %s",
    (scope) => {
      mockMatchMedia(false);
      renderDecor(<HalloweenDecor scope={scope} />);

      setDocumentVisibility("hidden");

      expect(decorLayers()).toHaveLength(2);
      decorLayers().forEach((layer) => expect(layer).toHaveAttribute("data-paused", "true"));
    },
  );

  it("reprend les animations des deux calques quand l'onglet redevient visible", () => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor />);
    setDocumentVisibility("hidden");

    setDocumentVisibility("visible");

    decorLayers().forEach((layer) => expect(layer).toHaveAttribute("data-paused", "false"));
  });

  it("injecte animation-play-state paused !important sur les descendants des calques en pause", () => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor />);

    setDocumentVisibility("hidden");

    decorLayers().forEach((layer) => expect(descendantsArePaused(layer)).toBe(true));
  });

  it("ne fige aucun descendant des calques tant que l'onglet est visible", () => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor />);

    decorLayers().forEach((layer) => expect(descendantsArePaused(layer)).toBe(false));
  });
});

describe("HalloweenDecor — calque superieur de la sorciere et des araignees", () => {
  it("place le calque superieur au z-index tooltip + 1 du theme", () => {
    mockMatchMedia(false);
    const tooltip = renderedTooltipZIndex();
    renderDecor(<HalloweenDecor />);

    expect(Number.isFinite(tooltip)).toBe(true);
    expect(upperLayer()).toHaveStyle({ zIndex: String(tooltip + 1) });
  });

  it("suit le z-index tooltip d'un theme surcharge", () => {
    mockMatchMedia(false);
    renderDecor(
      <ThemeProvider
        theme={(outer: Theme) => ({ ...outer, zIndex: { ...outer.zIndex, tooltip: 4242 } })}
      >
        <HalloweenDecor />
      </ThemeProvider>,
    );

    expect(upperLayer()).toHaveStyle({ zIndex: "4243" });
  });

  it("monte le calque superieur sous document.body hors du conteneur en scope viewport", () => {
    mockMatchMedia(false);
    const { container } = renderDecor(<HalloweenDecor scope="viewport" />);

    expect(document.body).toContainElement(upperLayer());
    expect(container).not.toContainElement(upperLayer());
  });

  it("garde le calque superieur dans la racine du decor en scope container", () => {
    mockMatchMedia(false);
    const { container } = renderDecor(<HalloweenDecor scope="container" />);

    expect(container).toContainElement(upperLayer());
    expect(upperLayer().parentElement).toBe(backdropLayer().parentElement);
  });

  it("utilise le scope container par defaut", () => {
    mockMatchMedia(false);
    const { container } = renderDecor(<HalloweenDecor />);

    expect(container).toContainElement(upperLayer());
  });

  it.each(["container", "viewport"] as const)(
    "masque le calque superieur aux technologies d'assistance en scope %s",
    (scope) => {
      mockMatchMedia(false);
      renderDecor(<HalloweenDecor scope={scope} />);

      expect(upperLayer()).toHaveAttribute("aria-hidden", "true");
    },
  );

  it.each(["container", "viewport"] as const)(
    "rend le calque superieur transparent aux clics en scope %s",
    (scope) => {
      mockMatchMedia(false);
      renderDecor(<HalloweenDecor scope={scope} />);

      expect(upperLayer()).toHaveStyle({ pointerEvents: "none" });
    },
  );

  it.each(densities)(
    "rend la sorciere et les araignees dans le calque superieur en %s",
    (density) => {
      mockMatchMedia(false);
      renderDecor(<HalloweenDecor density={density} />);

      expect(upperLayer().querySelectorAll(witchSelector)).toHaveLength(1);
      expect(spidersOf(upperLayer()).length).toBeGreaterThan(0);
    },
  );
});

describe("HalloweenDecor — calque superieur en mouvement reduit", () => {
  it.each(densities)("ne rend pas la sorciere sous prefers-reduced-motion en %s", (density) => {
    mockMatchMedia(true);
    renderDecor(<HalloweenDecor density={density} />);

    expect(upperLayer().querySelectorAll(witchSelector)).toHaveLength(0);
  });

  it.each(densities)("garde les araignees sous prefers-reduced-motion en %s", (density) => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor density={density} />);
    const animatedSpiders = spidersOf(upperLayer()).length;
    cleanup();

    mockMatchMedia(true);
    renderDecor(<HalloweenDecor density={density} />);

    expect(spidersOf(upperLayer())).toHaveLength(animatedSpiders);
  });

  it("anime le calque superieur hors mouvement reduit", () => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor />);

    expect(runningAnimations(upperLayer()).length).toBeGreaterThan(0);
  });

  it.each(densities)(
    "n'active aucune animation dans le calque superieur sous prefers-reduced-motion en %s",
    (density) => {
      mockMatchMedia(true);
      renderDecor(<HalloweenDecor density={density} />);

      expect(runningAnimations(upperLayer())).toEqual([]);
    },
  );
});

describe("HalloweenDecor — affichage mobile", () => {
  it.each(densities)("masque la toile de gauche sous le point de rupture sm en %s", (density) => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor density={density} />);

    const hiddenWebs = websOf(backdropLayer()).filter(isHiddenBelowSm);
    expect(hiddenWebs).toHaveLength(1);
    expect(anchorOf(hiddenWebs[0])).toBe("left");
  });

  it.each(densities)("garde la toile de droite sous le point de rupture sm en %s", (density) => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor density={density} />);

    const rightWebs = websOf(backdropLayer()).filter((web) => anchorOf(web) === "right");
    expect(rightWebs).toHaveLength(1);
    rightWebs.forEach((web) => expect(isHiddenBelowSm(web)).toBe(false));
  });

  it.each(densities)(
    "masque les araignees de gauche et elles seules sous le point de rupture sm en %s",
    (density) => {
      mockMatchMedia(false);
      renderDecor(<HalloweenDecor density={density} />);

      spidersOf(upperLayer()).forEach((spider) =>
        expect(isHiddenBelowSm(spider)).toBe(anchorOf(spider) === "left"),
      );
    },
  );

  it("ne masque sous sm que la toile et l'araignee de gauche", () => {
    mockMatchMedia(false);
    renderDecor(<HalloweenDecor density="medium" />);

    expect(hiddenBelowSm(backdropLayer())).toEqual(
      websOf(backdropLayer()).filter((web) => anchorOf(web) === "left"),
    );
    const leftSpiders = spidersOf(upperLayer()).filter((spider) => anchorOf(spider) === "left");
    expect(leftSpiders).toHaveLength(1);
    expect(hiddenBelowSm(upperLayer())).toEqual(leftSpiders);
  });
});
