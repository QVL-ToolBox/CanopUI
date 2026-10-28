import type { SxProps, Theme } from "@mui/material/styles";
import { useReducedMotion } from "../../motion";
import { tokens } from "../../tokens";
import { squircleClipPath, squircleRingPath } from "../../squircle";

export type CanopPressableRadius = "xs" | "sm" | "md" | "lg" | "xl" | "pill" | "circle";
export type CanopPressableSpacing = keyof typeof tokens.spacing | "none";

export interface UsePressableParams {
  radius: CanopPressableRadius;
  padding: CanopPressableSpacing;
  size?: string;
  background?: string;
  selected: boolean;
  fullWidth: boolean;
  disabled: boolean;
  dimWhenDisabled: boolean;
}

export interface UsePressableResult {
  rootSx: SxProps<Theme>;
}

const radiusValue: Record<Exclude<CanopPressableRadius, "circle">, string> = {
  xs: "var(--canop-radius-xs)",
  sm: "var(--canop-radius-sm)",
  md: "var(--canop-radius-md)",
  lg: "var(--canop-radius-lg)",
  xl: "var(--canop-radius-xl)",
  pill: "var(--canop-radius-pill)",
};

const SELECTION_RING_WIDTH = "0.1875rem";

const PRESSED_SCALE = 0.97;
const SELECTED_SCALE = 1.04;
const SELECTED_PRESSED_SCALE = 1.01;

export function usePressable({
  radius,
  padding,
  size,
  background,
  selected,
  fullWidth,
  disabled,
  dimWhenDisabled,
}: UsePressableParams): UsePressableResult {
  const reduced = useReducedMotion();

  const geometry = radius === "circle" ? { shape: "circle" as const } : undefined;
  const rayon = radius === "circle" ? "50%" : radiusValue[radius];

  return {
    rootSx: {
      clipPath: squircleClipPath(rayon, geometry),
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      position: "relative",
      ...(size ? { width: size, height: size } : {}),
      ...(fullWidth ? { width: "100%" } : {}),
      ...(padding === "none" ? {} : { padding: tokens.spacing[padding] }),
      ...(background ? { backgroundColor: background } : {}),
      color: "inherit",
      cursor: disabled ? "default" : "pointer",
      ...(reduced
        ? {}
        : {
            transition:
              "transform var(--canop-motion-duration-fast) var(--canop-motion-ease-spring-soft)",
          }),
      ...(selected && !reduced ? { transform: `scale(${SELECTED_SCALE})` } : {}),
      ...(reduced || disabled
        ? {}
        : {
            "&:active": {
              transform: `scale(${selected ? SELECTED_PRESSED_SCALE : PRESSED_SCALE})`,
            },
          }),
      ...(selected
        ? {
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              clipPath: squircleRingPath(rayon, SELECTION_RING_WIDTH, geometry),
              backgroundColor: "var(--canop-palette-primary-main)",
            },
          }
        : {}),
      ...(dimWhenDisabled ? { "&.Mui-disabled": { opacity: 0.5 } } : {}),
    },
  };
}
