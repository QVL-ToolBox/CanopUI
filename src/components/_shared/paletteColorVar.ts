export type CanopPaletteColorName =
  "primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success";

export const paletteColorVar: Record<CanopPaletteColorName, string> = {
  primary: "var(--canop-palette-primary-main)",
  secondary: "var(--canop-palette-secondary-main)",
  accent: "var(--canop-palette-accent-main)",
  error: "var(--canop-palette-error-main)",
  warning: "var(--canop-palette-warning-main)",
  info: "var(--canop-palette-info-main)",
  success: "var(--canop-palette-success-main)",
};
