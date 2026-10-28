import { LAVA_RECIPE } from "./lavaRecipe";

export interface LavaClock {
  seconds: number;
}

export interface LavaLoopOptions {
  clock: LavaClock;
  draw: () => void;
}

const FRAMES_PER_SECOND = 30;
const TICK_MS = 1000 / FRAMES_PER_SECOND;
const FRAME_TOLERANCE_MS = 4;
const MS_PER_SECOND = 1000;

function lavaMilliseconds(seconds: number): number {
  return (seconds / LAVA_RECIPE.speed) * MS_PER_SECOND;
}

export function runLavaLoop({ clock, draw }: LavaLoopOptions): () => void {
  let frame = 0;
  let origin: number | null = null;
  let lastTick = 0;
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (origin === null) origin = now - lavaMilliseconds(clock.seconds);
    else if (now - lastTick < TICK_MS - FRAME_TOLERANCE_MS) return;
    lastTick = now;
    clock.seconds = ((now - origin) / MS_PER_SECOND) * LAVA_RECIPE.speed;
    draw();
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
