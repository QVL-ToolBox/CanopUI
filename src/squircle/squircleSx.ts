import type { CSSObject } from "@mui/material/styles";
import { squircle } from "../tokens/squircle";
import {
  insetRadius,
  squircleClipPath,
  squircleRingPath,
  type CanopSquircleRadius,
  type CanopSuperellipseOptions,
} from "./superellipse";

export interface CanopSquircleSurfaceOptions extends CanopSuperellipseOptions {
  radius: CanopSquircleRadius;
  background?: string;
  borderColor?: string;
  borderWidth?: string;
  shadow?: string;
  shadowTransition?: string;
  position?: "relative" | "absolute" | "fixed" | "sticky";
  layerSelector?: string;
}

function paint(value: string): CSSObject {
  return value.includes("gradient") ? { background: value } : { backgroundColor: value };
}

const layerBase: CSSObject = {
  content: '""',
  position: "absolute",
  pointerEvents: "none",
};

export const SQUIRCLE_CLIP_VAR = "--canop-squircle-clip";

export function squircleClip(
  radius: CanopSquircleRadius,
  options: CanopSuperellipseOptions = {},
): CSSObject {
  return { clipPath: squircleClipPath(radius, options) };
}

export function squircleSurface(options: CanopSquircleSurfaceOptions): CSSObject {
  const {
    radius,
    background = "transparent",
    borderColor,
    borderWidth = squircle.borderWidth,
    shadow,
    shadowTransition,
    position = "relative",
    layerSelector = "&",
    shape,
    exponent,
    segments,
  } = options;

  const geometry = { shape, exponent, segments };
  const hollow = Boolean(borderColor) && background.trim() === "transparent";
  const outline = squircleClipPath(radius, geometry);

  return {
    position,
    isolation: "isolate",
    backgroundColor: "transparent",
    borderRadius: 0,
    [SQUIRCLE_CLIP_VAR]: outline,
    ...(shadow ? { filter: shadow } : null),
    ...(shadowTransition ? { transition: shadowTransition } : null),
    [`${layerSelector}::before`]: {
      ...layerBase,
      inset: 0,
      zIndex: -2,
      clipPath: hollow ? squircleRingPath(radius, borderWidth, geometry) : outline,
      ...paint(borderColor ?? background),
    },
    ...(borderColor
      ? {
          [`${layerSelector}::after`]: {
            ...layerBase,
            inset: borderWidth,
            zIndex: -1,
            clipPath: squircleClipPath(insetRadius(radius, borderWidth), geometry),
            ...paint(background),
          },
        }
      : null),
  };
}

export function squircleShadow(shadow: string): CSSObject {
  return { filter: shadow };
}

export function squircleFill(background: string): CSSObject {
  return { "&::before": paint(background) };
}

export interface CanopSquircleRingOptions extends CanopSuperellipseOptions {
  radius: string;
  width: string;
  color: string;
}

export function squircleRing(options: CanopSquircleRingOptions): CSSObject {
  const { radius, width, color, shape, exponent, segments } = options;

  return {
    position: "relative",
    isolation: "isolate",
    "&::before": {
      ...layerBase,
      inset: `calc(-1 * ${width})`,
      zIndex: -1,
      clipPath: squircleClipPath(`calc(${radius} + ${width})`, { shape, exponent, segments }),
      ...paint(color),
    },
  };
}
