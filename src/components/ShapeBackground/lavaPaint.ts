import type { CSSObject } from "@mui/material/styles";
import { clamp } from "../_shared/clamp";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";
import type { CanopThemeMode } from "../../theme";
import { LAVA_RECIPE } from "./lavaRecipe";
import type { LavaMass } from "./lavaMasses";

const DECIMALS = 2;
const PERCENT = 100;
const GLOW_REACH = 1.7;
const GLOW_SHARE: Record<CanopThemeMode, number> = { dark: 0.26, light: 0.16 };
const GLOW_FADE_IN = "opacity 1.2s var(--canop-motion-ease-organic)";

export const LAVA_BLEED_REM = 3;

export const fullLayer: CSSObject = { position: "absolute", inset: 0 };

export const lavaSurfaceSx: CSSObject = { position: "absolute", inset: `-${LAVA_BLEED_REM}rem` };

function round(value: number): number {
  return Number(value.toFixed(DECIMALS));
}

function paletteMain(hue: CanopPaletteColorName): string {
  return `var(--canop-palette-${hue}-main)`;
}

function percent(share: number): string {
  return `${round(clamp(share, 0, 1) * PERCENT)}%`;
}

export function lavaBaseColor(hue: CanopPaletteColorName): string {
  const tint = `${LAVA_RECIPE.tintPercent}%`;
  return `color-mix(in oklab, ${paletteMain(hue)} ${tint}, var(--canop-palette-background-default))`;
}

function fade(color: string, share: number): string {
  return `color-mix(in srgb, ${color} ${percent(share)}, transparent)`;
}

function glowGradient(color: string): string {
  return `radial-gradient(circle closest-side at 50% 50%, ${color} 0%, transparent 100%)`;
}

export function lavaGlowSx(
  hue: CanopPaletteColorName,
  mode: CanopThemeMode,
  intensity: number,
  mass: LavaMass,
): CSSObject {
  const radius = round(LAVA_RECIPE.sizeRem * mass.sizeShare * GLOW_REACH);
  const diameter = `${round(radius * 2)}rem`;
  const glowShare = LAVA_RECIPE.litOpacity * intensity * GLOW_SHARE[mode];
  return {
    position: "absolute",
    top: `${-radius}rem`,
    left: `${-radius}rem`,
    width: diameter,
    height: diameter,
    opacity: 0,
    backgroundImage: glowGradient(fade(paletteMain(hue), glowShare)),
    willChange: "transform",
    transition: GLOW_FADE_IN,
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  };
}

export const lavaCanvasSx: CSSObject = {
  ...fullLayer,
  display: "block",
  width: "100%",
  height: "100%",
};
