import { motion, type Transition } from "framer-motion";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import { squircleClipPath } from "../../squircle";

const IndicatorSpan = motion.span;

export interface CanopSlidingIndicatorProps {
  layoutId?: string;
  radius?: string;
  shadow?: string;
  background?: string;
  transition?: Transition;
}

export function SlidingIndicator({
  layoutId = "canop-sliding-indicator",
  radius = "var(--canop-radius-md)",
  shadow = "var(--canop-drop-shadow-e1)",
  background = "var(--canop-palette-background-paper)",
  transition,
}: CanopSlidingIndicatorProps) {
  const reducedMotion = useReducedMotion();

  return (
    <IndicatorSpan
      aria-hidden
      layoutId={layoutId}
      transition={
        reducedMotion
          ? { duration: 0 }
          : (transition ?? { duration: motionDurationSeconds.base, ease: motionEasing.organic })
      }
      style={{
        position: "absolute",
        inset: 0,
        clipPath: squircleClipPath(radius),
        backgroundColor: background,
        filter: shadow,
        zIndex: 0,
      }}
    />
  );
}
