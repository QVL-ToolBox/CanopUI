import Box from "@mui/material/Box";
import type { CSSObject } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { Skeleton } from "../Skeleton";
import { skeletonRevealSx } from "../Skeleton/skeletonRevealSx";
import { visuallyHiddenStyle } from "../_shared/visuallyHiddenStyle";

interface DataTableSkeletonRowsProps {
  columnCount: number;
  knownRowCount: number;
  rowSurfaceSx: CSSObject;
  ariaLabel: string;
}

const DEFAULT_ROW_COUNT = 5;
const MAX_ROW_COUNT = 8;
const CELL_WIDTHS = ["72%", "48%", "60%", "36%", "54%"];

function rowCountFor(knownRowCount: number): number {
  return knownRowCount > 0 ? Math.min(knownRowCount, MAX_ROW_COUNT) : DEFAULT_ROW_COUNT;
}

function ghostRowA11y(announcesLoading: boolean) {
  return announcesLoading ? { role: "presentation" } : { "aria-hidden": true };
}

function cellWidth(rowIndex: number, columnIndex: number): string {
  return CELL_WIDTHS[(rowIndex + columnIndex * 2) % CELL_WIDTHS.length];
}

export function DataTableSkeletonRows({
  columnCount,
  knownRowCount,
  rowSurfaceSx,
  ariaLabel,
}: DataTableSkeletonRowsProps) {
  const [rowCount] = useState(() => rowCountFor(knownRowCount));
  const rowIndexes = Array.from({ length: rowCount }, (_, index) => index);
  const columnIndexes = Array.from({ length: Math.max(1, columnCount) }, (_, index) => index);

  return rowIndexes.map((rowIndex) => {
    const announcesLoading = rowIndex === 0;
    return (
      <TableRow
        key={rowIndex}
        {...ghostRowA11y(announcesLoading)}
        data-skeleton-row=""
        sx={{ ...rowSurfaceSx, ...skeletonRevealSx(rowIndex) }}
      >
        {columnIndexes.map((columnIndex) => (
          <TableCell key={columnIndex} role={announcesLoading ? "presentation" : undefined}>
            {announcesLoading && columnIndex === 0 ? (
              <Box
                component="span"
                role="progressbar"
                aria-label={ariaLabel}
                style={visuallyHiddenStyle}
              />
            ) : null}
            <Skeleton variant="lines" lines={1} width={cellWidth(rowIndex, columnIndex)} />
          </TableCell>
        ))}
      </TableRow>
    );
  });
}
