import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { tokens, type CanopBreakpoint } from "../../tokens";

export type CanopCardGridGap = "xs" | "sm" | "md" | "lg" | "xl";

export type CanopCardGridColumns = number | Partial<Record<CanopBreakpoint, number>>;

export interface CanopCardGridProps {
  minItemWidth?: string;
  columns?: CanopCardGridColumns;
  gap?: CanopCardGridGap;
  children: ReactNode;
}

const ORDERED_BREAKPOINTS: readonly CanopBreakpoint[] = ["xs", "sm", "md", "lg"];

function autoTemplate(minItemWidth: string): string {
  return `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`;
}

function fixedTemplate(count: number): string {
  return `repeat(${count}, minmax(0, 1fr))`;
}

function resolveTemplate(
  columns: CanopCardGridColumns | undefined,
  minItemWidth: string,
): string | Partial<Record<CanopBreakpoint, string>> {
  if (columns === undefined) return autoTemplate(minItemWidth);
  if (typeof columns === "number") return fixedTemplate(columns);

  const template: Partial<Record<CanopBreakpoint, string>> = { xs: autoTemplate(minItemWidth) };
  for (const breakpoint of ORDERED_BREAKPOINTS) {
    const count = columns[breakpoint];
    if (count !== undefined) template[breakpoint] = fixedTemplate(count);
  }
  return template;
}

const SHRINKABLE_ITEMS = { "& > *": { minWidth: 0 } };

export function CardGrid({
  minItemWidth = "16rem",
  columns,
  gap = "md",
  children,
}: CanopCardGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: tokens.spacing[gap],
        gridTemplateColumns: resolveTemplate(columns, minItemWidth),
        ...SHRINKABLE_ITEMS,
      }}
    >
      {children}
    </Box>
  );
}
