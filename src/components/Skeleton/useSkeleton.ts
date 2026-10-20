import { useMemo } from "react";
import { useReducedMotion } from "../../motion";

export type CanopSkeletonVariant = "block" | "lines";

const LAST_LINE_WIDTH = "60%";
const FULL_WIDTH = "100%";
const LINE_STAGGER_MS = 120;

interface SkeletonLine {
  key: number;
  width: string;
  delay: string;
}

interface UseSkeletonParams {
  variant: CanopSkeletonVariant;
  lines: number;
  animated: boolean;
}

interface UseSkeletonResult {
  pulsing: boolean;
  lineModels: SkeletonLine[];
}

function lineCountOf(lines: number): number {
  return Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 1;
}

function buildLines(count: number): SkeletonLine[] {
  return Array.from({ length: count }, (_, index) => ({
    key: index,
    width: count > 1 && index === count - 1 ? LAST_LINE_WIDTH : FULL_WIDTH,
    delay: `${index * LINE_STAGGER_MS}ms`,
  }));
}

export function useSkeleton({ variant, lines, animated }: UseSkeletonParams): UseSkeletonResult {
  const reduced = useReducedMotion();
  const lineModels = useMemo(
    () => (variant === "lines" ? buildLines(lineCountOf(lines)) : []),
    [variant, lines],
  );

  return { pulsing: animated && !reduced, lineModels };
}
