export const scrollbar = {
  width: "0.75rem",
  widthThin: "0.5rem",
  radius: "0.375rem",
  thumbExponent: 3,
  gripWidth: "0.375rem",
  gripHeight: "0.5625rem",
  gripPeriod: "0.25rem",
  gripThickness: "0.0625rem",
} as const;

export type CanopScrollbarTokens = typeof scrollbar;
