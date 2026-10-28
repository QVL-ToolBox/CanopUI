import type { CSSObject } from "@mui/material/styles";

const HOVER_STATE = ":hover";
const KEYBOARD_FOCUS_STATES = [":focus-visible", ".Mui-focusVisible"] as const;
const FIELD_ENGAGED_STATES = [HOVER_STATE, ":has(.MuiSelect-select:focus-visible)"] as const;
const ENABLED_FIELD = ":not(.Mui-disabled)";
const ENABLED_VALID_FIELD = `${ENABLED_FIELD}:not(.Mui-error)`;

function selectorFor(states: readonly string[], suffix: string, target = "&"): string {
  return states.map((state) => `${target}${state}${suffix}`).join(", ");
}

export function keyboardFocus(suffix = ""): string {
  return selectorFor(KEYBOARD_FOCUS_STATES, suffix);
}

export function hoverOrKeyboardFocus(suffix = ""): string {
  return selectorFor([HOVER_STATE, ...KEYBOARD_FOCUS_STATES], suffix);
}

export function fieldHoverOrSelectKeyboardFocus(field = "&"): string {
  return selectorFor(FIELD_ENGAGED_STATES, ENABLED_FIELD, field);
}

export function validFieldHoverOrSelectKeyboardFocus(field = "&"): string {
  return selectorFor(FIELD_ENGAGED_STATES, ENABLED_VALID_FIELD, field);
}

export const withoutFocusRing: CSSObject = {
  outline: "none",
  [keyboardFocus()]: { outline: "none" },
};
