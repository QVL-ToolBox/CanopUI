import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { squircleSurface, tokens } from "@canop/ui";
import { ThemeScope } from "./themeScope/ThemeScope";

export type DarkStageSize = "compact" | "roomy";

export interface DarkStageProps {
  size: DarkStageSize;
  decorative?: boolean;
  children: ReactNode;
}

const STAGE_BACKGROUND = "var(--canop-palette-background-default)";

const stageSxBySize: Record<DarkStageSize, SxProps<Theme>> = {
  compact: {
    ...squircleSurface({ radius: tokens.radius.md, background: STAGE_BACKGROUND }),
    padding: tokens.spacing.md,
  },
  roomy: {
    ...squircleSurface({ radius: "var(--canop-radius-xl)", background: STAGE_BACKGROUND }),
    padding: { xs: "1.5rem 1rem", md: "2.5rem 2rem" },
  },
};

export function DarkStage({ size, decorative = false, children }: DarkStageProps) {
  return (
    <ThemeScope mode="dark">
      <Box aria-hidden={decorative || undefined} sx={stageSxBySize[size]}>
        {children}
      </Box>
    </ThemeScope>
  );
}
