import type { CanopPaletteColorName } from "../_shared/paletteColorVar";
import { paletteGradient } from "../_shared/paletteGradient";
import { TOUCH_TARGET_MIN } from "../_shared/touchTarget";

export type CanopSliderSize = "small" | "medium";

export interface CanopSliderMetrics {
  thumbWidth: string;
  thumbHeight: string;
  thumbRadius: string;
  rail: string;
  railRadius: string;
  mark: string;
  padding: string;
  coarsePadding: string;
}

export const SLIDER_COARSE_TARGET = TOUCH_TARGET_MIN;

export const sliderMetrics: Record<CanopSliderSize, CanopSliderMetrics> = {
  small: {
    thumbWidth: "0.9375rem",
    thumbHeight: "0.75rem",
    thumbRadius: "0.375rem",
    rail: "0.25rem",
    railRadius: "0.125rem",
    mark: "0.3125rem",
    padding: "0.75rem",
    coarsePadding: "1.25rem",
  },
  medium: {
    thumbWidth: "1.125rem",
    thumbHeight: "0.875rem",
    thumbRadius: "0.4375rem",
    rail: "0.375rem",
    railRadius: "0.1875rem",
    mark: "0.375rem",
    padding: "0.8125rem",
    coarsePadding: "1.1875rem",
  },
};

const MAX_RAMP_STRETCH_COVERING_WHOLE_RAIL = 4000;

export function sliderTrackBackgroundSize(value: number, min: number, max: number): string {
  const span = max - min;
  const fraction = span > 0 ? (value - min) / span : 0;
  if (fraction <= 0) return "100% 100%";
  return `${Math.min(100 / fraction, MAX_RAMP_STRETCH_COVERING_WHOLE_RAIL)}% 100%`;
}

export type CanopSliderColor = Extract<
  CanopPaletteColorName,
  "primary" | "secondary" | "accent" | "success"
>;

export function stepDecimals(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 0;

  const text = String(step);
  const exponentIndex = text.indexOf("e-");
  if (exponentIndex >= 0) return Number(text.slice(exponentIndex + 2));

  const fraction = text.split(".")[1];
  return fraction ? fraction.length : 0;
}

export function formatSliderValue(value: number, step: number): string {
  return value.toFixed(stepDecimals(step));
}

export function sliderTrackGradient(color: CanopSliderColor): string {
  return paletteGradient(color);
}
