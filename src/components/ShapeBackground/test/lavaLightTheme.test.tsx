import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { CanopThemeProvider } from "../../../theme";
import { lavaGlowSx } from "../lavaPaint";
import { lavaMasses } from "../lavaMasses";
import { LAVA_RECIPE } from "../lavaRecipe";
import { useLavaInks } from "../useLavaInks";

const LIGHT_GLOW_SHARE = 0.36;

function glowPercent(mode: "light" | "dark"): number {
  const [mass] = lavaMasses(1);
  const background = String(lavaGlowSx("primary", mode, 1, mass).backgroundImage);
  const match = background.match(/(\d+(?:\.\d+)?)%,\s*transparent\)/);
  if (!match) throw new Error(`pourcentage introuvable dans ${background}`);
  return Number(match[1]);
}

function paletteElement() {
  const element = document.createElement("div");
  element.style.setProperty("--canop-palette-text-primary", "rgb(10, 10, 10)");
  element.style.setProperty("--canop-palette-primary-light", "rgb(200, 200, 255)");
  element.style.setProperty("--canop-palette-primary-dark", "rgb(0, 0, 90)");
  document.body.appendChild(element);
  return element;
}

function wrapper({ children }: { children: ReactNode }) {
  return <CanopThemeProvider>{children}</CanopThemeProvider>;
}

describe("ShapeBackground - lave en thème clair", () => {
  it("donne à la lueur une part de 0,36 en thème clair", () => {
    expect(glowPercent("light")).toBeCloseTo(LAVA_RECIPE.litOpacity * LIGHT_GLOW_SHARE * 100, 1);
  });

  it("rend la lueur plus forte en thème clair qu'en thème sombre", () => {
    expect(glowPercent("light")).toBeGreaterThan(glowPercent("dark"));
  });

  it("allume les points avec la nuance dark en thème clair", async () => {
    const element = paletteElement();
    const { result } = renderHook(() => useLavaInks(element, "primary", "light"), { wrapper });
    await waitFor(() => expect(result.current).not.toBeNull());
    expect(result.current?.lit).toBe("rgb(0, 0, 90)");
    element.remove();
  });
});
