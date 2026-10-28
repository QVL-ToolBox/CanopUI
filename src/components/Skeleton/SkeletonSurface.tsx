import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { squircleSurface } from "../../squircle";
import { tokens } from "../../tokens";
import { skeletonRevealSx } from "./skeletonRevealSx";

interface SkeletonSurfaceProps {
  radius: string;
  order: number;
  padding?: "sm" | "md";
  gridColumn?: string;
  children: ReactNode;
}

export function SkeletonSurface({
  radius,
  order,
  padding = "md",
  gridColumn,
  children,
}: SkeletonSurfaceProps) {
  return (
    <Box
      sx={{
        gridColumn,
        padding: tokens.spacing[padding],
        ...squircleSurface({
          radius,
          background: "var(--canop-palette-background-paper)",
          shadow: "var(--canop-drop-shadow-e1)",
        }),
        ...skeletonRevealSx(order),
      }}
    >
      {children}
    </Box>
  );
}
