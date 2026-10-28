import type { CSSObject } from "@mui/material/styles";
import { glyphFrameSx } from "./glyphLayerSx";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenSpiderSpec, HalloweenWebSpec } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";
import type { SpiderWebDew } from "./spiderWebGeometry";

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

const DEW_DIAMETER = "1.8%";

export function webSx(spec: HalloweenWebSpec, animated: boolean): CSSObject {
  return {
    ...glyphFrameSx("1"),
    transformOrigin: "0 0",
    "& [data-part='strand']": { stroke: halloweenTone("web") },
    ...when(animated, {
      animation: loop(WEB_SWAY, 6.3, spec.delay, "alternate"),
      ...keyframes(WEB_SWAY, {
        "0%": { transform: "scale(1, 1)" },
        "100%": { transform: "scale(1.025, 1.045)" },
      }),
    }),
  };
}

export function dewSx(
  dew: SpiderWebDew,
  index: number,
  spec: HalloweenWebSpec,
  animated: boolean,
): CSSObject {
  return {
    position: "absolute",
    left: `${dew.cx}%`,
    top: `${dew.cy}%`,
    width: DEW_DIAMETER,
    height: DEW_DIAMETER,
    borderRadius: "50%",
    backgroundColor: halloweenTone("star"),
    transform: "translate(-50%, -50%)",
    opacity: 0.7,
    ...when(animated, {
      animation: loop(DEW_GLINT, index % 2 === 1 ? 4.1 : 3.3, spec.delay, "alternate"),
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
    ...glyphFrameSx("1"),
    color: halloweenTone("spider"),
    "& [data-part='eye']": { fill: halloweenTone("spiderEye") },
    "& [data-part='legs']": {
      fill: "none",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    ...drop(STATIC_DROP),
    ...when(animated, {
      animation: loop(SPIDER_DROP, spec.cycle, spec.delay),
      ...keyframes(SPIDER_DROP, {
        "0%, 30%, 100%": drop(0.2),
        "52%": drop(1),
        "60%": drop(0.94),
        "64%, 78%": drop(1),
        "92%": drop(0.2),
      }),
    }),
  };
}

export function spiderLegsSx(spec: HalloweenSpiderSpec, animated: boolean): CSSObject {
  return when(animated, {
    animation: loop(SPIDER_LEGS, 0.7, spec.delay, "alternate"),
    ...keyframes(SPIDER_LEGS, {
      "0%": { transform: "scaleX(1)" },
      "100%": { transform: "scaleX(0.9)" },
    }),
  });
}
