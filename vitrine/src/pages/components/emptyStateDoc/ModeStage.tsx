import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import type { CanopThemeMode } from "@canop/ui";
import { ThemeScope } from "../../../kit/themeScope/ThemeScope";
import { GlassBackdrop } from "./GlassBackdrop";

export interface ModeStageProps {
  mode: CanopThemeMode;
  children: ReactNode;
}

export function ModeStage({ mode, children }: ModeStageProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <ThemeScope mode={mode}>
        <GlassBackdrop height="28rem">{children}</GlassBackdrop>
      </ThemeScope>
    </Box>
  );
}
