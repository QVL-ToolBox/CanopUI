import { useCallback, useRef, type RefObject } from "react";
import type { CarouselArrowDirection } from "./CarouselArrow";

export interface UseCarouselArrowFocusResult {
  previousArrowRef: RefObject<HTMLButtonElement | null>;
  nextArrowRef: RefObject<HTMLButtonElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  focusFallback: (from: CarouselArrowDirection) => void;
}

export function useCarouselArrowFocus(): UseCarouselArrowFocusResult {
  const previousArrowRef = useRef<HTMLButtonElement | null>(null);
  const nextArrowRef = useRef<HTMLButtonElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const focusFallback = useCallback((from: CarouselArrowDirection) => {
    const sibling = from === "previous" ? nextArrowRef.current : previousArrowRef.current;
    if (sibling && !sibling.disabled) {
      sibling.focus();
      return;
    }
    viewportRef.current?.focus();
  }, []);

  return { previousArrowRef, nextArrowRef, viewportRef, focusFallback };
}
