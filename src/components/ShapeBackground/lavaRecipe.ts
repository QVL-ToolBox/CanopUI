import type { CanopPaletteColorName } from "../_shared/paletteColorVar";
import type { CanopThemeMode } from "../../theme";

export const LAVA_RECIPE = {
  litOpacity: 0.75,
  speed: 3,
  tintPercent: 2,
  masses: 10,
  sizeRem: 6,
  fusion: 0.55,
  dotOpacity: 0.14,
  pitchRem: 1.5,
  dotRem: 0.07,
} as const;

export interface LavaSettings {
  hue: CanopPaletteColorName;
  mode: CanopThemeMode;
  masses: number;
  intensity: number;
}
