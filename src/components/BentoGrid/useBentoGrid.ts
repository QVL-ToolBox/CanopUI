import type { SxProps, Theme } from "@mui/material/styles";
import { useMemo } from "react";
import { tokens } from "../../tokens";
import type { CanopCardGridGap } from "../CardGrid";
import {
  bentoTemplate,
  resolveBentoColumns,
  type BentoCounts,
  type CanopBentoColumns,
} from "./bentoLayout";

interface UseBentoGridParams {
  columns: CanopBentoColumns;
  gap: CanopCardGridGap;
  rowHeight?: string;
}

interface UseBentoGridResult {
  columns: BentoCounts;
  sx: SxProps<Theme>;
}

export function useBentoGrid({ columns, gap, rowHeight }: UseBentoGridParams): UseBentoGridResult {
  const { xs, sm, md, lg } = resolveBentoColumns(columns);
  const resolved = useMemo<BentoCounts>(() => ({ xs, sm, md, lg }), [xs, sm, md, lg]);

  const sx: SxProps<Theme> = {
    display: "grid",
    gap: tokens.spacing[gap],
    gridTemplateColumns: bentoTemplate(resolved),
    ...(rowHeight ? { gridAutoRows: `minmax(${rowHeight}, auto)` } : {}),
    "& > *": { minWidth: 0 },
  };

  return { columns: resolved, sx };
}
