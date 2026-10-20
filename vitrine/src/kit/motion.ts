export function fadeUpSx(delayMs = 0) {
  return {
    "@media (prefers-reduced-motion: no-preference)": {
      opacity: 0,
      transform: "translateY(0.75rem)",
      animation: "canopFadeUp 640ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      animationDelay: `${delayMs}ms`,
      "@keyframes canopFadeUp": {
        to: { opacity: 1, transform: "translateY(0)" },
      },
    },
  } as const;
}
