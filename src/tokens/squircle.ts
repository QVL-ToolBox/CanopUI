export const squircle = {
  exponent: {
    rectangle: 3,
    pill: 2.4,
    circle: 5,
    dot: 2.4,
  },
  segments: 12,
  borderWidth: "0.0625rem",
} as const;

export type CanopSquircleShape = keyof typeof squircle.exponent;
export type CanopSquircleTokens = typeof squircle;
