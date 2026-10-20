import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSquircleRadiusResult<TElement extends HTMLElement> {
  ref: (node: TElement | null) => void;
  radius: string | null;
}

export function useSquircleRadius<
  TElement extends HTMLElement = HTMLElement,
>(): UseSquircleRadiusResult<TElement> {
  const [radius, setRadius] = useState<string | null>(null);
  const observed = useRef<TElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const measure = useCallback((node: TElement) => {
    const { width, height } = node.getBoundingClientRect();
    const shortest = Math.min(width, height);
    setRadius(shortest > 0 ? `${shortest / 2}px` : null);
  }, []);

  const ref = useCallback(
    (node: TElement | null) => {
      observer.current?.disconnect();
      observed.current = node;

      if (!node) {
        setRadius(null);
        return;
      }

      measure(node);

      if (typeof ResizeObserver === "undefined") return;
      observer.current = new ResizeObserver(() => measure(node));
      observer.current.observe(node);
    },
    [measure],
  );

  useEffect(() => () => observer.current?.disconnect(), []);

  return { ref, radius };
}
