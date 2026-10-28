import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseStickyHeaderHeightResult {
  headerRef: RefObject<HTMLTableSectionElement | null>;
  headerHeight: number;
}

export function useStickyHeaderHeight(enabled: boolean): UseStickyHeaderHeightResult {
  const headerRef = useRef<HTMLTableSectionElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const header = headerRef.current;
    if (!header) return;
    const measure = (entries?: ResizeObserverEntry[]) => {
      const borderBox = entries?.[0]?.borderBoxSize?.[0];
      setHeaderHeight(borderBox ? borderBox.blockSize : header.offsetHeight);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [enabled]);

  return { headerRef, headerHeight };
}
