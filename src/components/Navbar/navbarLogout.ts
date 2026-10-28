import type { CSSObject } from "@mui/material/styles";
import { hoverOrKeyboardFocus } from "../../interaction";
import { squircleSurface } from "../../squircle";
import { COLOR_TRANSITION, navbarHoverSx } from "./navbarInteraction";
import { NAVBAR_TEXT_MUTED } from "./navbarTone";

export function navbarLogoutSx(radius: string): CSSObject {
  return {
    color: NAVBAR_TEXT_MUTED,
    ...squircleSurface({ radius, background: "transparent" }),
    transition: COLOR_TRANSITION,
    [hoverOrKeyboardFocus()]: navbarHoverSx,
  };
}
