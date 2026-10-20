export const motion = {
  duration: {
    instant: "80ms",
    fast: "140ms",
    base: "220ms",
    slow: "320ms",
    slower: "480ms",
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    organic: "cubic-bezier(0.22, 1, 0.36, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    springSoft: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export type CanopMotionDuration = keyof typeof motion.duration;
export type CanopMotionEasing = keyof typeof motion.easing;
