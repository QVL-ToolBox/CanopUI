import type { CSSObject } from "@mui/material/styles";
import { squircleSurface } from "../../squircle";
import {
  NAVBAR_EDGE,
  NAVBAR_POPOVER_SHADOW,
  NAVBAR_RADIUS,
  NAVBAR_SURFACE,
  NAVBAR_SURFACE_SHADOW,
} from "./navbarTone";

const HAIRLINE = "0.0625rem";

export interface NavbarFloatingSurfaceOptions {
  background?: string;
  position?: "relative" | "fixed";
}

export function navbarFloatingSurfaceSx({
  background = NAVBAR_SURFACE,
  position = "relative",
}: NavbarFloatingSurfaceOptions = {}): CSSObject {
  return squircleSurface({
    radius: NAVBAR_RADIUS,
    background,
    shadow: NAVBAR_SURFACE_SHADOW,
    position,
  });
}

export function navbarPopoverSurfaceSx(radius: string): CSSObject {
  return squircleSurface({
    radius,
    background: NAVBAR_SURFACE,
    shadow: NAVBAR_POPOVER_SHADOW,
    position: "absolute",
  });
}

export const navbarPanelSx: CSSObject = {
  height: "100%",
  position: "relative",
  background: NAVBAR_SURFACE,
  borderRight: `${HAIRLINE} solid ${NAVBAR_EDGE}`,
};
