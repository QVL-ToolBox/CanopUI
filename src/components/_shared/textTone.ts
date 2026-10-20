import { paletteColorVar, type CanopPaletteColorName } from "./paletteColorVar";

export type CanopTextTone = "default" | "muted" | "subtle" | "inherit" | CanopPaletteColorName;

export const textToneColor: Record<CanopTextTone, string> = {
  default: "text.primary",
  muted: "text.secondary",
  subtle: "text.disabled",
  inherit: "inherit",
  ...paletteColorVar,
};
