import { useEffect, useRef, type RefObject } from "react";

export function useScrollIntoViewWhenActive<T extends HTMLElement>(
  active: boolean,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return ref;
}
