import MuiStack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { CanopyBackground, squircleClip, tokens } from "@canop/ui";

export interface CanopyBackdropProps {
  animated: boolean;
  children: ReactNode;
}

export function CanopyBackdrop({ animated, children }: CanopyBackdropProps) {
  return (
    <MuiStack sx={{ ...squircleClip(tokens.radius.lg), overflow: "hidden" }}>
      <CanopyBackground animated={animated} contentSx={{ padding: tokens.spacing.lg }}>
        {children}
      </CanopyBackground>
    </MuiStack>
  );
}
