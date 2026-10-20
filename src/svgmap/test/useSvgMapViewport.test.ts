import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSvgMapViewport } from "../useSvgMapViewport";
import { parseViewBox } from "../viewBox";

const VUE = "0 0 800 400";

function trace(x: number, y: number, width: number, height: number) {
  return {
    getBBox: () => ({ x, y, width, height }),
  } as unknown as SVGGraphicsElement;
}

afterEach(() => {
  vi.restoreAllMocks();
});

function monter(viewBox = VUE, maxZoom?: number) {
  return renderHook(() => useSvgMapViewport({ viewBox, maxZoom }));
}

describe("useSvgMapViewport", () => {
  it("part de la vue d'ensemble", () => {
    const { result } = monter();
    expect(result.current.viewBox).toBe(VUE);
    expect(result.current.zoomed).toBe(false);
  });

  it("retombe sur une vue par défaut plutôt que de casser", () => {
    const { result } = monter("pas une vue");
    expect(parseViewBox(result.current.viewBox)).not.toBeNull();
  });

  it("zoome et se déclare zoomé", () => {
    const { result } = monter();

    act(() => result.current.zoomBy(0.5));

    expect(result.current.box.width).toBe(400);
    expect(result.current.zoomed).toBe(true);
  });

  it("revient à la vue d'ensemble", () => {
    const { result } = monter();

    act(() => result.current.zoomBy(0.25));
    act(() => result.current.reset());

    expect(result.current.viewBox).toBe(VUE);
    expect(result.current.zoomed).toBe(false);
  });

  it("respecte le zoom maximal demandé", () => {
    const { result } = monter(VUE, 2);

    act(() => result.current.zoomBy(0.01));

    expect(result.current.box.width).toBe(400);
  });

  it("se déplace", () => {
    const { result } = monter();

    act(() => result.current.zoomBy(0.5));
    const avant = result.current.box.x;
    act(() => result.current.panBy(-0.25, 0));

    expect(result.current.box.x).toBeGreaterThan(avant);
  });

  it("cadre sur les régions enregistrées", () => {
    const { result } = monter();

    act(() => {
      result.current.registerRegion("a", trace(100, 100, 20, 20));
      result.current.registerRegion("b", trace(140, 140, 20, 20));
    });
    act(() => result.current.fitTo(["a", "b"], { padding: 1 }));

    const box = result.current.box;
    expect(box.x).toBeLessThanOrEqual(100);
    expect(box.x + box.width).toBeGreaterThanOrEqual(160);
    expect(result.current.zoomed).toBe(true);
  });

  it("ignore une région inconnue et garde les autres", () => {
    const { result } = monter();

    act(() => result.current.registerRegion("a", trace(100, 100, 20, 20)));
    act(() => result.current.fitTo(["a", "fantome"], { padding: 1 }));

    expect(result.current.box.x + result.current.box.width / 2).toBeCloseTo(110, 4);
  });

  it("ne bouge pas quand aucune région n'est connue", () => {
    const { result } = monter();

    act(() => result.current.zoomBy(0.5));
    const avant = result.current.viewBox;
    act(() => result.current.fitTo(["inexistante"]));

    expect(result.current.viewBox).toBe(avant);
  });

  it("oublie un tracé démonté", () => {
    const { result } = monter();

    act(() => result.current.registerRegion("a", trace(100, 100, 20, 20)));
    act(() => result.current.registerRegion("a", null));
    act(() => result.current.fitTo(["a"]));

    expect(result.current.viewBox).toBe(VUE);
  });

  it("borne ce qu'on lui pose directement", () => {
    const { result } = monter();

    act(() => result.current.setBox({ x: -500, y: -500, width: 5_000, height: 5_000 }));

    expect(result.current.viewBox).toBe(VUE);
  });

  it("repart de la nouvelle vue d'ensemble quand le SVG change", () => {
    const { result, rerender } = renderHook(({ viewBox }) => useSvgMapViewport({ viewBox }), {
      initialProps: { viewBox: VUE },
    });

    act(() => result.current.zoomBy(0.25));
    expect(result.current.zoomed).toBe(true);

    rerender({ viewBox: "0 0 200 100" });

    expect(result.current.viewBox).toBe("0 0 200 100");
    expect(result.current.zoomed).toBe(false);
  });
});
