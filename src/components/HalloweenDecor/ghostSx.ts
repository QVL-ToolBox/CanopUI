import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type {
  HalloweenDepth,
  HalloweenFadeGhostSpec,
  HalloweenGhostSpec,
  HalloweenGraveGhostSpec,
  HalloweenPeekGhostSpec,
  HalloweenRiseGhostSpec,
  HalloweenWanderGhostSpec,
} from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const HAUNT_MIN_VAR = "--canop-halloween-haunt-min";
const HAUNT_MAX_VAR = "--canop-halloween-haunt-max";
const DRIFT_FROM_VAR = "--canop-halloween-haunt-from";
const DRIFT_TO_VAR = "--canop-halloween-haunt-to";

const GHOST_DRIFT = "canop-halloween-ghost-drift";
const GHOST_RISE = "canop-halloween-ghost-rise";
const GHOST_SWAY = "canop-halloween-ghost-sway";
const GHOST_BREATHE = "canop-halloween-ghost-breathe";
const GHOST_FADE = "canop-halloween-ghost-fade";
const GHOST_PEEK = "canop-halloween-ghost-peek";
const GHOST_RISE_UP = "canop-halloween-ghost-rise-up";
const GHOST_GRAVE = "canop-halloween-ghost-grave";

interface DepthLook {
  min: number;
  max: number;
  filter: string;
}

const glow = halloweenTone("ghostGlow");
const halo = halloweenTone("ghostHalo");

const depthLook: Record<HalloweenDepth, DepthLook> = {
  far: { min: 0.06, max: 0.16, filter: `blur(0.125rem) drop-shadow(0 0 0.5rem ${glow})` },
  mid: { min: 0.14, max: 0.28, filter: `drop-shadow(0 0 0.75rem ${glow})` },
  near: { min: 0.18, max: 0.32, filter: `drop-shadow(0 0 1rem ${glow})` },
  ground: {
    min: 0.5,
    max: 0.68,
    filter: `drop-shadow(0 0 0.3rem ${halo}) drop-shadow(0 0 1.1rem ${halo})`,
  },
};

function hauntVariables(spec: HalloweenGhostSpec): CSSObject {
  const look = depthLook[spec.depth];
  return { [HAUNT_MIN_VAR]: String(look.min), [HAUNT_MAX_VAR]: String(look.max) };
}

export function wanderTrackSx(spec: HalloweenWanderGhostSpec, animated: boolean): CSSObject {
  return {
    ...hauntVariables(spec),
    position: "absolute",
    top: spec.top,
    left: 0,
    width: "100%",
    transform: `translateX(${spec.from})`,
    [DRIFT_FROM_VAR]: spec.from,
    [DRIFT_TO_VAR]: spec.to,
    ...when(animated, {
      willChange: "transform",
      animation: loop(GHOST_DRIFT, spec.drift, spec.delay, "alternate"),
      ...keyframes(GHOST_DRIFT, {
        "0%": { transform: `translateX(var(${DRIFT_FROM_VAR}))` },
        "100%": { transform: `translateX(var(${DRIFT_TO_VAR}))` },
      }),
    }),
  };
}

export function wanderRiseSx(spec: HalloweenWanderGhostSpec, animated: boolean): CSSObject {
  return {
    width: spec.size,
    ...when(animated, {
      animation: loop(GHOST_RISE, spec.float, spec.delay, "alternate"),
      ...keyframes(GHOST_RISE, {
        "0%": { transform: "translateY(0)" },
        "100%": { transform: "translateY(-1.25rem)" },
      }),
    }),
  };
}

export function fadeAnchorSx(spec: HalloweenFadeGhostSpec, animated: boolean): CSSObject {
  return {
    ...hauntVariables(spec),
    position: "absolute",
    top: spec.top,
    left: spec.left,
    width: spec.size,
    ...when(animated, {
      opacity: 0,
      animation: loop(GHOST_FADE, spec.cycle, spec.delay),
      ...keyframes(GHOST_FADE, {
        "0%, 22%": { opacity: 0, transform: "translateY(1rem) scale(0.92)" },
        "38%": { opacity: 1, transform: "translateY(0) scale(1)" },
        "62%": { opacity: 1, transform: "translateY(-0.8rem) scale(1)" },
        "80%, 100%": { opacity: 0, transform: "translateY(-2rem) scale(1.04)" },
      }),
    }),
  };
}

export function riseAnchorSx(spec: HalloweenRiseGhostSpec, animated: boolean): CSSObject {
  return {
    ...hauntVariables(spec),
    position: "absolute",
    top: spec.top,
    left: spec.left,
    width: spec.size,
    transformOrigin: "50% 100%",
    ...when(animated, {
      opacity: 0,
      animation: loop(GHOST_RISE_UP, spec.cycle, spec.delay),
      ...keyframes(GHOST_RISE_UP, {
        "0%, 6%": { opacity: 0, transform: "translateY(45%) scaleY(0.5)" },
        "16%": { opacity: 1, transform: "translateY(0) scaleY(1.06)" },
        "22%": { opacity: 1, transform: "translateY(0) scaleY(1)" },
        "50%": { opacity: 1, transform: "translateY(-0.8rem) scaleY(1)" },
        "80%": { opacity: 1, transform: "translateY(-0.2rem) scaleY(1)" },
        "93%, 100%": { opacity: 0, transform: "translateY(45%) scaleY(0.5)" },
      }),
    }),
  };
}

export function graveGhostSx(spec: HalloweenGraveGhostSpec, animated: boolean): CSSObject {
  const look = depthLook.ground;
  return {
    [HAUNT_MIN_VAR]: String(look.min),
    [HAUNT_MAX_VAR]: String(look.max),
    position: "absolute",
    left: "6.5%",
    bottom: "25%",
    width: "14%",
    transform: "translateY(-105%)",
    ...when(animated, {
      opacity: 0,
      animation: loop(GHOST_GRAVE, spec.cycle, spec.delay),
      ...keyframes(GHOST_GRAVE, {
        "0%, 6%": { opacity: 0, transform: "translateY(0)" },
        "11%": { opacity: 1 },
        "20%": { opacity: 1, transform: "translateY(-120%)" },
        "27%": { opacity: 1, transform: "translateY(-100%)" },
        "52%": { opacity: 1, transform: "translateY(-112%)" },
        "80%": { opacity: 1, transform: "translateY(-104%)" },
        "90%": { opacity: 1, transform: "translateY(-10%)" },
        "94%, 100%": { opacity: 0, transform: "translateY(0)" },
      }),
    }),
  };
}

export function peekAnchorSx(spec: HalloweenPeekGhostSpec): CSSObject {
  return {
    ...hauntVariables(spec),
    position: "absolute",
    top: spec.top,
    [spec.side]: 0,
    width: spec.size,
    transform: spec.side === "right" ? "scaleX(-1)" : "none",
  };
}

export function peekSlideSx(spec: HalloweenPeekGhostSpec, animated: boolean): CSSObject {
  return {
    transformOrigin: "0% 70%",
    transform: "translateX(-35%) rotate(18deg)",
    ...when(animated, {
      animation: loop(GHOST_PEEK, spec.cycle, spec.delay),
      ...keyframes(GHOST_PEEK, {
        "0%, 52%": { transform: "translateX(-115%) rotate(30deg)" },
        "60%": { transform: "translateX(-35%) rotate(18deg)" },
        "64%": { transform: "translateX(-38%) rotate(8deg)" },
        "68%": { transform: "translateX(-33%) rotate(22deg)" },
        "72%": { transform: "translateX(-36%) rotate(12deg)" },
        "78%": { transform: "translateX(-35%) rotate(18deg)" },
        "86%, 100%": { transform: "translateX(-115%) rotate(30deg)" },
      }),
    }),
  };
}

interface GhostGlyphMotion {
  sway: number;
  breathe: number | null;
  delay: number;
}

function ghostAnimation(motion: GhostGlyphMotion): string {
  const sway = loop(GHOST_SWAY, motion.sway, motion.delay, "alternate");
  if (motion.breathe === null) return sway;
  return `${sway}, ${loop(GHOST_BREATHE, motion.breathe, motion.delay, "alternate")}`;
}

export function ghostGlyphSx(
  depth: HalloweenDepth,
  motion: GhostGlyphMotion,
  animated: boolean,
): CSSObject {
  const breathing = animated && motion.breathe !== null;
  return {
    display: "block",
    width: "100%",
    height: "auto",
    overflow: "visible",
    color: halloweenTone("ghost"),
    opacity: breathing ? `var(${HAUNT_MIN_VAR})` : `var(${HAUNT_MAX_VAR})`,
    filter: depthLook[depth].filter,
    "& [data-part='eye']": { fill: halloweenTone("ghostEye") },
    "& [data-part='line']": {
      fill: "none",
      stroke: halloweenTone("ghostEye"),
      strokeLinecap: "round",
    },
    ...when(animated, {
      animation: ghostAnimation(motion),
      ...keyframes(GHOST_SWAY, {
        "0%": { transform: "translateX(-0.75rem) rotate(-3deg)" },
        "100%": { transform: "translateX(0.75rem) rotate(3deg)" },
      }),
      ...keyframes(GHOST_BREATHE, {
        "0%": { opacity: `var(${HAUNT_MIN_VAR})` },
        "100%": { opacity: `var(${HAUNT_MAX_VAR})` },
      }),
    }),
  };
}
