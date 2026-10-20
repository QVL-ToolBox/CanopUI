import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import { halloweenTone } from "./halloweenTones";

const BREW_BUBBLE = "canop-halloween-brew-bubble";
const BREW_STEAM = "canop-halloween-brew-steam";
const FIRE_FLICKER = "canop-halloween-fire-flicker";

const BUBBLE: CSSObject = {
  transformBox: "fill-box",
  transformOrigin: "50% 50%",
  fill: halloweenTone("brew"),
};

const STEAM: CSSObject = {
  transformBox: "fill-box",
  transformOrigin: "50% 100%",
  fill: "none",
  stroke: halloweenTone("steam"),
  strokeLinecap: "round",
};

const FIRE: CSSObject = { fill: halloweenTone("pumpkinGlow") };

function rhythm(seconds: number, delay: number): CSSObject {
  return { animationDuration: `${seconds}s`, animationDelay: `${delay}s` };
}

export function cauldronSx(animated: boolean): CSSObject {
  return {
    position: "absolute",
    right: "21%",
    bottom: "clamp(0.5rem, 3%, 1.5rem)",
    width: "clamp(3.5rem, 8vw, 5.5rem)",
    "& svg": { display: "block", width: "100%", height: "auto", overflow: "visible" },
    "& [data-part='pot']": { fill: halloweenTone("cauldron") },
    "& [data-part='brew']": { fill: halloweenTone("brew") },
    "& [data-part='bubble']": BUBBLE,
    "& [data-part='steam']": STEAM,
    "& [data-part='fire']": FIRE,
    ...when(animated, {
      "& [data-part='bubble']": {
        ...BUBBLE,
        animation: loop(BREW_BUBBLE, 2.3, 0, "normal", "ease-out"),
      },
      "& [data-part='bubble']:nth-of-type(2)": rhythm(1.9, -0.8),
      "& [data-part='bubble']:nth-of-type(3)": rhythm(2.7, -1.6),
      "& [data-part='steam']": {
        ...STEAM,
        animation: loop(BREW_STEAM, 4.3, 0, "normal", "ease-out"),
      },
      "& [data-part='steam']:nth-of-type(2)": rhythm(5.1, -2),
      "& [data-part='fire']": {
        ...FIRE,
        animation: loop(FIRE_FLICKER, 2.1, 0, "alternate"),
      },
      ...keyframes(BREW_BUBBLE, {
        "0%": { opacity: 0, transform: "translateY(0.1rem) scale(0.6)" },
        "20%": { opacity: 0.95 },
        "100%": { opacity: 0, transform: "translateY(-0.6rem) scale(1.2)" },
      }),
      ...keyframes(BREW_STEAM, {
        "0%": { opacity: 0, transform: "translateY(0) scaleX(1)" },
        "30%": { opacity: 1 },
        "100%": { opacity: 0, transform: "translateY(-0.75rem) scaleX(1.3)" },
      }),
      ...keyframes(FIRE_FLICKER, {
        "0%": { opacity: 0.6 },
        "100%": { opacity: 1 },
      }),
    }),
  };
}
