import { motion } from "framer-motion";
import { useReducedMotion } from "../../motion";
import { squircleClipPath } from "../../squircle";
import { ACTIVE_INDICATOR_LAYOUT_ID, activeIndicatorTransition } from "./activeIndicator";

const IndicatorSpan = motion.span;

export interface NavbarActiveIndicatorProps {
  radius?: string;
  shadow?: string;
  background?: string;
}

export function NavbarActiveIndicator({
  radius = "var(--canop-radius-md)",
  shadow = "var(--canop-drop-shadow-e1)",
  background = "var(--canop-palette-background-paper)",
}: NavbarActiveIndicatorProps) {
  const reducedMotion = useReducedMotion();

  return (
    <IndicatorSpan
      aria-hidden
      layoutId={ACTIVE_INDICATOR_LAYOUT_ID}
      transition={reducedMotion ? { duration: 0 } : activeIndicatorTransition}
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
