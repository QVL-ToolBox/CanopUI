import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenLeafHue, HalloweenLeafSpec } from "./halloweenSceneTypes";
import { halloweenTone, type HalloweenToneName } from "./halloweenTones";

const LEAF_FALL = "canop-halloween-leaf-fall";
const LEAF_SWAY = "canop-halloween-leaf-sway";
const LEAF_TUMBLE = "canop-halloween-leaf-tumble";

const hueTone: Record<HalloweenLeafHue, HalloweenToneName> = {
  amber: "leafAmber",
  rust: "leafRust",
  plum: "leafPlum",
};

export function leafFallSx(spec: HalloweenLeafSpec, animated: boolean): CSSObject {
  return {
    position: "absolute",
    top: 0,
    left: spec.left,
    width: spec.size,
    height: "100%",
    transform: `translateY(${spec.restY})`,
    ...when(animated, {
      willChange: "transform",
      animation: loop(LEAF_FALL, spec.fall, spec.delay, "normal", "linear"),
      ...keyframes(LEAF_FALL, {
        "0%": { transform: "translateY(-8%)" },
        "100%": { transform: "translateY(104%)" },
      }),
    }),
  };
}

export function leafSwaySx(spec: HalloweenLeafSpec, animated: boolean): CSSObject {
  return when(animated, {
    animation: loop(LEAF_SWAY, spec.sway, spec.delay, "alternate"),
    ...keyframes(LEAF_SWAY, {
      "0%": { transform: "translateX(-1.6rem) rotate(-25deg)" },
      "100%": { transform: "translateX(1.6rem) rotate(25deg)" },
    }),
  });
}

export function leafTumbleSx(spec: HalloweenLeafSpec, animated: boolean): CSSObject {
  return {
    display: "block",
    color: halloweenTone(hueTone[spec.hue]),
    transform: "rotate(20deg)",
    "& > svg": { display: "block", width: "100%", height: "auto" },
    ...when(animated, {
      animation: loop(LEAF_TUMBLE, spec.spin, spec.delay, "normal", "linear"),
      ...keyframes(LEAF_TUMBLE, {
        "0%": { transform: "rotate(0deg) scaleY(1)" },
        "50%": { transform: "rotate(180deg) scaleY(-0.6)" },
        "100%": { transform: "rotate(360deg) scaleY(1)" },
      }),
    }),
  };
}
