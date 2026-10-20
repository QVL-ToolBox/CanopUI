import { clamp } from "../_shared/clamp";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";

export type CanopProgressBarColor = CanopPaletteColorName;

export interface CanopProgressSegment {
  value: number;
  color?: CanopProgressBarColor;
  label?: string;
}

export interface ResolvedSegment {
  key: string;
  color: CanopProgressBarColor;
  label?: string;
  value: number;
  ratio: number;
}

export function clampPercentage(value: number): number {
  return clamp(value, 0, 100);
}

export function resolveSegments(
  segments: CanopProgressSegment[],
  fallbackColor: CanopProgressBarColor,
  max?: number,
): ResolvedSegment[] {
  const total = max ?? segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0);
  if (total <= 0) return [];

  return segments.map((segment, index) => {
    const value = Math.max(0, segment.value);
    return {
      key: `${segment.label ?? "segment"}-${index}`,
      color: segment.color ?? fallbackColor,
      label: segment.label,
      value,
      ratio: value / total,
    };
  });
}
