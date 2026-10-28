import type { CSSObject, Theme } from "@mui/material/styles";
import { switchClasses } from "@mui/material/Switch";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import { keyboardFocus } from "../interaction";

export const PALETTE_COLORS = [
  "primary",
  "secondary",
  "accent",
  "error",
  "warning",
  "info",
  "success",
] as const;

type FocusTheme = Pick<Theme, "alpha" | "palette" | "shadows" | "vars">;

type VariantState = Partial<
  Record<"color" | "variant" | "disabled" | "disableRipple" | "disableElevation", unknown>
>;

interface StateVariant {
  props: (state: VariantState) => boolean;
  style: CSSObject;
}

type FocusOverride = CSSObject & { variants: StateVariant[] };

function themeValues(theme: FocusTheme) {
  return theme.vars ?? theme;
}

function onKeyboardFocus(style: CSSObject): CSSObject {
  return { [keyboardFocus()]: style };
}

function hoverFill(theme: FocusTheme, color: string): CSSObject {
  const opacity = themeValues(theme).palette.action.hoverOpacity;
  return onKeyboardFocus({ backgroundColor: theme.alpha(color, opacity) });
}

function rippleEnabled(state: VariantState): boolean {
  return !state.disabled && !state.disableRipple;
}

function inheritContainedHoverBackground(theme: FocusTheme): string {
  if (theme.vars) return theme.vars.palette.Button.inheritContainedHoverBg;
  return theme.palette.mode === "light" ? theme.palette.grey.A100 : theme.palette.grey[700];
}

export function selectionControlKeyboardFocus(theme: FocusTheme): FocusOverride {
  const { palette } = themeValues(theme);
  return {
    variants: [
      {
        props: (state) => state.color === "default" && rippleEnabled(state),
        style: hoverFill(theme, palette.action.active),
      },
      ...PALETTE_COLORS.map((color): StateVariant => ({
        props: (state) => state.color === color && rippleEnabled(state),
        style: hoverFill(theme, palette[color].main),
      })),
    ],
  };
}

export function switchBaseKeyboardFocus(theme: FocusTheme): FocusOverride {
  const { palette } = themeValues(theme);
  return {
    ...hoverFill(theme, palette.action.active),
    variants: PALETTE_COLORS.map((color): StateVariant => ({
      props: (state) => state.color === color,
      style: { [`&.${switchClasses.checked}`]: hoverFill(theme, palette[color].main) },
    })),
  };
}

export function toggleButtonKeyboardFocus(theme: FocusTheme): FocusOverride {
  const { palette } = themeValues(theme);
  const { hoverOpacity, selectedOpacity } = palette.action;
  const selectedHover = (color: string): CSSObject => ({
    [`&.${toggleButtonClasses.selected}`]: onKeyboardFocus({
      backgroundColor: theme.alpha(color, `${selectedOpacity} + ${hoverOpacity}`),
    }),
  });
  return {
    ...hoverFill(theme, palette.text.primary),
    variants: [
      {
        props: (state) => state.color === "standard",
        style: selectedHover(palette.text.primary),
      },
      ...PALETTE_COLORS.map((color): StateVariant => ({
        props: (state) => state.color === color,
        style: selectedHover(palette[color].main),
      })),
    ],
  };
}

export function buttonKeyboardFocus(theme: FocusTheme): FocusOverride {
  const { palette, shadows } = themeValues(theme);
  const hoverTint = (color: string) => theme.alpha(color, palette.action.hoverOpacity);
  return {
    variants: [
      {
        props: (state) => state.variant === "contained" && !state.disableElevation,
        style: onKeyboardFocus({ boxShadow: shadows[4] }),
      },
      ...PALETTE_COLORS.map((color): StateVariant => ({
        props: (state) => state.color === color,
        style: onKeyboardFocus({
          "--variant-containedBg": palette[color].dark,
          "--variant-textBg": hoverTint(palette[color].main),
          "--variant-outlinedBorder": palette[color].main,
          "--variant-outlinedBg": hoverTint(palette[color].main),
        }),
      })),
      {
        props: (state) => state.color === "inherit",
        style: onKeyboardFocus({
          "--variant-containedBg": inheritContainedHoverBackground(theme),
          "--variant-textBg": hoverTint(palette.text.primary),
          "--variant-outlinedBg": hoverTint(palette.text.primary),
        }),
      },
    ],
  };
}

export function fabKeyboardFocus(theme: FocusTheme): FocusOverride {
  const { palette } = themeValues(theme);
  return {
    ...onKeyboardFocus({ backgroundColor: palette.grey.A100 }),
    variants: PALETTE_COLORS.map((color): StateVariant => ({
      props: (state) => state.color === color,
      style: onKeyboardFocus({ backgroundColor: palette[color].dark }),
    })),
  };
}
