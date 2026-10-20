import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import type { CanopBreadcrumbItem, CanopBreadcrumbSegment } from "./breadcrumbTypes";

export interface UseBreadcrumbParams {
  items: CanopBreadcrumbItem[];
  maxItems?: number;
}

export interface UseBreadcrumbResult {
  segments: CanopBreadcrumbSegment[];
  collapseOpen: boolean;
  collapseAnchor: HTMLElement | null;
  openCollapse: (event: MouseEvent<HTMLElement>) => void;
  closeCollapse: () => void;
}

const DEFAULT_MAX_ITEMS = 4;
const COMPACT_MAX_ITEMS = 3;

function buildSegments(items: CanopBreadcrumbItem[], maxItems: number): CanopBreadcrumbSegment[] {
  const lastIndex = items.length - 1;
  const toItemSegment = (item: CanopBreadcrumbItem, index: number): CanopBreadcrumbSegment => ({
    kind: "item",
    item,
    isCurrent: index === lastIndex,
  });

  if (items.length <= maxItems) {
    return items.map(toItemSegment);
  }

  const tailCount = Math.max(1, maxItems - 1);
  const tailStart = items.length - tailCount;
  const head = items[0];
  const collapsed = items.slice(1, tailStart);
  const tail = items.slice(tailStart);

  return [
    toItemSegment(head, 0),
    { kind: "collapse", items: collapsed },
    ...tail.map((item, offset) => toItemSegment(item, tailStart + offset)),
  ];
}

export function useBreadcrumb({ items, maxItems }: UseBreadcrumbParams): UseBreadcrumbResult {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("sm"));
  const [collapseAnchor, setCollapseAnchor] = useState<HTMLElement | null>(null);

  const effectiveMax = isCompact
    ? Math.min(maxItems ?? DEFAULT_MAX_ITEMS, COMPACT_MAX_ITEMS)
    : (maxItems ?? DEFAULT_MAX_ITEMS);

  const segments = useMemo(() => buildSegments(items, effectiveMax), [items, effectiveMax]);

  const openCollapse = useCallback((event: MouseEvent<HTMLElement>) => {
    setCollapseAnchor(event.currentTarget);
  }, []);

  const closeCollapse = useCallback(() => setCollapseAnchor(null), []);

  return {
    segments,
    collapseOpen: Boolean(collapseAnchor),
    collapseAnchor,
    openCollapse,
    closeCollapse,
  };
}
