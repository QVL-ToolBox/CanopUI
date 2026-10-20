const fontFamily = "'Chivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const fontFamilyHeading = "'Titan One', 'Chivo', system-ui, sans-serif";

const fontFamilyMono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace";

const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.7,
} as const;

const letterSpacing = {
  tightest: "-0.035em",
  tighter: "-0.028em",
  tight: "-0.022em",
  snug: "-0.016em",
  compact: "-0.011em",
  normal: "-0.006em",
  none: "0em",
  wide: "0.01em",
  wider: "0.08em",
} as const;

const heading = {
  h1: {
    fontSize: "4.21rem",
    fontFamily: fontFamilyHeading,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tightest,
  },
  h2: {
    fontSize: "3.158rem",
    fontFamily: fontFamilyHeading,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  h3: {
    fontSize: "2.369rem",
    fontFamily: fontFamilyHeading,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontSize: "1.777rem",
    fontFamily: fontFamilyHeading,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.snug,
  },
  h5: {
    fontSize: "1.333rem",
    fontFamily: fontFamilyHeading,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.compact,
  },
  h6: {
    fontSize: "1rem",
    fontFamily: fontFamilyHeading,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
} as const;

const display = {
  "display-1": {
    fontSize: "3.815rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tightest,
  },
  "display-2": {
    fontSize: "2.863rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  "display-3": {
    fontSize: "2.145rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  "display-4": {
    fontSize: "1.61rem",
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.snug,
  },
} as const;

const app = {
  "title-lg": {
    fontSize: "1.5rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.compact,
  },
  "title-md": {
    fontSize: "1.25rem",
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.compact,
  },
  "title-sm": {
    fontSize: "1.0625rem",
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  lead: {
    fontSize: "1.125rem",
    fontWeight: fontWeight.light,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  "body-lg": {
    fontSize: "1rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  "body-md": {
    fontSize: "0.9375rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  "body-sm": {
    fontSize: "0.8125rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.none,
  },
  label: {
    fontSize: "0.8125rem",
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.none,
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  overline: {
    fontSize: "0.6875rem",
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.wider,
  },
  metric: {
    fontSize: "1.75rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.snug,
  },
  code: {
    fontFamily: fontFamilyMono,
    fontSize: "0.875rem",
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.none,
  },
} as const;

export const typography = {
  fontFamily,
  fontFamilyHeading,
  fontFamilyMono,
  fontSize: {
    xs: "0.75rem",
    sm: "0.9rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    xxl: "2rem",
  },
  heading,
  display,
  app,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const;
