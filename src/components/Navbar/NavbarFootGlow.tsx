import Box from "@mui/material/Box";
import { NAVBAR_FOOT_GLOW } from "./navbarTone";

export function NavbarFootGlow() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "10rem",
        pointerEvents: "none",
        background: NAVBAR_FOOT_GLOW,
      }}
    />
  );
}
