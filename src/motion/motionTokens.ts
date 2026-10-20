import { tokens } from "../tokens";
import type { CanopMotionDuration, CanopMotionEasing } from "../tokens";

export type CanopCubicBezier = [number, number, number, number];

const msToSeconds = (value: string): number => parseFloat(value) / 1000;

function toCubicBezier(value: string): CanopCubicBezier {
  const parts = value.match(/-?\d*\.?\d+/g);
  if (!parts || parts.length < 4) {
    throw new Error(`Easing token is not a valid cubic-bezier: ${value}`);
  }
  return [Number(parts[0]), Number(parts[1]), Number(parts[2]), Number(parts[3])];
}

export const motionDurationSeconds: Record<CanopMotionDuration, number> = {
  instant: msToSeconds(tokens.motion.duration.instant),
  fast: msToSeconds(tokens.motion.duration.fast),
  base: msToSeconds(tokens.motion.duration.base),
  slow: msToSeconds(tokens.motion.duration.slow),
  slower: msToSeconds(tokens.motion.duration.slower),
};

export const motionEasing: Record<CanopMotionEasing, CanopCubicBezier> = {
  standard: toCubicBezier(tokens.motion.easing.standard),
  organic: toCubicBezier(tokens.motion.easing.organic),
  decelerate: toCubicBezier(tokens.motion.easing.decelerate),
  accelerate: toCubicBezier(tokens.motion.easing.accelerate),
  springSoft: toCubicBezier(tokens.motion.easing.springSoft),
};
