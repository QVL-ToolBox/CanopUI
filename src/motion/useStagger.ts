import type { Variants } from "framer-motion";
import type { CanopMotionDuration, CanopMotionEasing } from "../tokens";
import { enterOffset, type CanopEnterDirection } from "./enterOffset";
import { motionDurationSeconds, motionEasing } from "./motionTokens";
import { useReducedMotion } from "./useReducedMotion";

export interface UseStaggerOptions {
  stagger?: number;
  delayChildren?: number;
  direction?: CanopEnterDirection;
  distance?: string;
  duration?: CanopMotionDuration;
  easing?: CanopMotionEasing;
  once?: boolean;
  amount?: number;
  disabled?: boolean;
}

export interface UseStaggerContainerProps {
  initial: string;
  whileInView: string;
  viewport: { once: boolean; amount: number };
  variants: Variants;
}

export interface UseStaggerResult {
  container: UseStaggerContainerProps;
  item: { variants: Variants };
  reducedMotion: boolean;
}

export function useStagger({
  stagger = motionDurationSeconds.instant,
  delayChildren = 0,
  direction = "up",
  distance = "1rem",
  duration = "base",
  easing = "organic",
  once = true,
  amount = 0.1,
  disabled = false,
}: UseStaggerOptions = {}): UseStaggerResult {
  const systemReduced = useReducedMotion();
  const reduced = systemReduced || disabled;

  const container: UseStaggerContainerProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, amount },
    variants: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduced ? 0 : stagger,
          delayChildren: reduced ? 0 : delayChildren,
        },
      },
    },
  };

  const item: { variants: Variants } = {
    variants: reduced
      ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
      : {
          hidden: { opacity: 0, ...enterOffset(direction, distance) },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: motionDurationSeconds[duration], ease: motionEasing[easing] },
          },
        },
  };

  return { container, item, reducedMotion: reduced };
}
