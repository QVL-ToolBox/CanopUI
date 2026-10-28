import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import { NAVBAR_ACTIVE_INK, NAVBAR_SUBITEMS_BADGE } from "./navbarTone";

export interface NavbarSubItemsBadgeProps {
  active: boolean;
}

export function NavbarSubItemsBadge({ active }: NavbarSubItemsBadgeProps) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        width: "0.375rem",
        height: "0.375rem",
        ...squircleClip("50%", { shape: "circle" }),
        backgroundColor: active ? NAVBAR_ACTIVE_INK : NAVBAR_SUBITEMS_BADGE,
        zIndex: 2,
      }}
    />
  );
}
