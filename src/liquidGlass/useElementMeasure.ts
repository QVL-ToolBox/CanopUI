import { useEffect, useState } from "react";
import { frameBatch } from "./frameBatch";

export interface UseElementMeasureOptions<T extends HTMLElement, M> {
  enabled: boolean;
  measure: (element: T) => M;
  isSame: (previous: M, next: M) => boolean;
}

export interface UseElementMeasureResult<T extends HTMLElement, M> {
  ref: ((element: T | null) => void) | undefined;
  measurement: M | null;
}

export function useElementMeasure<T extends HTMLElement, M>({
  enabled,
  measure,
  isSame,
}: UseElementMeasureOptions<T, M>): UseElementMeasureResult<T, M> {
  const [element, setElement] = useState<T | null>(null);
  const [measurement, setMeasurement] = useState<M | null>(null);

  useEffect(() => {
    if (!enabled || !element) return;
    const commit = () => {
      const next = measure(element);
      setMeasurement((previous) => (previous !== null && isSame(previous, next) ? previous : next));
    };
    if (typeof ResizeObserver === "undefined") {
      commit();
      return;
    }
    const batch = frameBatch(commit);
    const observer = new ResizeObserver(batch.schedule);
    observer.observe(element);
    return () => {
      observer.disconnect();
      batch.cancel();
    };
  }, [enabled, element, measure, isSame]);

  return { ref: enabled ? setElement : undefined, measurement };
}
