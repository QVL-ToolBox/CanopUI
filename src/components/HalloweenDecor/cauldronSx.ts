import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import { halloweenTone } from "./halloweenTones";

const BREW_BUBBLE = "canop-halloween-brew-bubble";
const BREW_STEAM = "canop-halloween-brew-steam";
const FIRE_FLICKER = "canop-halloween-fire-flicker";

const VIEW_WIDTH = 40;
const VIEW_HEIGHT = 36;

export interface CauldronPuff {
  x: number;
  y: number;
  seconds: number;
  delay: number;
}

function share(units: number, span: number): string {
  return `${((units / span) * 100).toFixed(3)}%`;
}

function origin(puff: CauldronPuff): string {
  return `${share(puff.x, VIEW_WIDTH)} ${share(puff.y, VIEW_HEIGHT)}`;
}

function rise(units: number): string {
  return `translateY(${share(units, VIEW_HEIGHT)})`;
}

export function cauldronSx(): CSSObject {
  return {
    position: "absolute",
    right: "21%",
    bottom: "clamp(0.5rem, 3%, 1.5rem)",
    width: "clamp(3.5rem, 8vw, 5.5rem)",
    aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}`,
    "& [data-part='pot']": { fill: halloweenTone("cauldron") },
    "& [data-part='brew'], & [data-part='bubble']": { fill: halloweenTone("brew") },
    "& [data-part='fire']": { fill: halloweenTone("pumpkinGlow") },
    "& [data-part='steam']": {
      fill: "none",
      stroke: halloweenTone("steam"),
      strokeLinecap: "round",
    },
  };
}

export function fireSx(animated: boolean): CSSObject {
  return when(animated, {
    animation: loop(FIRE_FLICKER, 2.1, 0, "alternate"),
    ...keyframes(FIRE_FLICKER, {
      "0%": { opacity: 0.6 },
      "100%": { opacity: 1 },
    }),
  });
}

export function steamSx(puff: CauldronPuff, animated: boolean): CSSObject {
  return {
    transformOrigin: origin(puff),
    ...when(animated, {
      animation: loop(BREW_STEAM, puff.seconds, puff.delay, "normal", "ease-out"),
      ...keyframes(BREW_STEAM, {
        "0%": { opacity: 0, transform: `${rise(0)} scaleX(1)` },
        "30%": { opacity: 1 },
        "100%": { opacity: 0, transform: `${rise(-12)} scaleX(1.3)` },
      }),
    }),
  };
}

export function bubbleSx(puff: CauldronPuff, animated: boolean): CSSObject {
  return {
    transformOrigin: origin(puff),
    ...when(animated, {
      animation: loop(BREW_BUBBLE, puff.seconds, puff.delay, "normal", "ease-out"),
      ...keyframes(BREW_BUBBLE, {
        "0%": { opacity: 0, transform: `${rise(1.6)} scale(0.6)` },
        "20%": { opacity: 0.95 },
        "100%": { opacity: 0, transform: `${rise(-9.6)} scale(1.2)` },
      }),
    }),
  };
}
