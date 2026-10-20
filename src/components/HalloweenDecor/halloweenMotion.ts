import type { CSSObject } from "@mui/material/styles";

const SINE = "cubic-bezier(0.37, 0, 0.63, 1)";

type LoopDirection = "normal" | "reverse" | "alternate";

export function loop(
  name: string,
  seconds: number,
  delay: number,
  direction: LoopDirection = "normal",
  easing: string = SINE,
): string {
  return `${name} ${seconds}s ${easing} ${delay}s infinite ${direction}`;
}

export function when(animated: boolean, styles: CSSObject): CSSObject {
  return animated ? styles : {};
}

export function keyframes(name: string, frames: CSSObject): CSSObject {
  return { [`@keyframes ${name}`]: frames };
}
