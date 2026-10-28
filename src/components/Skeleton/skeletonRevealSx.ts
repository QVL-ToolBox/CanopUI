import type { CSSObject } from "@mui/material/styles";
import { SKELETON_REVEAL_DELAY_MS, SKELETON_STAGGER_MS } from "./skeletonTiming";

const REVEAL = "canop-skeleton-reveal";
const REVEAL_INSTANT = "canop-skeleton-reveal-instant";

export function skeletonRevealSx(order = 0): CSSObject {
  const delay = `${SKELETON_REVEAL_DELAY_MS + order * SKELETON_STAGGER_MS}ms`;
  return {
    opacity: 0,
    animation: `${REVEAL} var(--canop-motion-duration-slow) var(--canop-motion-ease-organic) ${delay} forwards`,
    [`@keyframes ${REVEAL}`]: {
      from: { opacity: 0, transform: "translateY(0.375rem) scale(0.985)" },
      to: { opacity: 1, transform: "none" },
    },
    [`@keyframes ${REVEAL_INSTANT}`]: {
      to: { opacity: 1 },
    },
    "@media (prefers-reduced-motion: reduce)": {
      animation: `${REVEAL_INSTANT} 1ms linear ${delay} forwards`,
    },
  };
}
