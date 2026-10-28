import { useEffect, useState } from "react";

export function useScrollbarWidth(scrollEl: HTMLElement | null, enabled: boolean): number {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    if (!enabled || !scrollEl) return;
    const measure = () => setScrollbarWidth(scrollEl.offsetWidth - scrollEl.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(scrollEl);
    return () => observer.disconnect();
  }, [enabled, scrollEl]);

  return scrollbarWidth;
}
