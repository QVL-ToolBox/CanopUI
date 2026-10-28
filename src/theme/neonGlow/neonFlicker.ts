import type { CSSObject } from "@mui/material/styles";
import { NEON_GLOW_LIT_VAR } from "./glow";
import { NEON_FLICKER_KEYFRAMES, neonGlowSetting } from "./neonGlowRecipe";

const NEON_FLICKER_DURATION = "520ms";

const HOLD_EACH_STEP = "steps(1, end)";

function lit(level: number): CSSObject {
  return { [NEON_GLOW_LIT_VAR]: String(level) };
}

const tubeSwitchingOn: CSSObject = {
  "0%": lit(0),
  "10%": lit(0.9),
  "16%": lit(0.15),
  "28%": lit(1),
  "34%": lit(0.45),
  "46%": lit(1),
};

export const neonFlicker: CSSObject = {
  animationName: neonGlowSetting("flicker"),
  animationDuration: NEON_FLICKER_DURATION,
  animationTimingFunction: HOLD_EACH_STEP,
  animationIterationCount: 1,
  [`@keyframes ${NEON_FLICKER_KEYFRAMES}`]: tubeSwitchingOn,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};
