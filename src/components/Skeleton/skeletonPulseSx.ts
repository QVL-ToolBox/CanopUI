const PULSE = "canop-skeleton-pulse";
const PULSE_DURATION = "1.6s";

export const skeletonPulseSx = {
  animation: `${PULSE} ${PULSE_DURATION} var(--canop-motion-ease-standard) infinite`,
  [`@keyframes ${PULSE}`]: {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.45 },
    "100%": { opacity: 1 },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};
