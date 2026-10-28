import type { CanopPaletteColorName } from "../_shared/paletteColorVar";

const PALETTE_NAMES: readonly CanopPaletteColorName[] = [
  "primary",
  "secondary",
  "accent",
  "error",
  "warning",
  "info",
  "success",
];

const DEFAULT_HUE: CanopPaletteColorName = "primary";

export function resolveShapeHue(color: string): CanopPaletteColorName {
  const [name] = color.split(".");
  return PALETTE_NAMES.find((paletteName) => paletteName === name) ?? DEFAULT_HUE;
}
