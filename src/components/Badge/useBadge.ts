import type { BadgeOrigin } from "@mui/material/Badge";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";

declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    accent: true;
  }
}

export type CanopBadgeVariant = "dot" | "count";
export type CanopBadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export type CanopBadgeColor = CanopPaletteColorName;

interface UseBadgeParams {
  variant: CanopBadgeVariant;
  count: number;
  max: number;
  showZero: boolean;
  placement: CanopBadgePlacement;
}

interface UseBadgeResult {
  isDot: boolean;
  invisible: boolean;
  displayValue: string;
  anchorOrigin: BadgeOrigin;
}

const anchorByPlacement: Record<CanopBadgePlacement, BadgeOrigin> = {
  "top-right": { vertical: "top", horizontal: "right" },
  "top-left": { vertical: "top", horizontal: "left" },
  "bottom-right": { vertical: "bottom", horizontal: "right" },
  "bottom-left": { vertical: "bottom", horizontal: "left" },
};

export function useBadge({
  variant,
  count,
  max,
  showZero,
  placement,
}: UseBadgeParams): UseBadgeResult {
  const isDot = variant === "dot";
  const invisible = !isDot && count === 0 && !showZero;
  const displayValue = count > max ? `${max}+` : `${count}`;

  return { isDot, invisible, displayValue, anchorOrigin: anchorByPlacement[placement] };
}
