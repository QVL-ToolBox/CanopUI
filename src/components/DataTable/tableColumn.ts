import type { ReactNode } from "react";

export type CanopSortDirection = "asc" | "desc";

export interface CanopColumn<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  width?: string | number;
  sortable?: boolean;
  hideOnMobile?: boolean;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

export function columnValue<T>(row: T, column: CanopColumn<T>): unknown {
  return (row as Record<string, unknown>)[column.key];
}
