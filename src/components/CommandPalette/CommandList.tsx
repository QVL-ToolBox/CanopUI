import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { tokens } from "../../tokens";

export interface CanopCommandListProps {
  id: string;
  ariaLabel?: string;
  maxHeight?: string;
  children: ReactNode;
}

export function CommandList({
  id,
  ariaLabel,
  maxHeight = "24rem",
  children,
}: CanopCommandListProps) {
  return (
    <Stack
      role="listbox"
      id={id}
      aria-label={ariaLabel}
      sx={{
        maxHeight,
        overflowY: "auto",
        overscrollBehavior: "contain",
        padding: tokens.spacing.xs,
      }}
    >
      {children}
    </Stack>
  );
}
