import { useEffect, useState } from "react";

export interface UseScrollOverflowParams {
  element: HTMLElement | null;
  enabled: boolean;
  includesVertical: boolean;
}

const SUBPIXEL_ROUNDING = 1;

function exceeds(content: number, viewport: number): boolean {
  return content - viewport > SUBPIXEL_ROUNDING;
}

function overflows(element: HTMLElement, includesVertical: boolean): boolean {
  const horizontal = exceeds(element.scrollWidth, element.clientWidth);
  const vertical = includesVertical && exceeds(element.scrollHeight, element.clientHeight);
  return horizontal || vertical;
}

export function useScrollOverflow({
  element,
  enabled,
  includesVertical,
}: UseScrollOverflowParams): boolean {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!enabled || !element) return;
    const measure = () => setIsOverflowing(overflows(element, includesVertical));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const content = element.querySelector("table");
    if (content) observer.observe(content);
    return () => observer.disconnect();
  }, [element, enabled, includesVertical]);

  return enabled && isOverflowing;
}
