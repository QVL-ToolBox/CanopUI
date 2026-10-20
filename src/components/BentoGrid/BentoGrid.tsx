import Box from "@mui/material/Box";
import type { AriaRole, ReactNode } from "react";
import type { CanopCardGridGap } from "../CardGrid";
import { DEFAULT_BENTO_COLUMNS, type CanopBentoColumns } from "./bentoLayout";
import { BentoGridContext } from "./BentoGridContext";
import { useBentoGrid } from "./useBentoGrid";

export interface CanopBentoGridProps {
  columns?: CanopBentoColumns;
  gap?: CanopCardGridGap;
  rowHeight?: string;
  role?: AriaRole;
  ariaLabel?: string;
  children: ReactNode;
}

export function BentoGrid({
  columns = DEFAULT_BENTO_COLUMNS,
  gap = "md",
  rowHeight,
  role,
  ariaLabel,
  children,
}: CanopBentoGridProps) {
  const grid = useBentoGrid({ columns, gap, rowHeight });

  return (
    <BentoGridContext.Provider value={grid.columns}>
      <Box role={role} aria-label={ariaLabel} sx={grid.sx}>
        {children}
      </Box>
    </BentoGridContext.Provider>
  );
}
