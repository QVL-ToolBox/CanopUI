import { useBreakpoint } from "../../breakpoints";
import { BREAKPOINTS, type CanopResponsiveValue } from "../_shared/responsiveValue";
import { CAROUSEL_DEFAULT_VISIBLE_COUNT } from "./carouselHelpers";

export function useCarouselVisibleCount(visibleCount: CanopResponsiveValue<number>): number {
  const current = useBreakpoint();
  if (typeof visibleCount === "number") return visibleCount;
  const reached = BREAKPOINTS.slice(0, BREAKPOINTS.indexOf(current) + 1).reverse();
  for (const step of reached) {
    const value = visibleCount[step];
    if (value !== undefined) return value;
  }
  return CAROUSEL_DEFAULT_VISIBLE_COUNT;
}
