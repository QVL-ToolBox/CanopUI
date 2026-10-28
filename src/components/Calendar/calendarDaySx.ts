import type { SxProps, Theme } from "@mui/material/styles";
import { hoverOrKeyboardFocus, withoutFocusRing } from "../../interaction";
import { tokens } from "../../tokens";
import { squircleClipPath } from "../../squircle";
import { SQUIRCLE_CLIP_VAR } from "../../squircle/squircleSx";

const DAY_CLIP = squircleClipPath("50%", { shape: "circle" });
const DAY_EASE = "var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)";
const DAY_TRANSITION = `color ${DAY_EASE}, background-color ${DAY_EASE}`;

export const CALENDAR_CELL_SIZE = "clamp(2.25rem, 11vw, 2.75rem)";

export function calendarDaySx(selected: boolean, inMonth: boolean): SxProps<Theme> {
  return {
    ...withoutFocusRing,
    position: "relative",
    isolation: "isolate",
    width: CALENDAR_CELL_SIZE,
    height: CALENDAR_CELL_SIZE,
    flexDirection: "column",
    gap: "0.125rem",
    clipPath: DAY_CLIP,
    [SQUIRCLE_CLIP_VAR]: DAY_CLIP,
    fontFamily: "inherit",
    fontSize: "0.9375rem",
    fontVariantNumeric: "tabular-nums",
    fontWeight: selected ? tokens.typography.fontWeight.bold : tokens.typography.fontWeight.medium,
    color: selected ? "primary.contrastText" : inMonth ? "text.primary" : "text.disabled",
    backgroundColor: "transparent",
    transition: DAY_TRANSITION,
    [hoverOrKeyboardFocus(":not([aria-disabled='true'])")]: {
      backgroundColor: selected ? "transparent" : "action.hover",
    },
    "&[aria-disabled='true']": {
      color: "text.disabled",
      cursor: "not-allowed",
      textDecoration: "line-through",
      textDecorationColor: "var(--canop-palette-divider)",
    },
  };
}

export const selectedDayBackdropSx: SxProps<Theme> = {
  display: "block",
  width: "100%",
  height: "100%",
  clipPath: DAY_CLIP,
  backgroundColor: "primary.main",
};

export function todayMarkerSx(selected: boolean): SxProps<Theme> {
  return {
    position: "absolute",
    bottom: "0.3125rem",
    width: "0.25rem",
    height: "0.25rem",
    borderRadius: "50%",
    backgroundColor: selected ? "primary.contrastText" : "primary.main",
  };
}
