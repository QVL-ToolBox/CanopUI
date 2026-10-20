import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenStarSpec } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const STAR_TWINKLE = "canop-halloween-star-twinkle";
const GLINT_TWINKLE = "canop-halloween-glint-twinkle";

export function starSx(spec: HalloweenStarSpec, animated: boolean): CSSObject {
  const name = spec.glint ? GLINT_TWINKLE : STAR_TWINKLE;
  return {
    position: "absolute",
    left: spec.left,
    top: spec.top,
    width: spec.size,
    height: spec.size,
    color: halloweenTone("star"),
    opacity: 0.55,
    ...(spec.glint ? {} : { borderRadius: "50%", backgroundColor: halloweenTone("star") }),
    ...when(animated, {
      animation: loop(name, spec.twinkle, spec.delay, "alternate"),
      ...keyframes(STAR_TWINKLE, {
        "0%": { opacity: 0.2 },
        "100%": { opacity: 0.95 },
      }),
      ...keyframes(GLINT_TWINKLE, {
        "0%": { opacity: 0.25, transform: "scale(0.7) rotate(0deg)" },
        "100%": { opacity: 0.95, transform: "scale(1.1) rotate(45deg)" },
      }),
    }),
  };
}
