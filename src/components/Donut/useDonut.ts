import { useMemo } from "react";
import { useReducedMotion } from "../../motion";
import { paletteColorVar, type CanopPaletteColorName } from "../_shared/paletteColorVar";

export type CanopDonutColor = CanopPaletteColorName;

export type CanopDonutThickness = "thin" | "medium" | "thick";

export interface CanopDonutSegment {
  id?: string;
  label: string;
  value: number;
  color?: CanopDonutColor;
}

export interface CanopDonutGeometry {
  key: string;
  label: string;
  value: number;
  percentage: number;
  dashLength: number;
  rotation: number;
  color: string;
  valueLabel: string;
}

interface UseDonutParams {
  segments: CanopDonutSegment[];
  thickness: CanopDonutThickness;
  animated: boolean;
  ariaLabel?: string;
  formatValue?: (segment: CanopDonutSegment, percentage: number) => string;
}

export interface UseDonutResult {
  viewBox: string;
  center: number;
  radius: number;
  strokeWidth: number;
  geometries: CanopDonutGeometry[];
  total: number;
  shouldAnimate: boolean;
  resolvedAriaLabel: string;
  trackColor: string;
}

const VIEWBOX_SIZE = 42;
const CENTER = 21;
const RADIUS = 15.915494309189533;
const FULL_CIRCLE_DEGREES = 360;
const START_ROTATION = -90;
const TRACK_COLOR = "var(--canop-palette-surface-sunken)";

const strokeWidthByThickness: Record<CanopDonutThickness, number> = {
  thin: 3,
  medium: 4.5,
  thick: 6,
};

const defaultColorOrder: CanopDonutColor[] = [
  "primary",
  "accent",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
];

function segmentColor(segment: CanopDonutSegment, index: number): string {
  if (segment.color) return paletteColorVar[segment.color];
  return paletteColorVar[defaultColorOrder[index % defaultColorOrder.length]];
}

export function useDonut({
  segments,
  thickness,
  animated,
  ariaLabel,
  formatValue,
}: UseDonutParams): UseDonutResult {
  const reduced = useReducedMotion();

  const { geometries, total } = useMemo(() => {
    const sum = segments.reduce((acc, segment) => acc + Math.max(segment.value, 0), 0);
    let cumulative = 0;
    const computed = segments.map((segment, index) => {
      const value = Math.max(segment.value, 0);
      const percentage = sum > 0 ? (value / sum) * 100 : 0;
      const rotation = START_ROTATION + (cumulative / 100) * FULL_CIRCLE_DEGREES;
      const valueLabel = formatValue
        ? formatValue(segment, percentage)
        : `${Math.round(percentage)} %`;
      cumulative += percentage;
      return {
        key: segment.id ?? `${segment.label}-${index}`,
        label: segment.label,
        value,
        percentage,
        dashLength: percentage,
        rotation,
        color: segmentColor(segment, index),
        valueLabel,
      };
    });
    return { geometries: computed, total: sum };
  }, [segments, formatValue]);

  const resolvedAriaLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    return geometries.map((geometry) => `${geometry.label} : ${geometry.valueLabel}`).join(", ");
  }, [ariaLabel, geometries]);

  return {
    viewBox: `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`,
    center: CENTER,
    radius: RADIUS,
    strokeWidth: strokeWidthByThickness[thickness],
    geometries,
    total,
    shouldAnimate: animated && !reduced,
    resolvedAriaLabel,
    trackColor: TRACK_COLOR,
  };
}
