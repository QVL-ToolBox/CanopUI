import Box from "@mui/material/Box";
import { squircleSurface } from "../../squircle";
import type { ReactNode } from "react";

export interface EmptyStatePlainSurfaceProps {
  children: ReactNode;
  minHeight: string;
}

export function EmptyStatePlainSurface({ children, minHeight }: EmptyStatePlainSurfaceProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: minHeight,
        padding: "2rem",

        ...squircleSurface({
          radius: "var(--canop-radius-2xl)",
          background: "var(--canop-palette-surface-overlay)",
          shadow: "var(--canop-drop-shadow-e1)",
        }),
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "32rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
