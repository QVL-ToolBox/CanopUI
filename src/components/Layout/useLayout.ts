import type { TargetAndTransition, Transition } from "framer-motion";
import {
  motionDurationSeconds,
  motionEasing,
  useEnterAnimation,
  useReducedMotion,
  type UseEnterAnimationResult,
} from "../../motion";

export interface CanopLayoutCardEntry {
  initial: TargetAndTransition | false;
  animate: TargetAndTransition;
  transition: Transition;
}

export interface UseLayoutResult {
  brandEntry: UseEnterAnimationResult;
  cardEntry: CanopLayoutCardEntry;
  utilitiesEntry: UseEnterAnimationResult;
}

export function useLayout(): UseLayoutResult {
  const reduced = useReducedMotion();
  const brandEntry = useEnterAnimation({ direction: "down", distance: "0.5rem", duration: "base" });
  const utilitiesEntry = useEnterAnimation({
    direction: "down",
    distance: "0.5rem",
    duration: "base",
    delay: motionDurationSeconds.base,
  });

  const cardEntry: CanopLayoutCardEntry = reduced
    ? { initial: false, animate: { opacity: 1, scale: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: motionDurationSeconds.slow,
          ease: motionEasing.organic,
          delay: motionDurationSeconds.fast,
        },
      };

  return { brandEntry, cardEntry, utilitiesEntry };
}
