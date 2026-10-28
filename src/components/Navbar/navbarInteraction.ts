import type { CSSObject } from "@mui/material/styles";
import { squircleFill } from "../../squircle";
import { hoverOrKeyboardFocus, withoutFocusRing } from "../../interaction";
import {
  NAVBAR_ACTIVE_INK,
  NAVBAR_HOVER_FILL,
  NAVBAR_TEXT,
  NAVBAR_TEXT_STRONG,
} from "./navbarTone";

export const COLOR_TRANSITION =
  "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)";

const PRESS_TRANSITION =
  "transform var(--canop-motion-duration-fast) var(--canop-motion-ease-spring-soft)";

const PRESS_SCALE = 0.98;

export const navbarHoverSx: CSSObject = {
  ...squircleFill(NAVBAR_HOVER_FILL),
  color: NAVBAR_TEXT_STRONG,
};

const pressSx: CSSObject = {
  "@media (prefers-reduced-motion: no-preference)": {
    transition: `${COLOR_TRANSITION}, ${PRESS_TRANSITION}`,
    "&:active": { transform: `scale(${PRESS_SCALE})` },
  },
};

function restingInk(active: boolean, onIndicator: boolean): string {
  if (onIndicator) {
    return NAVBAR_ACTIVE_INK;
  }
  return active ? NAVBAR_TEXT_STRONG : NAVBAR_TEXT;
}

export function navbarInteractionSx(active: boolean, onIndicator = active): CSSObject {
  return {
    color: restingInk(active, onIndicator),
    transition: COLOR_TRANSITION,
    ...withoutFocusRing,
    [hoverOrKeyboardFocus()]: onIndicator ? {} : navbarHoverSx,
    ...pressSx,
  };
}
