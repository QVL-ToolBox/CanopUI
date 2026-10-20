import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CSSObject } from "@emotion/react";
import { useCard } from "../useCard";

function mockMatchMedia(reduced = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

function rootSx(flash?: "success" | "error") {
  const { result } = renderHook(() =>
    useCard({
      variant: "surface",
      tone: "neutral",
      flash,
      density: "auto",
      fill: false,
      arrow: false,
      hasHeader: false,
    }),
  );
  return result.current.rootSx as unknown as CSSObject;
}

function layer(sx: CSSObject, key: "&::before" | "&::after"): CSSObject | undefined {
  return sx[key] as CSSObject | undefined;
}

describe("Card — l'éclair", () => {
  it("laisse l'anneau transparent tant qu'il n'y a pas d'éclair", () => {
    const apres = layer(rootSx(), "&::after");

    expect(apres?.backgroundColor).toBe("transparent");
    expect(apres?.pointerEvents).toBe("none");
  });

  it("s'estompe au lieu de disparaître d'un coup", () => {
    expect(layer(rootSx("success"), "&::after")?.transition).toContain("background-color");
  });

  it("dessine un anneau, et non une ombre", () => {
    const apres = layer(rootSx("success"), "&::after");

    expect(apres?.clipPath).toContain("polygon");
    expect(apres?.boxShadow).toBeUndefined();
    expect(apres?.backgroundColor).toBe("var(--canop-palette-success-main)");
  });

  it("colore l'anneau selon l'issue", () => {
    expect(layer(rootSx("error"), "&::after")?.backgroundColor).toBe(
      "var(--canop-palette-error-main)",
    );
  });

  it("laisse le fond de la carte intact", () => {
    const avant = layer(rootSx("success"), "&::before");

    expect(avant?.clipPath).toContain("polygon");
    expect(avant?.backgroundColor).toContain("var(--canop-palette-background-paper)");
  });

  it("ne capte pas le pointeur", () => {
    expect(layer(rootSx("error"), "&::after")?.pointerEvents).toBe("none");
  });
});

describe("Card — le tremblement de l'erreur", () => {
  it("tremble sur une erreur", () => {
    mockMatchMedia(false);
    expect(rootSx("error").animation).toContain("canop-card-shake");
  });

  it("décrit le déplacement en unités relatives", () => {
    mockMatchMedia(false);
    const images = rootSx("error")["@keyframes canop-card-shake"] as CSSObject;

    expect(Object.keys(images)).toEqual(["20%", "45%", "70%", "90%"]);
    for (const etape of Object.values(images)) {
      expect((etape as CSSObject).transform).toMatch(/rem\)$/);
    }
  });

  it("ne tremble pas sur une réussite", () => {
    mockMatchMedia(false);
    expect(rootSx("success").animation).toBeUndefined();
  });

  it("ne tremble pas du tout en mouvement réduit", () => {
    mockMatchMedia(true);
    const sx = rootSx("error");

    expect(sx.animation).toBeUndefined();
    expect((sx["&::after"] as CSSObject).backgroundColor).toBe("var(--canop-palette-error-main)");
  });

  it("ne fond pas non plus en mouvement réduit, mais l'anneau reste", () => {
    mockMatchMedia(true);
    const apres = layer(rootSx("success"), "&::after");

    expect(apres?.transition).toBeUndefined();
    expect(apres?.backgroundColor).toBe("var(--canop-palette-success-main)");
  });
});
