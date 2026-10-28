import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { squircleClip, tokens } from "@canop/ui";

export interface DemoViewportProps {
  height?: string;
  children: ReactNode;
}

export function DemoViewport({ height = "24rem", children }: DemoViewportProps) {
  return (
    <Box sx={[{ height, width: "100%", overflow: "hidden" }, squircleClip(tokens.radius.sm)]}>
      {children}
    </Box>
  );
}
