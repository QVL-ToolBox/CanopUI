import type { CanvasSurface } from "./canvasSurface";

export const LAVA_LEVELS = 8;
export const FIELD_BLOB_STRIDE = 3;

export interface LavaDotGrid {
  xs: Float32Array;
  ys: Float32Array;
  pitch: number;
  field: Float64Array;
  levels: Uint8Array;
  changed: Int32Array;
  changedCount: number;
  painted: boolean;
}

export interface LavaThreshold {
  spread: number;
  low: number;
  high: number;
}

export interface LavaPaint {
  ink: string;
  lit: string;
  inkOpacity: number;
  litOpacity: number;
}

const TAU = Math.PI * 2;
const MIN_SPREAD = 1.3;
const SPREAD_RANGE = 1.1;
const MIN_SOFTNESS = 0.3;
const SOFTNESS_RANGE = 0.55;
const LIT_GROWTH = 0.6;
const ERASE_MARGIN = 1;

function axis(length: number, pitch: number): Float32Array {
  const first = length / 2 - Math.floor(length / 2 / pitch) * pitch;
  const count = Math.max(1, Math.floor((length - first) / pitch) + 1);
  return Float32Array.from({ length: count }, (_, index) => first + index * pitch);
}

export function createLavaDotGrid(width: number, height: number, pitch: number): LavaDotGrid {
  const xs = axis(width, pitch);
  const ys = axis(height, pitch);
  const count = xs.length * ys.length;
  return {
    xs,
    ys,
    pitch,
    field: new Float64Array(count),
    levels: new Uint8Array(count),
    changed: new Int32Array(count),
    changedCount: 0,
    painted: false,
  };
}

export function lavaThreshold(fusion: number): LavaThreshold {
  const spread = MIN_SPREAD + fusion * SPREAD_RANGE;
  const threshold = (1 - 1 / spread ** 2) ** 3;
  const softness = MIN_SOFTNESS + fusion * SOFTNESS_RANGE;
  return { spread, low: threshold * (1 - softness), high: threshold * (1 + softness) };
}

function smoothstep(low: number, high: number, value: number): number {
  const progress = Math.min(1, Math.max(0, (value - low) / (high - low)));
  return progress * progress * (3 - 2 * progress);
}

function levelOf(value: number, { low, high }: LavaThreshold): number {
  if (value <= low) return 0;
  return Math.round(smoothstep(low, high, value) * LAVA_LEVELS);
}

function firstCell(position: number, origin: number, pitch: number): number {
  return Math.max(0, Math.floor((position - origin) / pitch));
}

function lastCell(position: number, origin: number, pitch: number, count: number): number {
  return Math.min(count - 1, Math.ceil((position - origin) / pitch));
}

function accumulateBlob(grid: LavaDotGrid, x: number, y: number, reach: number): void {
  if (!(reach > 0)) return;
  const { xs, ys, pitch, field } = grid;
  const columns = xs.length;
  const reachSquared = reach * reach;
  const columnStart = firstCell(x - reach, xs[0], pitch);
  const columnEnd = lastCell(x + reach, xs[0], pitch, columns);
  const rowEnd = lastCell(y + reach, ys[0], pitch, ys.length);
  for (let row = firstCell(y - reach, ys[0], pitch); row <= rowEnd; row += 1) {
    const dy = ys[row] - y;
    const rowStart = row * columns;
    for (let column = columnStart; column <= columnEnd; column += 1) {
      const dx = xs[column] - x;
      const falloff = 1 - (dx * dx + dy * dy) / reachSquared;
      if (falloff > 0) field[rowStart + column] += falloff * falloff * falloff;
    }
  }
}

export function revealLavaDots(
  grid: LavaDotGrid,
  blobs: Float64Array,
  threshold: LavaThreshold,
): void {
  const { field, levels, changed } = grid;
  field.fill(0);
  for (let offset = 0; offset < blobs.length; offset += FIELD_BLOB_STRIDE) {
    accumulateBlob(grid, blobs[offset], blobs[offset + 1], blobs[offset + 2]);
  }
  let count = 0;
  for (let index = 0; index < levels.length; index += 1) {
    const level = levelOf(field[index], threshold);
    if (grid.painted && level === levels[index]) continue;
    levels[index] = level;
    changed[count] = index;
    count += 1;
  }
  grid.changedCount = count;
}

function eraseChangedDots(
  context: CanvasRenderingContext2D,
  grid: LavaDotGrid,
  half: number,
): void {
  const { xs, ys, changed } = grid;
  const columns = xs.length;
  const side = half * 2;
  for (let entry = 0; entry < grid.changedCount; entry += 1) {
    const index = changed[entry];
    const column = index % columns;
    context.clearRect(xs[column] - half, ys[(index - column) / columns] - half, side, side);
  }
}

function traceLevel(
  context: CanvasRenderingContext2D,
  grid: LavaDotGrid,
  level: number,
  radius: number,
): void {
  const { xs, ys, levels, changed } = grid;
  const columns = xs.length;
  context.beginPath();
  for (let entry = 0; entry < grid.changedCount; entry += 1) {
    const index = changed[entry];
    if (levels[index] !== level) continue;
    const column = index % columns;
    const x = xs[column];
    const y = ys[(index - column) / columns];
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, TAU);
  }
}

function fillLevel(
  context: CanvasRenderingContext2D,
  grid: LavaDotGrid,
  level: number,
  radius: number,
  opacity: number,
): void {
  if (opacity <= 0) return;
  context.globalAlpha = opacity;
  traceLevel(context, grid, level, radius);
  context.fill();
}

function clearChangedDots(
  { context, width, height }: CanvasSurface,
  grid: LavaDotGrid,
  dotRadius: number,
): void {
  if (grid.painted) {
    eraseChangedDots(context, grid, dotRadius * (1 + LIT_GROWTH) + ERASE_MARGIN);
    return;
  }
  context.clearRect(0, 0, width, height);
}

export function drawLavaDots(
  surface: CanvasSurface,
  grid: LavaDotGrid,
  { ink, lit, inkOpacity, litOpacity }: LavaPaint,
  dotRadius: number,
): void {
  if (grid.painted && grid.changedCount === 0) return;
  const { context, pixelRatio } = surface;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  clearChangedDots(surface, grid, dotRadius);
  for (let level = 0; level <= LAVA_LEVELS; level += 1) {
    const share = level / LAVA_LEVELS;
    context.fillStyle = ink;
    fillLevel(context, grid, level, dotRadius, inkOpacity * (1 - share));
    context.fillStyle = lit;
    fillLevel(context, grid, level, dotRadius * (1 + LIT_GROWTH * share), litOpacity * share);
  }
  context.globalAlpha = 1;
  grid.painted = true;
  grid.changedCount = 0;
}
