import type { CSSObject } from "@mui/material/styles";
import { glyphFrameSx } from "./glyphLayerSx";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenPumpkinSpec } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const PUMPKIN_FLICKER = "canop-halloween-pumpkin-flicker";
const PUMPKIN_GLOW = "canop-halloween-pumpkin-glow";

export function pumpkinSx(spec: HalloweenPumpkinSpec): CSSObject {
  return {
    position: "absolute",
    bottom: "clamp(0.25rem, 2%, 1rem)",
    [spec.side]: spec.inset,
    width: spec.size,
  };
}

export function pumpkinGlowSx(spec: HalloweenPumpkinSpec, animated: boolean): CSSObject {
  return {
    position: "absolute",
    inset: "-40%",
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle, ${halloweenTone("pumpkinGlow")}, transparent 65%)`,
    opacity: 0.75,
    ...when(animated, {
      animation: loop(PUMPKIN_GLOW, spec.flicker * 1.15, spec.delay, "alternate"),
      ...keyframes(PUMPKIN_GLOW, {
        "0%": { opacity: 0.55, transform: "scale(0.94)" },
        "100%": { opacity: 0.9, transform: "scale(1.04)" },
      }),
    }),
  };
}

export const pumpkinBodySx: CSSObject = {
  ...glyphFrameSx("1"),
  "& [data-part='body']": { fill: halloweenTone("pumpkin") },
  "& [data-part='rib']": { stroke: halloweenTone("pumpkinRib") },
  "& [data-part='stem']": { stroke: halloweenTone("pumpkinStem") },
  "& [data-part='face']": { fill: halloweenTone("pumpkinFace") },
};

export function pumpkinFaceSx(spec: HalloweenPumpkinSpec, animated: boolean): CSSObject {
  return when(animated, {
    animation: `${PUMPKIN_FLICKER} ${spec.flicker}s ease-in-out ${spec.delay}s infinite`,
    ...keyframes(PUMPKIN_FLICKER, {
      "0%, 100%": { opacity: 1 },
      "14%": { opacity: 0.84 },
      "29%": { opacity: 0.96 },
      "43%": { opacity: 0.8 },
      "61%": { opacity: 1 },
      "78%": { opacity: 0.88 },
    }),
  });
}
