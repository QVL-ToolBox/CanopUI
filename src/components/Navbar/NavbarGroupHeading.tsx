import Box from "@mui/material/Box";
import { NAVBAR_TEXT_MUTED } from "./navbarTone";

export interface NavbarGroupHeadingProps {
  id: string;
  label: string;
  inset: string;
}

export function NavbarGroupHeading({ id, label, inset }: NavbarGroupHeadingProps) {
  return (
    <Box
      id={id}
      sx={{
        paddingTop: "0.625rem",
        paddingBottom: "0.125rem",
        paddingInline: inset,
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        lineHeight: 1.4,
        textTransform: "uppercase",
        color: NAVBAR_TEXT_MUTED,
        userSelect: "none",
      }}
    >
      {label}
    </Box>
  );
}
