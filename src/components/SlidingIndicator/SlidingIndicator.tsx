import type { AnimationOptions } from "framer-motion";
import { motionDurationSeconds, motionEasing } from "../../motion";
import { useSlidingIndicator } from "../../motion/useSlidingIndicator";
import { squircleClipPath } from "../../squircle";

const TIGHT_SHADOW = "var(--canop-drop-shadow-e1) var(--canop-drop-shadow-e1)";

const SLIDE_TRANSITION: AnimationOptions = {
  duration: motionDurationSeconds.base,
  ease: motionEasing.organic,
};

export interface CanopSlidingIndicatorProps {
  radius?: string;
  shadow?: string;
  halo?: string;
  background?: string;
}

export function SlidingIndicator({
  radius = "var(--canop-radius-md)",
  shadow = TIGHT_SHADOW,
  halo,
  background = "var(--canop-palette-background-paper)",
}: CanopSlidingIndicatorProps) {
  const { frameRef, pillRef } = useSlidingIndicator(SLIDE_TRANSITION);

  return (
    <span
      ref={frameRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        filter: halo ? `${shadow} ${halo}` : shadow,
        pointerEvents: "none",
      }}
    >
      <span
        ref={pillRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "0 0",
          clipPath: squircleClipPath(radius),
          backgroundColor: background,
        }}
      />
    </span>
  );
}
