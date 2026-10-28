import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { render, renderHook } from "@testing-library/react";
import * as canopUi from "../../index";
import {
  CanopThemeProvider,
  LiquidGlassLayers,
  liquidGlassBackdropFilter,
  liquidGlassBackground,
  liquidGlassFallbackBackground,
  useRefractionFilter,
  useRefractionSupport,
  type CanopLiquidGlassParams,
} from "../../index";
import { declarerMarques, revenirAJsdom, simulerChromium } from "../../test/liquidGlassTestKit";

const PARAMETRES: CanopLiquidGlassParams = {
  blur: 0.25,
  saturation: 1.8,
  veil: 0,
  tint: 15,
  bevel: 2.25,
  displacement: 25,
  dispersion: 0.17,
  specular: 0.35,
  reflection: 0,
  innerShadow: 0.35,
};

const OPTIONS_DE_REFRACTION = {
  radius: "var(--canop-radius-xl)",
  bevel: PARAMETRES.bevel,
  displacement: PARAMETRES.displacement,
  dispersion: PARAMETRES.dispersion,
};

const FILTRE = {
  id: "canop-liquid-essai",
  map: "data:image/png;base64,AAAA",
  width: 320,
  height: 200,
  displacement: 25,
  dispersion: 0.17,
};

afterEach(revenirAJsdom);

describe("AC8 - exports publics du verre liquide", () => {
  it.each([
    "liquidGlassBackground",
    "liquidGlassFallbackBackground",
    "liquidGlassBackdropFilter",
    "LiquidGlassLayers",
    "useRefractionFilter",
    "useRefractionSupport",
  ])("exporte %s depuis le point d'entree de la librairie", (nom) => {
    expect(typeof (canopUi as Record<string, unknown>)[nom]).toBe("function");
  });

  it("exporte le type CanopLiquidGlassParams", () => {
    expectTypeOf<CanopLiquidGlassParams>().toHaveProperty("blur").toEqualTypeOf<number>();
    expectTypeOf<CanopLiquidGlassParams>().toHaveProperty("saturation").toEqualTypeOf<number>();
  });
});

describe("AC8 - recettes CSS du verre liquide", () => {
  it("compose un flou et une saturation sans url() par defaut", () => {
    const flou = liquidGlassBackdropFilter(PARAMETRES);
    expect(flou).toContain("blur(");
    expect(flou).toContain("saturate(");
    expect(flou).not.toContain("url(");
  });

  it("place la reference au filtre de refraction devant le flou", () => {
    const flou = liquidGlassBackdropFilter(PARAMETRES, "canop-liquid-essai");
    expect(flou.startsWith("url(#canop-liquid-essai) ")).toBe(true);
    expect(flou).toBe(`url(#canop-liquid-essai) ${liquidGlassBackdropFilter(PARAMETRES)}`);
  });

  it("produit une teinte en degrade", () => {
    expect(liquidGlassBackground(PARAMETRES)).toMatch(/linear-gradient\(/);
  });

  it("repose le repli sur une surface opaque", () => {
    const repli = liquidGlassFallbackBackground(PARAMETRES);
    expect(repli).toContain(liquidGlassBackground(PARAMETRES));
    expect(repli.trim().endsWith("var(--canop-palette-surface-base)")).toBe(true);
  });
});

describe("AC8 - useRefractionSupport", () => {
  it("repond fallback en jsdom", () => {
    expect(renderHook(() => useRefractionSupport()).result.current).toBe("fallback");
  });

  it("repond refraction quand on simule Chromium", () => {
    simulerChromium();
    expect(renderHook(() => useRefractionSupport()).result.current).toBe("refraction");
  });

  it("repond fallback pour un navigateur dont aucune marque n'est Chromium", () => {
    simulerChromium();
    declarerMarques(["Not=A?Brand"]);
    expect(renderHook(() => useRefractionSupport()).result.current).toBe("fallback");
  });

  it("repond fallback quand il est desactive meme sous Chromium", () => {
    simulerChromium();
    expect(renderHook(() => useRefractionSupport(false)).result.current).toBe("fallback");
  });
});

describe("AC8 - useRefractionFilter", () => {
  it("ne produit aucun filtre quand il est desactive", () => {
    simulerChromium();
    const { result } = renderHook(() =>
      useRefractionFilter({ enabled: false, ...OPTIONS_DE_REFRACTION }),
    );
    expect(result.current.filter).toBeNull();
  });

  it("ne plante pas sans ResizeObserver", () => {
    simulerChromium();
    vi.stubGlobal("ResizeObserver", undefined);
    const element = document.createElement("div");
    document.body.append(element);
    const { result } = renderHook(() =>
      useRefractionFilter({ enabled: true, ...OPTIONS_DE_REFRACTION }),
    );
    expect(() => result.current.ref?.(element)).not.toThrow();
    element.remove();
  });
});

describe("AC8 - LiquidGlassLayers", () => {
  function poserCalques(filter: typeof FILTRE | null) {
    const { container } = render(
      <CanopThemeProvider>
        <LiquidGlassLayers params={PARAMETRES} radius="var(--canop-radius-xl)" filter={filter} />
      </CanopThemeProvider>,
    );
    return container.firstElementChild as HTMLElement;
  }

  it("rend un calque masque aux technologies d'assistance sans SVG sans filtre", () => {
    const calque = poserCalques(null);
    expect(calque).toHaveAttribute("aria-hidden", "true");
    expect(getComputedStyle(calque).pointerEvents).toBe("none");
    expect(calque.querySelector("svg")).toBeNull();
  });

  it("rend le filtre feDisplacementMap sous l'id fourni", () => {
    const calque = poserCalques(FILTRE);
    const filtre = calque.querySelector("filter");
    expect(filtre?.id).toBe(FILTRE.id);
    expect(filtre?.querySelector("feDisplacementMap")).not.toBeNull();
  });
});
