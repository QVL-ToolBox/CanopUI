import type { TargetAndTransition, Transition } from "framer-motion";
import { motionDurationSeconds, motionEasing } from "./motionTokens";

export interface CanopOverlayMotion {
  initial: TargetAndTransition | false;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
}

export const overlayExitTransition: Transition = {
  duration: motionDurationSeconds.fast,
  ease: motionEasing.accelerate,
};

export const overlayInstantTransition: Transition = { duration: 0 };

export const reducedOverlayMotion: CanopOverlayMotion = {
  initial: false,
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: overlayInstantTransition },
  transition: overlayInstantTransition,
};

export function buildOverlayBackdropMotion(opacity: number, reduced: boolean): CanopOverlayMotion {
  return {
    initial: { opacity: 0 },
    animate: { opacity },
    exit: { opacity: 0, transition: reduced ? overlayInstantTransition : overlayExitTransition },
    transition: reduced
      ? overlayInstantTransition
      : { duration: motionDurationSeconds.base, ease: motionEasing.standard },
  };
}
