import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { squircleFill, squircleShadow, squircleSurface } from "../../squircle";
import type { CanopButtonSize, CanopButtonVariant } from "./Button";

type MuiButtonVariant = "contained" | "outlined" | "text";
type MuiButtonColor = "primary" | "secondary" | "error" | "accent";

export interface UseButtonResult {
  muiVariant: MuiButtonVariant;
  muiColor: MuiButtonColor;
  sx: SxProps<Theme>;
}

const muiMapping: Record<CanopButtonVariant, { variant: MuiButtonVariant; color: MuiButtonColor }> =
  {
    primary: { variant: "contained", color: "primary" },
    secondary: { variant: "contained", color: "secondary" },
    accent: { variant: "contained", color: "accent" },
    danger: { variant: "contained", color: "error" },
    tonal: { variant: "contained", color: "primary" },
    ghost: { variant: "outlined", color: "primary" },
    text: { variant: "text", color: "primary" },
  };

const sizeStyles: Record<
  CanopButtonSize,
  { minHeight: Record<string, string>; paddingX: number; fontSize: string }
> = {
  small: { minHeight: { xs: "2.5rem", sm: "2.25rem" }, paddingX: 1.75, fontSize: "0.8125rem" },
  medium: { minHeight: { xs: "3rem", sm: "2.75rem" }, paddingX: 2.5, fontSize: "0.875rem" },
  large: { minHeight: { xs: "3.25rem", sm: "3rem" }, paddingX: 3.25, fontSize: "1rem" },
};

const transition = [
  "transform var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
  "filter var(--canop-motion-duration-base) var(--canop-motion-ease-standard)",
  "color var(--canop-motion-duration-base) var(--canop-motion-ease-standard)",
].join(", ");

const layerTransition =
  "background var(--canop-motion-duration-base) var(--canop-motion-ease-standard)";

const tonalBackground =
  "color-mix(in srgb, var(--canop-palette-primary-light) 26%, var(--canop-palette-background-paper))";
const tonalBackgroundHover =
  "color-mix(in srgb, var(--canop-palette-primary-light) 40%, var(--canop-palette-background-paper))";

interface ButtonFill {
  rest: string;
  hover: string;
  border?: string;
  hoverShadow?: string;
}

const UNFILLED_VARIANT_TEXT_FOLLOWS_THEME = "var(--canop-palette-text-primary)";

function fillsFor(isDark: boolean): Record<CanopButtonVariant, ButtonFill> {
  return {
    primary: {
      rest: "var(--canop-palette-primary-main)",
      hover: "var(--canop-palette-primary-dark)",
      hoverShadow: "var(--canop-drop-shadow-e2)",
    },
    secondary: {
      rest: isDark ? "var(--canop-palette-secondary-main)" : "var(--canop-palette-secondary-dark)",
      hover: isDark
        ? "var(--canop-palette-secondary-dark)"
        : "color-mix(in srgb, var(--canop-palette-secondary-dark) 86%, #000)",
      hoverShadow: "var(--canop-drop-shadow-e2)",
    },
    accent: {
      rest: "var(--canop-palette-accent-main)",
      hover: "var(--canop-palette-accent-dark)",
      hoverShadow: "var(--canop-drop-shadow-e2)",
    },
    danger: {
      rest: "var(--canop-palette-error-main)",
      hover: "var(--canop-palette-error-dark)",
      hoverShadow: "var(--canop-drop-shadow-e2)",
    },
    tonal: {
      rest: tonalBackground,
      hover: tonalBackgroundHover,
      hoverShadow: "var(--canop-drop-shadow-e1)",
    },
    ghost: {
      rest: "transparent",
      hover: "color-mix(in srgb, var(--canop-palette-primary-main) 8%, transparent)",
      border: "var(--canop-palette-primary-main)",
    },
    text: {
      rest: "transparent",
      hover: "var(--canop-palette-action-hover)",
    },
  };
}

function buildButtonSx(
  variant: CanopButtonVariant,
  size: CanopButtonSize,
  isDark: boolean,
): SxProps<Theme> {
  const dimensions = sizeStyles[size];
  const fill = fillsFor(isDark)[variant];

  return {
    ...squircleSurface({
      radius: "var(--canop-radius-md)",
      background: fill.rest,
      borderColor: fill.border,
      shadowTransition: layerTransition,
    }),
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "none",
    border: "none",
    minHeight: dimensions.minHeight,
    paddingX: dimensions.paddingX,
    fontSize: dimensions.fontSize,
    transition,
    ...(variant === "tonal" ? { color: "var(--canop-palette-primary-main)" } : {}),
    ...(variant === "secondary"
      ? { color: isDark ? "var(--canop-palette-secondary-contrastText)" : "#ffffff" }
      : {}),
    ...(variant === "ghost" || variant === "text"
      ? { color: UNFILLED_VARIANT_TEXT_FOLLOWS_THEME }
      : {}),
    "&:hover": {
      boxShadow: "none",
      ...(fill.border ? { "&::after": { backgroundColor: fill.hover } } : squircleFill(fill.hover)),
      ...(fill.hoverShadow
        ? { ...squircleShadow(fill.hoverShadow), transform: "translateY(-0.0625rem)" }
        : {}),
    },
    "&:active": { boxShadow: "none", transform: "scale(0.97)" },
    "&:focus-visible": {
      outline: "0.1875rem solid var(--canop-palette-primary-main)",
      outlineOffset: "0.1875rem",
    },
    "&.Mui-disabled, &.MuiButton-loading": {
      backgroundColor: "transparent",
      boxShadow: "none",
      filter: "none",
      transform: "none",
      "&::before": {
        backgroundColor: "var(--canop-palette-action-disabledBackground)",
      },
      "&::after": { backgroundColor: "var(--canop-palette-action-disabledBackground)" },
    },
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
      "&:hover": { transform: "none" },
      "&:active": { transform: "none" },
    },
  };
}

export function useButton(variant: CanopButtonVariant, size: CanopButtonSize): UseButtonResult {
  const isDark = useTheme().palette.mode === "dark";
  return useMemo(() => {
    const mapped = muiMapping[variant];
    return {
      muiVariant: mapped.variant,
      muiColor: mapped.color,
      sx: buildButtonSx(variant, size, isDark),
    };
  }, [variant, size, isDark]);
}
