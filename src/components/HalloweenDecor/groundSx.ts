import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenSide } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const TREE_SWAY = "canop-halloween-tree-sway";
const CAT_BLINK = "canop-halloween-cat-blink";
const CAT_TAIL = "canop-halloween-cat-tail";

const SVG_BLOCK: CSSObject = {
  display: "block",
  width: "100%",
  height: "auto",
  overflow: "visible",
};

export function hillsSx(): CSSObject {
  return {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "clamp(3.5rem, 15%, 8rem)",
    "& [data-part='far']": { fill: halloweenTone("hillFar") },
    "& [data-part='near']": { fill: halloweenTone("hillNear") },
  };
}

export function treeAnchorSx(side: HalloweenSide): CSSObject {
  return {
    position: "absolute",
    bottom: "clamp(1.5rem, 7%, 4rem)",
    [side]: "-2%",
    width: "clamp(6rem, 16vw, 12rem)",
    transform: side === "right" ? "scaleX(-1)" : "none",
  };
}

export function treeSx(side: HalloweenSide, animated: boolean): CSSObject {
  return {
    display: "block",
    color: halloweenTone("tree"),
    transformOrigin: "50% 100%",
    "& > svg": SVG_BLOCK,
    ...when(animated, {
      animation: loop(TREE_SWAY, side === "left" ? 9.7 : 11.3, 0, "alternate"),
      ...keyframes(TREE_SWAY, {
        "0%": { transform: "rotate(-0.8deg)" },
        "100%": { transform: "rotate(0.8deg)" },
      }),
    }),
  };
}

export function graveyardSx(): CSSObject {
  return {
    position: "absolute",
    left: "17%",
    bottom: "clamp(0.5rem, 3%, 1.5rem)",
    width: "clamp(8rem, 20vw, 14rem)",
    "& > svg": { ...SVG_BLOCK, position: "relative" },
    "& [data-part='stone']": { fill: halloweenTone("stone") },
    "& [data-part='engraving']": {
      fill: "none",
      stroke: halloweenTone("engraving"),
      strokeLinecap: "round",
    },
  };
}

export function catSx(): CSSObject {
  return {
    position: "absolute",
    left: "55%",
    bottom: "76%",
    width: "15%",
    aspectRatio: "26 / 28",
    "& [data-part='body']": {
      fill: halloweenTone("cat"),
      filter: `drop-shadow(0 0 0.2rem ${halloweenTone("ghostGlow")})`,
    },
    "& [data-part='tail']": {
      fill: "none",
      stroke: halloweenTone("cat"),
      strokeLinecap: "round",
    },
    "& [data-part='eye']": { fill: halloweenTone("catEye") },
  };
}

export function catTailSx(animated: boolean): CSSObject {
  return {
    transformOrigin: "69% 93%",
    ...when(animated, {
      animation: loop(CAT_TAIL, 3.7, 0, "alternate"),
      ...keyframes(CAT_TAIL, {
        "0%": { transform: "rotate(-8deg)" },
        "100%": { transform: "rotate(6deg)" },
      }),
    }),
  };
}

export function catEyesSx(animated: boolean): CSSObject {
  return {
    transformOrigin: "50% 35.714%",
    ...when(animated, {
      animation: loop(CAT_BLINK, 6.1, -2, "normal", "linear"),
      ...keyframes(CAT_BLINK, {
        "0%, 92%, 100%": { transform: "scaleY(1)" },
        "95%": { transform: "scaleY(0.1)" },
      }),
    }),
  };
}
