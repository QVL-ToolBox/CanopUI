import type { CanopPaletteColorName } from "./paletteColorVar";

export interface PaletteGradientOptions {
  angle?: string;
  lift?: number;
}

export function paletteGradient(
  color: CanopPaletteColorName,
  { angle = "90deg", lift = 0 }: PaletteGradientOptions = {},
): string {
  const clair =
    lift > 0
      ? `color-mix(in srgb, var(--canop-palette-${color}-light) ${100 - lift}%, #fff)`
      : `var(--canop-palette-${color}-light)`;
  return [
    `linear-gradient(${angle},`,
    `${clair} 0%,`,
    `var(--canop-palette-${color}-main) 55%,`,
    `var(--canop-palette-${color}-dark) 100%)`,
  ].join(" ");
}

export function sheenGradient(angle = "90deg"): string {
  return [
    `linear-gradient(${angle},`,
    "rgba(255, 255, 255, 0) 0%,",
    "rgba(255, 255, 255, 0.55) 50%,",
    "rgba(255, 255, 255, 0) 100%)",
  ].join(" ");
}
