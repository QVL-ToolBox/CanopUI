import type { TargetAndTransition, Transition } from "framer-motion";
import { motionDurationSeconds, motionEasing } from "./motionTokens";
import { reducedOverlayMotion } from "./overlayMotion";
import { usePresenceStaggerDelay } from "./presenceStagger";
import { useEnterAnimation, type UseEnterAnimationResult } from "./useEnterAnimation";
import { useReducedMotion } from "./useReducedMotion";

export interface PresenceItemMotion extends UseEnterAnimationResult {
  exit: TargetAndTransition;
  layout: "position" | false;
}

const PRESENCE_ENTER_DISTANCE = "0.5rem";

const presenceExit: TargetAndTransition = {
  opacity: 0,
  scale: 0.97,
  x: "1.5rem",
  transition: { duration: motionDurationSeconds.base, ease: motionEasing.accelerate },
};

const presenceLayoutTransition: Transition = {
  duration: motionDurationSeconds.base,
  ease: motionEasing.organic,
};

export function usePresenceItemMotion(layout: boolean): PresenceItemMotion {
  const reduced = useReducedMotion();
  const delay = usePresenceStaggerDelay();
  const enter = useEnterAnimation({ distance: PRESENCE_ENTER_DISTANCE, delay });

  if (reduced) {
    return { ...enter, exit: reducedOverlayMotion.exit, layout: false };
  }

  return {
    ...enter,
    transition: { ...enter.transition, layout: presenceLayoutTransition },
    exit: presenceExit,
    layout: layout ? "position" : false,
  };
}
