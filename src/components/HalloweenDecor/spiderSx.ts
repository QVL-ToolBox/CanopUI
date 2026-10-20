import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenSpiderSpec, HalloweenWebSpec } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const THREAD_VAR = "--canop-halloween-thread";

const WEB_SWAY = "canop-halloween-web-sway";
const DEW_GLINT = "canop-halloween-dew-glint";
const SPIDER_SWING = "canop-halloween-spider-swing";
const THREAD_REEL = "canop-halloween-thread-reel";
const SPIDER_DROP = "canop-halloween-spider-drop";
const SPIDER_LEGS = "canop-halloween-spider-legs";

const STATIC_DROP = 0.6;
const SPIDER_WIDTH = "1.4rem";

export function webAnchorSx(spec: HalloweenWebSpec): CSSObject {
  return {
    position: "absolute",
    top: 0,
    [spec.side]: 0,
    width: spec.size,
    transform: spec.side === "right" ? "scaleX(-1)" : "none",
  };
}

const DEW: CSSObject = { fill: halloweenTone("star"), opacity: 0.7 };

const LEGS: CSSObject = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  transformBox: "fill-box",
  transformOrigin: "50% 50%",
};

export function webSx(spec: HalloweenWebSpec, animated: boolean): CSSObject {
  return {
    display: "block",
    width: "100%",
    height: "auto",
    overflow: "visible",
    transformOrigin: "0 0",
    "& [data-part='strand']": { stroke: halloweenTone("web") },
    "& [data-part='dew']": DEW,
    ...when(animated, {
      animation: loop(WEB_SWAY, 6.3, spec.delay, "alternate"),
      "& [data-part='dew']": {
        ...DEW,
        animation: loop(DEW_GLINT, 3.3, spec.delay, "alternate"),
      },
      "& [data-part='dew']:nth-of-type(2n)": { animationDuration: "4.1s" },
      ...keyframes(WEB_SWAY, {
        "0%": { transform: "scale(1, 1)" },
        "100%": { transform: "scale(1.025, 1.045)" },
      }),
      ...keyframes(DEW_GLINT, {
        "0%": { opacity: 0.25 },
        "100%": { opacity: 0.95 },
      }),
    }),
  };
}

export function spiderAnchorSx(spec: HalloweenSpiderSpec, animated: boolean): CSSObject {
  return {
    position: "absolute",
    top: spec.top,
    [spec.side]: `calc(${spec.inset} - ${SPIDER_WIDTH} / 2)`,
    width: SPIDER_WIDTH,
    transformOrigin: "50% 0",
    [THREAD_VAR]: spec.thread,
    ...when(animated, {
      animation: loop(SPIDER_SWING, 4.7, spec.delay, "alternate"),
      ...keyframes(SPIDER_SWING, {
        "0%": { transform: "rotate(-3deg)" },
        "100%": { transform: "rotate(3deg)" },
      }),
    }),
  };
}

function reel(share: number): CSSObject {
  return { transform: `scaleY(${share})` };
}

function drop(share: number): CSSObject {
  return { transform: `translateY(calc(var(${THREAD_VAR}) * ${share} - 0.3rem))` };
}

export function threadSx(spec: HalloweenSpiderSpec, animated: boolean): CSSObject {
  return {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "0.0625rem",
    height: `var(${THREAD_VAR})`,
    backgroundColor: halloweenTone("web"),
    transformOrigin: "50% 0",
    ...reel(STATIC_DROP),
    ...when(animated, {
      animation: loop(THREAD_REEL, spec.cycle, spec.delay),
      ...keyframes(THREAD_REEL, {
        "0%, 30%, 100%": reel(0.2),
        "52%": reel(1),
        "60%": reel(0.94),
        "64%, 78%": reel(1),
        "92%": reel(0.2),
      }),
    }),
  };
}

export function spiderBodySx(spec: HalloweenSpiderSpec, animated: boolean): CSSObject {
  return {
    position: "relative",
    display: "block",
    width: "100%",
    height: "auto",
    color: halloweenTone("spider"),
    "& [data-part='eye']": { fill: halloweenTone("spiderEye") },
    "& [data-part='legs']": LEGS,
    ...drop(STATIC_DROP),
    ...when(animated, {
      animation: loop(SPIDER_DROP, spec.cycle, spec.delay),
      "& [data-part='legs']": {
        ...LEGS,
        animation: loop(SPIDER_LEGS, 0.7, spec.delay, "alternate"),
      },
      ...keyframes(SPIDER_DROP, {
        "0%, 30%, 100%": drop(0.2),
        "52%": drop(1),
        "60%": drop(0.94),
        "64%, 78%": drop(1),
        "92%": drop(0.2),
      }),
      ...keyframes(SPIDER_LEGS, {
        "0%": { transform: "scaleX(1)" },
        "100%": { transform: "scaleX(0.9)" },
      }),
    }),
  };
}
