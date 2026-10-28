import type { CSSObject } from "@mui/material/styles";
import { SQUIRCLE_CLIP_VAR } from "../squircle/squircleSx";
import { squircleRingPath } from "../squircle/superellipse";
import type { CanopLiquidGlassParams } from "./liquidGlassParams";

const WHITE = "var(--canop-palette-common-white)";
const BLACK = "var(--canop-palette-common-black)";
const OPAQUE_SURFACE = "var(--canop-palette-surface-base)";
const NO_LAYER = "transparent";

const CRISP_RIM_WIDTH = "0.0625rem";
const SOFT_RIM_WIDTH = "0.1875rem";
const SOFT_RIM_SHARE = 0.35;

const INNER_SHADOW_SHARE = 18;
const INNER_SHADOW_SPREAD = "2rem";
const INNER_SHADOW_SOFTNESS = "0.375rem";
const INNER_SHADOW_FALL = "translate(-0.5rem, -0.75rem)";

function share(color: string, percent: number): string {
  const bounded = Math.min(100, Math.max(0, Number(percent.toFixed(2))));
  return `color-mix(in srgb, ${color} ${bounded}%, transparent)`;
}

function tintLayer({ tint }: CanopLiquidGlassParams): string | null {
  if (tint <= 0) return null;
  return [
    "linear-gradient(150deg,",
    `${share("var(--canop-palette-primary-light)", tint)},`,
    `${share("var(--canop-palette-accent-light)", tint * 0.8)})`,
  ].join(" ");
}

function veilLayer({ veil }: CanopLiquidGlassParams): string | null {
  return veil > 0 ? share(OPAQUE_SURFACE, veil) : null;
}

function reflectionLayer({ reflection }: CanopLiquidGlassParams): string | null {
  if (reflection <= 0) return null;
  return [
    "linear-gradient(180deg,",
    `${share(WHITE, reflection * 40)} 0%,`,
    `${share(WHITE, reflection * 12)} 22%,`,
    "transparent 45%)",
  ].join(" ");
}

function stack(layers: Array<string | null>): string {
  const painted = layers.filter((layer): layer is string => layer !== null);
  return painted.length > 0 ? painted.join(", ") : NO_LAYER;
}

/** Valeur CSS `background` du verre : reflet, teinte puis voile, ou `transparent`. */
export function liquidGlassBackground(params: CanopLiquidGlassParams): string {
  return stack([reflectionLayer(params), tintLayer(params), veilLayer(params)]);
}

/** Valeur CSS `background` sans `backdrop-filter` : reflet et teinte sur `surface.base` opaque. */
export function liquidGlassFallbackBackground(params: CanopLiquidGlassParams): string {
  return stack([reflectionLayer(params), tintLayer(params), OPAQUE_SURFACE]);
}

/**
 * Valeur CSS `backdrop-filter` : `blur()` en rem puis `saturate()`, précédés de `url(#id)` si
 * un id de filtre de réfraction est fourni.
 */
export function liquidGlassBackdropFilter(
  { blur, saturation }: CanopLiquidGlassParams,
  refractionFilterId?: string,
): string {
  return [
    refractionFilterId ? `url(#${refractionFilterId})` : null,
    `blur(${blur}rem)`,
    `saturate(${saturation})`,
  ]
    .filter((step): step is string => step !== null)
    .join(" ");
}

function rimGradient(strength: number): string {
  return [
    "linear-gradient(135deg,",
    `${share(WHITE, strength * 95)} 0%,`,
    `${share(WHITE, strength * 35)} 28%,`,
    "transparent 52%,",
    `${share(BLACK, strength * 12)} 78%,`,
    `${share(BLACK, strength * 30)} 100%)`,
  ].join(" ");
}

function rimSx(radius: string, width: string, strength: number): CSSObject {
  return {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
    clipPath: squircleRingPath(radius, width),
    background: rimGradient(strength),
  };
}

export function liquidGlassLayersSx(
  { specular }: CanopLiquidGlassParams,
  radius: string,
): CSSObject {
  return {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    pointerEvents: "none",
    clipPath: `var(${SQUIRCLE_CLIP_VAR})`,
    ...(specular > 0
      ? {
          "&::before": rimSx(radius, SOFT_RIM_WIDTH, specular * SOFT_RIM_SHARE),
          "&::after": rimSx(radius, CRISP_RIM_WIDTH, specular),
        }
      : {}),
  };
}

function outsetRadius(radius: string, spread: string): string {
  return `calc(min(${radius}, calc(50% - ${spread})) + ${spread})`;
}

export function liquidGlassInnerShadowSx(
  { innerShadow }: CanopLiquidGlassParams,
  radius: string,
): CSSObject {
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    filter: `blur(${INNER_SHADOW_SOFTNESS})`,
    transform: INNER_SHADOW_FALL,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: `calc(-1 * ${INNER_SHADOW_SPREAD})`,
      clipPath: squircleRingPath(outsetRadius(radius, INNER_SHADOW_SPREAD), INNER_SHADOW_SPREAD),
      backgroundColor: share(BLACK, innerShadow * INNER_SHADOW_SHARE),
    },
  };
}
