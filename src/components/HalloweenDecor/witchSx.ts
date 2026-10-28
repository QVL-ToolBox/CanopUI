import type { CSSObject } from "@mui/material/styles";
import { glyphFrameSx } from "./glyphLayerSx";
import { keyframes, loop } from "./halloweenMotion";
import type { HalloweenSparkleSpec, HalloweenWitchSpec } from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const WITCH_SIZE = "clamp(5rem, 11vw, 8rem)";

const WITCH_TRAVERSE = "canop-halloween-witch-traverse";
const WITCH_ALTITUDE = "canop-halloween-witch-altitude";
const WITCH_BOB = "canop-halloween-witch-bob";
const CAPE_FLUTTER = "canop-halloween-cape-flutter";
const HAT_WOBBLE = "canop-halloween-hat-wobble";
const SPARKLE_TRAIL = "canop-halloween-sparkle-trail";

function flight(lift: string, tilt: number): CSSObject {
  return { transform: `translateY(${lift}) rotate(${tilt}deg)` };
}

export function witchTrackSx(spec: HalloweenWitchSpec): CSSObject {
  return {
    "@media (prefers-reduced-motion: reduce)": { display: "none" },
    position: "absolute",
    top: "14%",
    left: 0,
    width: "100%",
    transform: "translateX(-30%)",
    willChange: "transform",
    animation: loop(WITCH_TRAVERSE, spec.cycle, spec.delay, "normal", "linear"),
    ...keyframes(WITCH_TRAVERSE, {
      "0%": { transform: "translateX(-30%)" },
      "16%, 100%": { transform: "translateX(115%)" },
    }),
  };
}

export function witchAltitudeSx(spec: HalloweenWitchSpec): CSSObject {
  return {
    animation: loop(WITCH_ALTITUDE, spec.cycle, spec.delay),
    ...keyframes(WITCH_ALTITUDE, {
      "0%": flight("10rem", -12),
      "6%": flight("5.5rem", -14),
      "10%": flight("3rem", -4),
      "13%": flight("0.5rem", -10),
      "16%, 100%": flight("-4rem", -8),
    }),
  };
}

export function witchBobSx(): CSSObject {
  return {
    animation: loop(WITCH_BOB, 2.9, 0, "alternate"),
    ...keyframes(WITCH_BOB, {
      "0%": { transform: "translateY(-0.35rem) rotate(-2deg)" },
      "100%": { transform: "translateY(0.35rem) rotate(2deg)" },
    }),
  };
}

export function witchFigureSx(): CSSObject {
  return {
    position: "relative",
    width: WITCH_SIZE,
    transform: "translate(-50%, -50%)",
  };
}

export function witchSilhouetteSx(): CSSObject {
  return {
    ...glyphFrameSx("80 / 48"),
    color: halloweenTone("witch"),
    filter: `drop-shadow(0 0 0.4rem ${halloweenTone("witchGlow")})`,
    "& [data-part='accent']": { fill: halloweenTone("witchAccent") },
    "& [data-part='stick']": { stroke: "currentColor" },
  };
}

export function witchCapeSx(): CSSObject {
  return {
    transformOrigin: "50.625% 32.292%",
    animation: loop(CAPE_FLUTTER, 0.62, 0, "alternate"),
    ...keyframes(CAPE_FLUTTER, {
      "0%": { transform: "scaleX(1) skewY(0deg)" },
      "100%": { transform: "scaleX(1.12) skewY(-6deg)" },
    }),
  };
}

export function witchHatSx(): CSSObject {
  return {
    transformOrigin: "62% 22.431%",
    animation: loop(HAT_WOBBLE, 1.3, 0, "alternate"),
    ...keyframes(HAT_WOBBLE, {
      "0%": { transform: "rotate(-4deg)" },
      "100%": { transform: "rotate(5deg)" },
    }),
  };
}

export function sparkleSx(spec: HalloweenSparkleSpec): CSSObject {
  const sparkle = halloweenTone("sparkle");
  return {
    position: "absolute",
    left: spec.left,
    top: spec.top,
    width: spec.size,
    height: spec.size,
    borderRadius: "50%",
    backgroundImage: `radial-gradient(circle, ${sparkle}, transparent 70%)`,
    boxShadow: `0 0 0.5rem 0.1rem color-mix(in srgb, ${sparkle} 60%, transparent)`,
    opacity: 0,
    animation: loop(SPARKLE_TRAIL, spec.seconds, spec.delay, "normal", "ease-out"),
    ...keyframes(SPARKLE_TRAIL, {
      "0%": { opacity: 0.95, transform: "translate(0, 0) scale(1)" },
      "100%": { opacity: 0, transform: "translate(-2.75rem, 1.25rem) scale(0.3)" },
    }),
  };
}
