export type CanopCarouselNavigation = "arrows" | "bars";
export type CanopCarouselOrientation = "horizontal" | "vertical";
export type CanopCarouselTransition = "slide" | "fade";

export const CAROUSEL_DEFAULT_INTERVAL = 5000;

export const CAROUSEL_DEFAULT_VISIBLE_COUNT = 1;

export const CAROUSEL_SWIPE_DISTANCE = 48;

export const CAROUSEL_SWIPE_RATIO = 1.4;

export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), count - 1);
}

export function stepIndex(index: number, count: number, delta: number, loop: boolean): number {
  if (count <= 0) return 0;
  const next = index + delta;
  if (!loop) return clampIndex(next, count);
  return ((next % count) + count) % count;
}

export function clampVisibleCount(visibleCount: number, count: number): number {
  const whole = Number.isFinite(visibleCount) ? Math.floor(visibleCount) : 1;
  return Math.max(1, Math.min(whole, Math.max(count, 1)));
}

export function positionCountOf(count: number, visibleCount: number): number {
  return Math.max(1, count - visibleCount + 1);
}

export function isInWindow(index: number, start: number, visibleCount: number): boolean {
  return index >= start && index < start + visibleCount;
}

export function slideTransform(offset: number, orientation: CanopCarouselOrientation): string {
  const axe = orientation === "vertical" ? "Y" : "X";
  return `translate${axe}(${offset * 100}%)`;
}

export function swipeDirection(
  dx: number,
  dy: number,
  orientation: CanopCarouselOrientation,
): -1 | 0 | 1 {
  const [axe, perpendiculaire] =
    orientation === "vertical" ? [dy, Math.abs(dx)] : [dx, Math.abs(dy)];
  if (Math.abs(axe) < CAROUSEL_SWIPE_DISTANCE) return 0;
  if (perpendiculaire > Math.abs(axe) / CAROUSEL_SWIPE_RATIO) return 0;
  return axe < 0 ? 1 : -1;
}

export function keyboardStep(key: string, orientation: CanopCarouselOrientation): -1 | 0 | 1 {
  const [previous, next] =
    orientation === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
  if (key === previous) return -1;
  return key === next ? 1 : 0;
}
