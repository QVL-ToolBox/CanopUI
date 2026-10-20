import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type { HalloweenFireflySpec } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const FOG_DRIFT = "canop-halloween-fog-drift";
const FIREFLY_WANDER = "canop-halloween-firefly-wander";
const FIREFLY_TWINKLE = "canop-halloween-firefly-twinkle";

function fogBank(centers: readonly [number, number, number]): string {
  const fog = halloweenTone("fog");
  const [first, second, third] = centers;
  return [
    `radial-gradient(ellipse 20% 70% at ${first}% 100%, ${fog}, transparent)`,
    `radial-gradient(ellipse 18% 55% at ${second}% 95%, ${fog}, transparent)`,
    `radial-gradient(ellipse 16% 65% at ${third}% 100%, ${fog}, transparent)`,
    `linear-gradient(to top, ${fog}, transparent 55%)`,
  ].join(", ");
}

export function fogLayerSx(depth: "near" | "far", animated: boolean): CSSObject {
  const isNear = depth === "near";
  const driftSeconds = isNear ? 70 : 110;
  const driftDirection = isNear ? "normal" : "reverse";
  return {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "200%",
    height: isNear ? "clamp(6rem, 26%, 13rem)" : "clamp(8rem, 34%, 17rem)",
    backgroundImage: isNear ? fogBank([22, 55, 82]) : fogBank([30, 64, 88]),
    backgroundSize: "50% 100%",
    backgroundRepeat: "repeat-x",
    opacity: isNear ? 1 : 0.7,
    ...when(animated, {
      willChange: "transform",
      animation: `${FOG_DRIFT} ${driftSeconds}s linear infinite ${driftDirection}`,
      ...keyframes(FOG_DRIFT, {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" },
      }),
    }),
  };
}

export function fireflySx(spec: HalloweenFireflySpec, animated: boolean): CSSObject {
  const firefly = halloweenTone("firefly");
  return {
    position: "absolute",
    left: spec.left,
    top: spec.top,
    width: spec.size,
    height: spec.size,
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle, ${firefly}, transparent 70%)`,
    boxShadow: `0 0 0.75rem 0.2rem color-mix(in srgb, ${firefly} 55%, transparent)`,
    opacity: 0.6,
    ...when(animated, {
      animation: [
        loop(FIREFLY_WANDER, spec.drift, spec.delay, "alternate"),
        loop(FIREFLY_TWINKLE, spec.twinkle, spec.delay, "alternate"),
      ].join(", "),
      ...keyframes(FIREFLY_WANDER, {
        "0%": { transform: "translate(0, 0)" },
        "33%": { transform: "translate(0.9rem, -1.4rem)" },
        "66%": { transform: "translate(-0.7rem, -0.6rem)" },
        "100%": { transform: "translate(0.4rem, -2rem)" },
      }),
      ...keyframes(FIREFLY_TWINKLE, {
        "0%": { opacity: 0.15 },
        "100%": { opacity: 0.9 },
      }),
    }),
  };
}
