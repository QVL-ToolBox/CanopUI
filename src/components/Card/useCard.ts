import type { KeyboardEventHandler, MouseEventHandler } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { useReducedMotion } from "../../motion";
import { focusRingSx } from "../_shared/focusRing";
import { cardArrowSx } from "./cardArrowSx";
import { FROSTED_PADDING, frostedGlass, type CardGlass } from "./cardGlass";
import { CARD_TRANSFORM_TRANSITION } from "./cardTransitions";
import { useCardClick, type CardActionsIsolationProps } from "./useCardClick";
import { squircleRingPath, squircleShadow, squircleSurface } from "../../squircle";

export type CanopCardVariant = "surface" | "interactive" | "floating" | "stat" | "frosted";
/**
 * Tonalite semantique de la surface : ce que la carte **signifie**, pas la
 * couleur qu'on veut. Un solde previsionnel negatif est `error`, un quota
 * presque atteint est `warning`.
 */
export type CanopCardTone = "neutral" | "info" | "success" | "warning" | "error";
/**
 * Retour immediat sur une action : bonne ou mauvaise reponse.
 *
 * Un eclair, et non une tonalite : il se pose le temps d'etre vu puis
 * disparait, ce qui se pilote avec `useTransientState`.
 */
export type CanopCardFlash = "success" | "error";
export type CanopCardElevation = "none" | "sm" | "md" | "lg";
export type CanopCardRadius = "md" | "lg" | "xl" | "2xl";
export type CanopCardDensity = "auto" | "comfortable" | "standard" | "dense";

interface UseCardParams {
  variant: CanopCardVariant;
  tone: CanopCardTone;
  flash?: CanopCardFlash;
  elevation?: CanopCardElevation;
  radius?: CanopCardRadius;
  density: CanopCardDensity;
  fill: boolean;
  arrow: boolean;
  hasHeader: boolean;
  onClick?: () => void;
}

interface CardInteractionProps {
  tabIndex?: number;
  role?: "button";
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface UseCardResult {
  rootSx: SxProps<Theme>;
  headerSx: SxProps<Theme>;
  contentSx: SxProps<Theme>;
  actionsSx: SxProps<Theme>;
  interactionProps: CardInteractionProps;
  actionsProps: CardActionsIsolationProps;
}

const shadowByElevation: Record<CanopCardElevation, string> = {
  none: "none",
  sm: "var(--canop-drop-shadow-e1)",
  md: "var(--canop-drop-shadow-e2)",
  lg: "var(--canop-drop-shadow-e3)",
};

const restShadowByVariant: Record<CanopCardVariant, string> = {
  surface: "var(--canop-drop-shadow-e1)",
  interactive: "var(--canop-drop-shadow-e1)",
  floating: "var(--canop-drop-shadow-e3)",
  stat: "var(--canop-drop-shadow-e1)",
  frosted: "none",
};

const defaultRadiusByVariant: Record<CanopCardVariant, CanopCardRadius> = {
  surface: "lg",
  interactive: "lg",
  floating: "xl",
  stat: "lg",
  frosted: "xl",
};

const radiusVar: Record<CanopCardRadius, string> = {
  md: "var(--canop-radius-md)",
  lg: "var(--canop-radius-lg)",
  xl: "var(--canop-radius-xl)",
  "2xl": "var(--canop-radius-2xl)",
};

const densityPadding = {
  comfortable: 3,
  standard: 2.5,
  dense: 2,
} as const;

const autoPadding = {
  xs: densityPadding.comfortable,
  sm: densityPadding.standard,
  md: densityPadding.dense,
} as const;

const shadowTransition =
  "filter var(--canop-motion-duration-base) var(--canop-motion-ease-standard)";

const interactiveTransition = [CARD_TRANSFORM_TRANSITION, shadowTransition].join(", ");

const statBackground =
  "color-mix(in srgb, var(--canop-palette-primary-main) 6%, var(--canop-palette-background-paper))";

const OPAQUE_SURFACE_OPACITY = "100%";
const NO_SURFACE_BLUR = "none";

const WITHOUT_STANDARD_OR_PREFIXED_BACKDROP_FILTER =
  "@supports not ((backdrop-filter: blur(0.0625rem)) or (-webkit-backdrop-filter: blur(0.0625rem)))";

function translucent(color: string): string {
  return `color-mix(in srgb, ${color} ${OPAQUE_SURFACE_OPACITY}, transparent)`;
}

const FLASH_RING_WIDTH = "0.1875rem";

const FLASH_RING_COLOR_TRANSITION =
  "background-color var(--canop-motion-duration-base) var(--canop-motion-ease-standard)";

const SHAKE = "canop-card-shake";
const SHAKE_DURATION = "0.35s";

const shakeSx = {
  animation: `${SHAKE} ${SHAKE_DURATION} ease`,
  [`@keyframes ${SHAKE}`]: {
    "20%": { transform: "translateX(-0.4375rem)" },
    "45%": { transform: "translateX(0.375rem)" },
    "70%": { transform: "translateX(-0.25rem)" },
    "90%": { transform: "translateX(0.125rem)" },
  },
};

const flashColor: Record<CanopCardFlash, string> = {
  success: "var(--canop-palette-success-main)",
  error: "var(--canop-palette-error-main)",
};

const toneSource: Record<Exclude<CanopCardTone, "neutral">, string> = {
  info: "var(--canop-palette-info-main)",
  success: "var(--canop-palette-success-main)",
  warning: "var(--canop-palette-warning-main)",
  error: "var(--canop-palette-error-main)",
};

const TONE_SHARE_KEEPING_THEME_TEXT_CONTRAST = "8%";

function toneBackground(tone: CanopCardTone): string | undefined {
  if (tone === "neutral") return undefined;
  return `color-mix(in srgb, ${toneSource[tone]} ${TONE_SHARE_KEEPING_THEME_TEXT_CONTRAST}, var(--canop-palette-background-paper))`;
}

function solidGlass(variant: CanopCardVariant, tone: CanopCardTone): CardGlass {
  const surface =
    toneBackground(tone) ??
    (variant === "stat" ? statBackground : "var(--canop-palette-background-paper)");
  return {
    background: translucent(surface),
    backdropFilter: NO_SURFACE_BLUR,
    opaqueFallback: { backgroundColor: surface },
  };
}

function glassFor(variant: CanopCardVariant, tone: CanopCardTone): CardGlass {
  return variant === "frosted" ? frostedGlass : solidGlass(variant, tone);
}

function paddingFor(variant: CanopCardVariant, density: CanopCardDensity) {
  if (density !== "auto") return densityPadding[density];
  return variant === "frosted" ? FROSTED_PADDING : autoPadding;
}

export function useCard({
  variant,
  tone,
  flash,
  elevation,
  radius,
  density,
  fill,
  arrow,
  hasHeader,
  onClick,
}: UseCardParams): UseCardResult {
  const reduced = useReducedMotion();
  const isInteractive = variant === "interactive" || (variant === "stat" && onClick !== undefined);
  const { handleClick, handleKeyDown, actionsProps } = useCardClick(onClick);

  const restShadow = elevation ? shadowByElevation[elevation] : restShadowByVariant[variant];
  const resolvedRadius = radius ?? defaultRadiusByVariant[variant];
  const padding = paddingFor(variant, density);
  const glass = glassFor(variant, tone);

  const rootSx: SxProps<Theme> = {
    ...squircleSurface({
      radius: radiusVar[resolvedRadius],
      background: glass.background,
      shadow: restShadow === "none" ? undefined : restShadow,
      shadowTransition: reduced ? undefined : shadowTransition,
    }),
    borderRadius: radiusVar[resolvedRadius],
    minWidth: 0,
    backdropFilter: glass.backdropFilter,
    WebkitBackdropFilter: glass.backdropFilter,
    [WITHOUT_STANDARD_OR_PREFIXED_BACKDROP_FILTER]: { "&::before": glass.opaqueFallback },
    overflow: "visible",
    ...(fill ? { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 } : {}),
    ...(isInteractive
      ? {
          cursor: "pointer",
          transition: reduced ? "none" : interactiveTransition,
          willChange: "transform",
          "&:hover": {
            ...squircleShadow("var(--canop-drop-shadow-e2)"),
            ...(reduced ? {} : { transform: "translateY(-0.125rem)" }),
          },
          "&:active": reduced ? {} : { transform: "scale(0.99)" },
          "&:focus-visible": focusRingSx,
        }
      : {}),
    ...(arrow && isInteractive ? cardArrowSx(!reduced) : {}),
    ...(flash === "error" && !reduced ? shakeSx : {}),
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      clipPath: squircleRingPath(radiusVar[resolvedRadius], FLASH_RING_WIDTH),
      backgroundColor: flash ? flashColor[flash] : "transparent",
      ...(reduced ? {} : { transition: FLASH_RING_COLOR_TRANSITION }),
    },
  };

  const headerSx: SxProps<Theme> = {
    padding,
    paddingBottom: 0,
    ...(fill ? { flexShrink: 0 } : {}),
  };

  const contentSx: SxProps<Theme> = {
    padding,
    "&:last-child": { paddingBottom: padding },
    ...(hasHeader ? { paddingTop: 1 } : {}),
    ...(fill
      ? { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }
      : {}),
  };

  const actionsSx: SxProps<Theme> = {
    padding,
    paddingTop: 0,
    ...(fill ? { flexShrink: 0 } : {}),
  };

  const interactionProps: CardInteractionProps =
    isInteractive && onClick
      ? { tabIndex: 0, role: "button" as const, onKeyDown: handleKeyDown, onClick: handleClick }
      : onClick
        ? { onClick: handleClick }
        : {};

  return { rootSx, headerSx, contentSx, actionsSx, interactionProps, actionsProps };
}
