export const breakpoints = {
  unit: "rem",
  values: {
    xs: 0,
    sm: 37.5,
    md: 64,
    lg: 90,
  },
} as const;

export type CanopBreakpoint = keyof typeof breakpoints.values;
