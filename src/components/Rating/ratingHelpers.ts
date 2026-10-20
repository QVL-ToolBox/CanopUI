import type { CanopIconSize } from "../Icon";
import { clamp } from "../_shared/clamp";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";

export type CanopRatingColor = Extract<
  CanopPaletteColorName,
  "primary" | "secondary" | "accent" | "success" | "warning"
>;

export type CanopRatingTextVariant = "caption" | "body2" | "body1";

export const RATING_PRECISION = 0.1;

const textVariantMap: Record<CanopIconSize, CanopRatingTextVariant> = {
  xs: "caption",
  sm: "body2",
  md: "body2",
  lg: "body1",
  xl: "body1",
};

export function normalizeRatingMax(max: number): number {
  if (!Number.isFinite(max)) return 1;
  return Math.max(1, Math.floor(max));
}

export function normalizeRatingValue(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  const bounded = clamp(value, 0, max);
  const steps = Math.round(bounded / RATING_PRECISION);
  return Number((steps * RATING_PRECISION).toFixed(1));
}

export function formatRatingValue(value: number): string {
  return value.toFixed(1);
}

export function ratingAriaLabel(value: number, max: number, label?: string): string {
  const score = `${formatRatingValue(value)}/${max}`;
  return label ? `${label} ${score}` : score;
}

export function ratingTextVariant(size: CanopIconSize): CanopRatingTextVariant {
  return textVariantMap[size];
}
