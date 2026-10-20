import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";

const doubleClickGraceMs = 220;

const interactiveChildSelector =
  'button, a, input, label, [contenteditable="true"], [data-no-select="true"]';

const marqueeExcludedSelector =
  'button, a, input, label, [contenteditable="true"], tr[draggable="true"]';

const rowSelector = "tr[data-rowkey]";

export interface CanopMarqueeRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface UseRowSelectionParams<T> {
  selectable: boolean;
  rows: T[];
  getRowKey: (row: T) => string;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  onRowDoubleClick?: (row: T) => void;
  onRowActivate?: (row: T) => void;
  onRowFocus?: (index: number) => void;
}

export interface UseRowSelectionResult<T> {
  bodyRef: RefObject<HTMLTableSectionElement | null>;
  selectedRowKeys: Set<string>;
  isSelectionColumnVisible: boolean;
  areAllRowsSelected: boolean;
  areSomeRowsSelected: boolean;
  marqueeRect: CanopMarqueeRect | null;
  toggleAllRows: () => void;
  toggleRowSelection: (key: string) => void;
  handleMarqueeMouseDown: (event: MouseEvent) => void;
  handleRowClick: (event: MouseEvent, index: number) => void;
  handleRowDoubleClick: ((row: T) => void) | undefined;
  handleRowKeyDown: (event: KeyboardEvent<HTMLTableRowElement>, index: number) => void;
  handleRowFocus: (index: number) => void;
  rowTabIndex: (index: number) => number | undefined;
}

function clampIndex(index: number, length: number): number {
  return Math.max(0, Math.min(index, length - 1));
}

export function useRowSelection<T>({
  selectable,
  rows,
  getRowKey,
  selectedKeys,
  onSelectionChange,
  onRowDoubleClick,
  onRowActivate,
  onRowFocus,
}: UseRowSelectionParams<T>): UseRowSelectionResult<T> {
  const isSelectionControlled = selectedKeys != null;
  const [uncontrolledSelection, setUncontrolledSelection] = useState<string[]>([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const [marqueeRect, setMarqueeRect] = useState<CanopMarqueeRect | null>(null);
  const bodyRef = useRef<HTMLTableSectionElement | null>(null);
  const anchorKey = useRef<string | null>(null);
  const marqueeOrigin = useRef<{ x: number; y: number } | null>(null);
  const marqueeBaseKeys = useRef<Set<string>>(new Set());
  const deferredSelectionTimer = useRef<number | null>(null);

  const selection = isSelectionControlled ? selectedKeys : uncontrolledSelection;
  const selectedRowKeys = new Set(selection);
  const rowKeys = rows.map(getRowKey);
  const isRowSelected = (key: string) => selectedRowKeys.has(key);
  const areAllRowsSelected = rowKeys.length > 0 && rowKeys.every(isRowSelected);
  const areSomeRowsSelected = !areAllRowsSelected && rowKeys.some(isRowSelected);
  const activateRow = onRowActivate ?? onRowDoubleClick;

  const commitSelection = useCallback(
    (keys: string[]) => {
      if (!isSelectionControlled) setUncontrolledSelection(keys);
      onSelectionChange?.(keys);
    },
    [isSelectionControlled, onSelectionChange],
  );

  const trackMarquee = useCallback(
    (event: globalThis.MouseEvent) => {
      const origin = marqueeOrigin.current;
      if (!origin) return;
      const left = Math.min(origin.x, event.clientX);
      const top = Math.min(origin.y, event.clientY);
      const width = Math.abs(event.clientX - origin.x);
      const height = Math.abs(event.clientY - origin.y);
      setMarqueeRect({ left, top, width, height });
      const hitKeys = new Set(marqueeBaseKeys.current);
      const rowElements = bodyRef.current?.querySelectorAll<HTMLTableRowElement>(rowSelector);
      rowElements?.forEach((rowElement) => {
        const bounds = rowElement.getBoundingClientRect();
        const intersects = !(
          bounds.right < left ||
          bounds.left > left + width ||
          bounds.bottom < top ||
          bounds.top > top + height
        );
        if (intersects) hitKeys.add(rowElement.getAttribute("data-rowkey") as string);
      });
      commitSelection([...hitKeys]);
    },
    [commitSelection],
  );

  const endMarquee = useCallback(() => {
    marqueeOrigin.current = null;
    setMarqueeRect(null);
    window.removeEventListener("mousemove", trackMarquee);
    window.removeEventListener("mouseup", endMarquee);
  }, [trackMarquee]);

  useEffect(
    () => () => {
      window.removeEventListener("mousemove", trackMarquee);
      window.removeEventListener("mouseup", endMarquee);
      if (deferredSelectionTimer.current) window.clearTimeout(deferredSelectionTimer.current);
    },
    [trackMarquee, endMarquee],
  );

  const cancelDeferredSelection = () => {
    if (deferredSelectionTimer.current === null) return;
    window.clearTimeout(deferredSelectionTimer.current);
    deferredSelectionTimer.current = null;
  };

  const selectOnly = (key: string) => {
    commitSelection([key]);
    anchorKey.current = key;
  };

  const deferSelectionAfterDoubleClickWindow = (key: string) => {
    cancelDeferredSelection();
    deferredSelectionTimer.current = window.setTimeout(() => {
      selectOnly(key);
      deferredSelectionTimer.current = null;
    }, doubleClickGraceMs);
  };

  const toggleRowSelection = (key: string) => {
    const next = new Set(selection);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    commitSelection([...next]);
    anchorKey.current = key;
  };

  const selectRange = (fromIndex: number, toIndex: number, additive: boolean) => {
    const firstIndex = Math.min(fromIndex, toIndex);
    const lastIndex = Math.max(fromIndex, toIndex);
    const next = additive ? new Set(selection) : new Set<string>();
    rowKeys.slice(firstIndex, lastIndex + 1).forEach((key) => next.add(key));
    commitSelection([...next]);
  };

  const toggleAllRows = () => {
    commitSelection(areAllRowsSelected ? [] : rowKeys);
    anchorKey.current = null;
  };

  const focusRowAt = (index: number) => {
    bodyRef.current?.querySelectorAll<HTMLTableRowElement>(rowSelector).item(index)?.focus();
  };

  const handleMarqueeMouseDown = (event: MouseEvent) => {
    if (!selectable || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest(marqueeExcludedSelector)) return;
    event.preventDefault();
    const additive = event.ctrlKey || event.metaKey;
    const extendsFromAnchor = event.shiftKey;
    marqueeOrigin.current = { x: event.clientX, y: event.clientY };
    marqueeBaseKeys.current = additive ? new Set(selection) : new Set();
    if (!additive && !extendsFromAnchor) {
      commitSelection([]);
      anchorKey.current = null;
    }
    window.addEventListener("mousemove", trackMarquee);
    window.addEventListener("mouseup", endMarquee);
  };

  const handleRowClick = (event: MouseEvent, index: number) => {
    const target = event.target as HTMLElement;
    if (target.closest(interactiveChildSelector)) return;
    const key = rowKeys[index];
    setFocusedRowIndex(index);
    focusRowAt(index);
    if (event.shiftKey && anchorKey.current) {
      const anchorIndex = rowKeys.indexOf(anchorKey.current);
      if (anchorIndex >= 0) selectRange(anchorIndex, index, event.ctrlKey || event.metaKey);
    } else if (event.ctrlKey || event.metaKey) {
      toggleRowSelection(key);
    } else if (onRowDoubleClick) {
      deferSelectionAfterDoubleClickWindow(key);
    } else {
      selectOnly(key);
    }
  };

  const handleRowDoubleClick = onRowDoubleClick
    ? (row: T) => {
        cancelDeferredSelection();
        onRowDoubleClick(row);
      }
    : undefined;

  const handleRowFocus = (index: number) => {
    setFocusedRowIndex(index);
    onRowFocus?.(index);
  };

  const moveFocus = (fromIndex: number, offset: number, extendSelection: boolean) => {
    const nextIndex = clampIndex(fromIndex + offset, rowKeys.length);
    if (extendSelection) {
      const anchorIndex = anchorKey.current ? rowKeys.indexOf(anchorKey.current) : -1;
      selectRange(anchorIndex < 0 ? fromIndex : anchorIndex, nextIndex, false);
    }
    focusRowAt(nextIndex);
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, index: number) => {
    if (!selectable || event.target !== event.currentTarget) return;
    const key = rowKeys[index];
    const row = rows[index];
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      moveFocus(index, event.key === "ArrowDown" ? 1 : -1, event.shiftKey);
      return;
    }
    if (event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      toggleRowSelection(key);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (activateRow) activateRow(row);
      else selectOnly(key);
    }
  };

  const firstSelectedIndex = rowKeys.findIndex(isRowSelected);
  const tabbableRowIndex =
    focusedRowIndex >= 0 && focusedRowIndex < rowKeys.length
      ? focusedRowIndex
      : Math.max(firstSelectedIndex, 0);

  const rowTabIndex = (index: number) => {
    if (!selectable) return undefined;
    return index === tabbableRowIndex ? 0 : -1;
  };

  return {
    bodyRef,
    selectedRowKeys,
    isSelectionColumnVisible: selectable && selection.length > 0,
    areAllRowsSelected,
    areSomeRowsSelected,
    marqueeRect,
    toggleAllRows,
    toggleRowSelection,
    handleMarqueeMouseDown,
    handleRowClick,
    handleRowDoubleClick,
    handleRowKeyDown,
    handleRowFocus,
    rowTabIndex,
  };
}
