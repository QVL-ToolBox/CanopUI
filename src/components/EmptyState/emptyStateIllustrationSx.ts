import type { CSSObject, SxProps, Theme } from "@mui/material/styles";
import { squircleSurface } from "../../squircle";
import { glowFilter, neonFlicker } from "../../theme/neonGlow";
import { FROSTED_PADDING } from "../Card/cardGlass";
import type { CanopEmptyStateSurface } from "./emptyStateSurface";
import type { EmptyStateSizeRecipe } from "./emptyStateSizes";

export type EmptyStateLight = "daylight" | "neon";

export interface EmptyStateIllustrationSx {
  halo: SxProps<Theme>;
  float: CSSObject;
  badge: CSSObject;
}

interface IllustrationLook {
  haloCore: string;
  haloEdge: string;
  fill: string;
  rim: string;
  shadow: string;
}

interface HaloFrame {
  inset: string | Record<keyof typeof FROSTED_PADDING, string>;
  shape: "circle" | "ellipse";
  headroom: string;
  breathing: CSSObject;
}

const PRIMARY = "var(--canop-palette-primary-main)";
const PAPER = "var(--canop-palette-background-paper)";
const HALO_SPREAD = "-75%";
const BREATHE_PERIOD = "7s";
const FLOAT = "canop-empty-state-float";
const FLOAT_PERIOD = "6s";
const FLOAT_LIFT = "0.375rem";
const NEON_IGNITION_DELAY = "0.2s";
const REDUCED_MOTION = "@media (prefers-reduced-motion: reduce)";

function tint(share: string, base: string): string {
  return `color-mix(in srgb, ${PRIMARY} ${share}, ${base})`;
}

function sheen(from: string, to: string): string {
  return `linear-gradient(155deg, ${from}, ${to})`;
}

function breathing(name: string, peak: string): CSSObject {
  return {
    animation: `${name} ${BREATHE_PERIOD} var(--canop-motion-ease-standard) infinite alternate`,
    [`@keyframes ${name}`]: {
      from: { transform: "scale(0.9)", opacity: 0.7 },
      to: { transform: peak, opacity: 1 },
    },
    [REDUCED_MOTION]: { animation: "none" },
  };
}

function withinCardPadding(padding: string): string {
  return `calc(${padding} * -1) ${HALO_SPREAD}`;
}

const LOOKS: Record<EmptyStateLight, IllustrationLook> = {
  daylight: {
    haloCore: tint("24%", "transparent"),
    haloEdge: tint("8%", "transparent"),
    fill: sheen(tint("16%", PAPER), tint("5%", PAPER)),
    rim: sheen(tint("45%", "transparent"), tint("12%", "transparent")),
    shadow: "var(--canop-drop-shadow-e2)",
  },
  neon: {
    haloCore: tint("38%", "transparent"),
    haloEdge: tint("12%", "transparent"),
    fill: sheen(tint("24%", PAPER), tint("8%", PAPER)),
    rim: sheen(tint("85%", "transparent"), tint("30%", "transparent")),
    shadow: glowFilter("primary", "rest"),
  },
};

const HALO_FRAMES: Record<CanopEmptyStateSurface, HaloFrame> = {
  plain: {
    inset: HALO_SPREAD,
    shape: "circle",
    headroom: "0rem",
    breathing: breathing("canop-empty-state-breathe", "scale(1.08)"),
  },
  ambient: {
    inset: {
      xs: withinCardPadding(FROSTED_PADDING.xs),
      md: withinCardPadding(FROSTED_PADDING.md),
    },
    shape: "ellipse",
    headroom: FLOAT_LIFT,
    breathing: breathing("canop-empty-state-breathe-bounded", "scale(1.08, 1)"),
  },
};

const floating: CSSObject = {
  animation: `${FLOAT} ${FLOAT_PERIOD} ease-in-out infinite`,
  [`@keyframes ${FLOAT}`]: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: `translateY(-${FLOAT_LIFT})` },
  },
  [REDUCED_MOTION]: { animation: "none" },
};

const neonIgnition: CSSObject = {
  ...neonFlicker,
  animationDelay: NEON_IGNITION_DELAY,
  animationFillMode: "backwards",
};

function haloSx(
  recipe: EmptyStateSizeRecipe,
  look: IllustrationLook,
  frame: HaloFrame,
  live: boolean,
): SxProps<Theme> {
  return {
    position: "relative",
    isolation: "isolate",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: frame.headroom,
    marginBottom: recipe.illustrationGap,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: frame.inset,
      zIndex: -1,
      pointerEvents: "none",
      background: `radial-gradient(${frame.shape} closest-side, ${look.haloCore} 0%, ${look.haloEdge} 55%, transparent 100%)`,
      ...(live ? frame.breathing : null),
    },
  };
}

function badgeSx(
  recipe: EmptyStateSizeRecipe,
  look: IllustrationLook,
  ignites: boolean,
): CSSObject {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    minWidth: recipe.badgeSize,
    minHeight: recipe.badgeSize,
    padding: recipe.badgePadding,
    color: PRIMARY,
    ...squircleSurface({
      radius: recipe.badgeRadius,
      background: look.fill,
      borderColor: look.rim,
      shadow: look.shadow,
    }),
    ...(ignites ? neonIgnition : null),
  };
}

export function emptyStateIllustrationSx(
  recipe: EmptyStateSizeRecipe,
  surface: CanopEmptyStateSurface,
  light: EmptyStateLight,
  live: boolean,
): EmptyStateIllustrationSx {
  const look = LOOKS[light];
  return {
    halo: haloSx(recipe, look, HALO_FRAMES[surface], live),
    float: live ? floating : {},
    badge: badgeSx(recipe, look, live && light === "neon"),
  };
}
