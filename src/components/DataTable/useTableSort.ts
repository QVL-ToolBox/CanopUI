import { useState } from "react";
import { columnValue, type CanopColumn, type CanopSortDirection } from "./tableColumn";

export type CanopAriaSort = "ascending" | "descending" | "none";

export interface UseTableSortParams<T> {
  columns: CanopColumn<T>[];
  rows: T[];
}

export interface UseTableSortResult<T> {
  sortedRows: T[];
  toggleSort: (key: string) => void;
  sortDirectionOf: (key: string) => CanopSortDirection | false;
  ariaSortOf: (column: CanopColumn<T>) => CanopAriaSort | undefined;
}

interface SortState {
  key: string;
  direction: CanopSortDirection;
}

const ariaSortByDirection: Record<CanopSortDirection, CanopAriaSort> = {
  asc: "ascending",
  desc: "descending",
};

function displayedSortValue<T>(column: CanopColumn<T>) {
  return (row: T): string | number => {
    const value = columnValue(row, column);
    return typeof value === "number" ? value : String(value ?? "");
  };
}

function compareSortValues(left: string | number, right: string | number): number {
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right));
}

function sortRows<T>(rows: T[], column: CanopColumn<T>, direction: CanopSortDirection): T[] {
  const sortValue = column.sortValue ?? displayedSortValue(column);
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort(
    (left, right) => compareSortValues(sortValue(left), sortValue(right)) * factor,
  );
}

export function useTableSort<T>({ columns, rows }: UseTableSortParams<T>): UseTableSortResult<T> {
  const [sort, setSort] = useState<SortState | null>(null);

  const toggleSort = (key: string) => {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      return current.direction === "asc" ? { key, direction: "desc" } : null;
    });
  };

  const sortDirectionOf = (key: string): CanopSortDirection | false =>
    sort?.key === key ? sort.direction : false;

  const ariaSortOf = (column: CanopColumn<T>): CanopAriaSort | undefined => {
    if (!column.sortable) return undefined;
    const direction = sortDirectionOf(column.key);
    return direction ? ariaSortByDirection[direction] : "none";
  };

  const sortedColumn = sort ? columns.find((column) => column.key === sort.key) : undefined;
  const sortedRows = sort && sortedColumn ? sortRows(rows, sortedColumn, sort.direction) : rows;

  return { sortedRows, toggleSort, sortDirectionOf, ariaSortOf };
}
