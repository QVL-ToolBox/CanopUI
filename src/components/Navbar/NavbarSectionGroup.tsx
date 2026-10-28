import Box from "@mui/material/Box";
import { useId, type ReactNode } from "react";
import { NavbarGroupHeading } from "./NavbarGroupHeading";

export interface NavbarSectionGroupProps {
  label?: string;
  inset: string;
  children: ReactNode;
}

export function NavbarSectionGroup({ label, inset, children }: NavbarSectionGroupProps) {
  const headingId = useId();

  return (
    <Box
      role={label ? "group" : undefined}
      aria-labelledby={label ? headingId : undefined}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      {label && <NavbarGroupHeading id={headingId} label={label} inset={inset} />}
      {children}
    </Box>
  );
}
