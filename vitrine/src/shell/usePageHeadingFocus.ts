import { useEffect, useRef, type RefObject } from "react";

export function usePageHeadingFocus(activePath: string): RefObject<HTMLDivElement | null> {
  const contentRef = useRef<HTMLDivElement>(null);
  const focusedPath = useRef(activePath);

  useEffect(() => {
    if (focusedPath.current === activePath) return;
    focusedPath.current = activePath;
    const heading = contentRef.current?.querySelector<HTMLHeadingElement>("h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus();
  }, [activePath]);

  return contentRef;
}
