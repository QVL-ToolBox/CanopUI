import { tokens } from "../../tokens";

export const pageGutters = {
  xs: tokens.spacing.sm,
  sm: tokens.spacing.lg,
  md: tokens.spacing.xl,
  lg: tokens.spacing["2xl"],
} as const;

export const narrowestPageGutter = pageGutters.xs;
