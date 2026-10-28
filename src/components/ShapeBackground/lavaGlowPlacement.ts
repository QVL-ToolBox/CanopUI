import type { LavaLayout, LavaScene } from "./lavaScene";

export const GLOW_PLACEMENT_STRIDE = 3;

const PRECISION = 100;
const VISIBLE = "1";

function rounded(value: number): number {
  return Math.round(value * PRECISION) / PRECISION;
}

function storePlacement(
  placements: Float64Array,
  offset: number,
  x: number,
  y: number,
  scale: number,
): boolean {
  const unchanged =
    placements[offset] === x && placements[offset + 1] === y && placements[offset + 2] === scale;
  if (unchanged) return false;
  placements[offset] = x;
  placements[offset + 1] = y;
  placements[offset + 2] = scale;
  return true;
}

export function placeLavaGlows(
  node: HTMLDivElement | null,
  scene: LavaScene,
  { surface, unit, fit }: LavaLayout,
): void {
  if (!node) return;
  for (let index = 0; index < scene.blobs.length; index += 1) {
    const glow = node.children[index];
    if (!(glow instanceof HTMLElement)) continue;
    const blob = scene.blobs[index];
    const x = rounded((blob.x * surface.width) / unit);
    const y = rounded((blob.y * surface.height) / unit);
    const scale = rounded(blob.breath * fit);
    const offset = index * GLOW_PLACEMENT_STRIDE;
    if (!storePlacement(scene.glowPlacements, offset, x, y, scale)) continue;
    glow.style.transform = `translate3d(${x}rem, ${y}rem, 0) scale(${scale})`;
    glow.style.opacity = VISIBLE;
  }
}
