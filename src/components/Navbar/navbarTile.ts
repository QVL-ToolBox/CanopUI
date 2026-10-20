import type { CSSObject } from "@mui/material/styles";
import { squircleFill, squircleSurface } from "../../squircle";
import { NAVBAR_HOVER_OVERLAY } from "./navbarStyles";

export const NAVBAR_TILE_SIZE = "3rem";

export function navbarTileSx(active: boolean, size: string = NAVBAR_TILE_SIZE): CSSObject {
  return {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    ...squircleSurface({ radius: "var(--canop-radius-lg)", background: "transparent" }),
    color: active ? "primary.main" : "primary.contrastText",
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
    "&:hover": active ? {} : squircleFill(NAVBAR_HOVER_OVERLAY),
  } as const;
}
