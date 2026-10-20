import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { tokens } from "../../tokens";
import { useBreakpoint, useBreakpointDown, useBreakpointUp } from "../useBreakpoint";

function fenetreDe(largeurRem: number) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((requete: string) => {
      const min = requete.match(/min-width:\s*([\d.]+)rem/);
      const max = requete.match(/max-width:\s*([\d.]+)rem/);
      const matches = min
        ? largeurRem >= Number(min[1])
        : max
          ? largeurRem <= Number(max[1])
          : false;
      return {
        matches,
        media: requete,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });
}

describe("useBreakpointDown", () => {
  beforeEach(() => fenetreDe(0));

  it("est vrai sous la borne", () => {
    fenetreDe(40);
    expect(renderHook(() => useBreakpointDown("md")).result.current).toBe(true);
  });

  it("est faux au-dessus", () => {
    fenetreDe(80);
    expect(renderHook(() => useBreakpointDown("md")).result.current).toBe(false);
  });

  it("est faux **a** la borne : les deux sens ne peuvent pas etre vrais ensemble", () => {
    fenetreDe(tokens.breakpoints.values.md);
    const bas = renderHook(() => useBreakpointDown("md")).result.current;
    const haut = renderHook(() => useBreakpointUp("md")).result.current;

    expect(bas).toBe(false);
    expect(haut).toBe(true);
  });
});

describe("useBreakpointUp", () => {
  it("est vrai des la borne atteinte", () => {
    fenetreDe(64);
    expect(renderHook(() => useBreakpointUp("md")).result.current).toBe(true);
  });

  it("est faux juste en dessous", () => {
    fenetreDe(63.99);
    expect(renderHook(() => useBreakpointUp("md")).result.current).toBe(false);
  });
});

describe("useBreakpoint", () => {
  it("nomme le palier courant, du plus large satisfait au plus etroit", () => {
    const cas: [number, string][] = [
      [20, "xs"],
      [40, "sm"],
      [70, "md"],
      [100, "lg"],
    ];
    for (const [largeur, attendu] of cas) {
      fenetreDe(largeur);
      expect(renderHook(() => useBreakpoint()).result.current).toBe(attendu);
    }
  });
});

describe("les bornes suivent le theme", () => {
  it("interroge la largeur en rem, jamais en pixels", () => {
    fenetreDe(50);
    const espion = window.matchMedia as unknown as ReturnType<typeof vi.fn>;
    renderHook(() => useBreakpointDown("md"));

    expect(espion).toHaveBeenCalledWith(expect.stringContaining("rem"));
    expect(espion).not.toHaveBeenCalledWith(expect.stringContaining("px"));
  });
});
