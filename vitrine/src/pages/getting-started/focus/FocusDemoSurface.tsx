import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { squircleSurface, Stack, tokens } from "@canop/ui";

export type FocusDemoLayout = "inline" | "stacked";

export interface FocusDemoSurfaceProps {
  ariaLabel: string;
  layout?: FocusDemoLayout;
  children: ReactNode;
}

export function FocusDemoSurface({
  ariaLabel,
  layout = "inline",
  children,
}: FocusDemoSurfaceProps) {
  const inline = layout === "inline";
  return (
    <Box
      sx={{
        ...squircleSurface({
          radius: tokens.radius.sm,
          background: "var(--canop-palette-background-default)",
          borderColor: "var(--canop-palette-divider)",
          borderWidth: "0.0625rem",
        }),
        padding: { xs: "1.5rem 1rem", md: "2rem" },
      }}
    >
      <Stack
        role="group"
        ariaLabel={ariaLabel}
        direction={inline ? "row" : "column"}
        wrap={inline}
        gap="md"
        alignItems={inline ? "center" : "stretch"}
      >
        {children}
      </Stack>
    </Box>
  );
}
