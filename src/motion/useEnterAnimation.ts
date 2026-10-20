import type { TargetAndTransition, Transition } from "framer-motion";
import type { CanopMotionDuration, CanopMotionEasing } from "../tokens";
import { enterOffset, type CanopEnterDirection } from "./enterOffset";
import { motionDurationSeconds, motionEasing } from "./motionTokens";
import { useReducedMotion } from "./useReducedMotion";

export interface UseEnterAnimationOptions {
  direction?: CanopEnterDirection;
  distance?: string;
  duration?: CanopMotionDuration;
  easing?: CanopMotionEasing;
  delay?: number;
  disabled?: boolean;
}

export interface UseEnterAnimationResult {
  initial: TargetAndTransition | false;
  animate: TargetAndTransition;
  transition: Transition;
}

export function useEnterAnimation({
  direction = "up",
  distance = "1rem",
  duration = "base",
  easing = "organic",
  delay = 0,
  disabled = false,
}: UseEnterAnimationOptions = {}): UseEnterAnimationResult {
  const systemReduced = useReducedMotion();
  const reduced = systemReduced || disabled;

  if (reduced) {
    return {
      initial: false,
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, ...enterOffset(direction, distance) },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: motionDurationSeconds[duration], ease: motionEasing[easing], delay },
  };
}
