import MuiStack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { squircleClip, tokens } from "@canop/ui";

export interface PaintedBackdropProps {
  paint: string;
  children: ReactNode;
}

export function PaintedBackdrop({ paint, children }: PaintedBackdropProps) {
  return (
    <MuiStack sx={{ ...squircleClip(tokens.radius.lg), padding: 3, background: paint }}>
      {children}
    </MuiStack>
  );
}
