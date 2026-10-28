import type { Transition, Variants } from "framer-motion";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";

export interface EmptyStateMotion {
  live: boolean;
  initial: "hidden" | false;
  reveal: Variants;
  rise: Variants;
  pop: Variants;
}

const REVEAL_STAGGER_SECONDS = 0.08;
const REVEAL_DELAY_SECONDS = 0.06;
const RISE_DISTANCE = "0.75rem";

const fadeIn: Transition = { duration: motionDurationSeconds.slow, ease: motionEasing.organic };

const settle: Transition = { type: "spring", stiffness: 240, damping: 26, mass: 0.9 };

const bloom: Transition = { type: "spring", stiffness: 260, damping: 15, mass: 0.8 };

const reveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: REVEAL_STAGGER_SECONDS,
      delayChildren: REVEAL_DELAY_SECONDS,
    },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: RISE_DISTANCE },
  visible: { opacity: 1, y: 0, transition: { ...settle, opacity: fadeIn } },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { ...bloom, opacity: fadeIn } },
};

export function useEmptyStateMotion(animated: boolean): EmptyStateMotion {
  const reduced = useReducedMotion();
  const live = animated && !reduced;

  return {
    live,
    initial: live ? "hidden" : false,
    reveal,
    rise,
    pop,
  };
}
