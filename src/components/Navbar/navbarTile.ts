import type { CSSObject } from "@mui/material/styles";
import { squircleSurface } from "../../squircle";
import { navbarInteractionSx } from "./navbarInteraction";

export const NAVBAR_TILE_SIZE_REM = 3;

const NAVBAR_TILE_SIZE = `${NAVBAR_TILE_SIZE_REM}rem`;

export const NAVBAR_TILE_RADIUS = "var(--canop-radius-lg)";

export function navbarTileSx(active: boolean): CSSObject {
  return {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: NAVBAR_TILE_SIZE,
    height: NAVBAR_TILE_SIZE,
    ...squircleSurface({ radius: NAVBAR_TILE_RADIUS, background: "transparent" }),
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    textDecoration: "none",
    ...navbarInteractionSx(active),
  };
}
