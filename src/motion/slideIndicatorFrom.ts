import { animate, type AnimationOptions } from "framer-motion";

export function slideIndicatorFrom(
  pill: HTMLElement,
  from: DOMRect,
  target: HTMLElement,
  transition: AnimationOptions,
): void {
  const to = target.getBoundingClientRect();
  if (to.width === 0 || to.height === 0) return;

  animate(
    pill,
    {
      x: [from.left - to.left, 0],
      y: [from.top - to.top, 0],
      scaleX: [from.width / to.width, 1],
      scaleY: [from.height / to.height, 1],
    },
    transition,
  );
}
