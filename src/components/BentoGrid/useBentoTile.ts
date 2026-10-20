import type { SxProps, Theme } from "@mui/material/styles";
import {
  bentoColumnPlacement,
  bentoRowPlacement,
  resolveBentoSpan,
  type CanopBentoSpan,
} from "./bentoLayout";
import { useBentoGridColumns } from "./BentoGridContext";

interface UseBentoTileParams {
  span: CanopBentoSpan;
  rowSpan: CanopBentoSpan;
}

export function useBentoTile({ span, rowSpan }: UseBentoTileParams): SxProps<Theme> {
  const columns = useBentoGridColumns();

  return {
    gridColumn: bentoColumnPlacement(columns, resolveBentoSpan(span)),
    gridRow: bentoRowPlacement(columns, resolveBentoSpan(rowSpan)),
    minWidth: 0,
  };
}
