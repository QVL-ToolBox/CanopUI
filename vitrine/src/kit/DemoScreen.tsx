import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { resetPageInsets, scrollbarSx, squircleClip, tokens } from "@canop/ui";

export interface DemoScreenProps {
  height?: string;
  children: ReactNode;
}

const SCREEN_RADIUS = tokens.radius.sm;
const HAIRLINE = "0.0625rem";

export function DemoScreen({ height = "24rem", children }: DemoScreenProps) {
  return (
    <Box
      sx={{
        width: "100%",
        padding: HAIRLINE,
        backgroundColor: "var(--canop-palette-divider)",
        ...squircleClip(SCREEN_RADIUS),
      }}
    >
      <Box
        sx={{
          position: "relative",
          height,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: "background.default",
          transform: "translateZ(0)",
          contain: "layout paint",
          ...resetPageInsets(),
          ...scrollbarSx("thin"),
          ...squircleClip(`calc(${SCREEN_RADIUS} - ${HAIRLINE})`),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
