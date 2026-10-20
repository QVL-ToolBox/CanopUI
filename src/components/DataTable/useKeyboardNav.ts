import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "../../motion";

export interface UseKeyboardNavParams<T> {
  enabled: boolean;
  rows: T[];
  getRowKey: (row: T) => string;
  scrollEl: HTMLElement | null;
  onActivate?: (row: T) => void;
}

export interface UseKeyboardNavResult {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  tabIndex: number | undefined;
}

export function useKeyboardNav<T>({
  enabled,
  rows,
  getRowKey,
  scrollEl,
  onActivate,
}: UseKeyboardNavParams<T>): UseKeyboardNavResult {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (selectedIndex >= rows.length) setSelectedIndex(rows.length - 1);
  }, [rows.length, selectedIndex]);

  useEffect(() => {
    if (!enabled || selectedIndex < 0 || !scrollEl) return;
    const row = rows[selectedIndex];
    if (!row) return;
    const target = scrollEl.querySelector<HTMLElement>(
      `tr[data-rowkey="${CSS.escape(getRowKey(row))}"]`,
    );
    target?.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
  }, [enabled, selectedIndex, rows, getRowKey, scrollEl, reducedMotion]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!enabled) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, rows.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        const row = rows[selectedIndex];
        if (row) onActivate?.(row);
      }
    },
    [enabled, rows, selectedIndex, onActivate],
  );

  return {
    selectedIndex,
    setSelectedIndex,
    onKeyDown,
    tabIndex: enabled ? 0 : undefined,
  };
}
