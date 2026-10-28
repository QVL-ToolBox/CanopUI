import { clamp } from "../_shared/clamp";
import { fitCanvas, rootFontSize, type CanvasSurface } from "./canvasSurface";
import {
  FIELD_BLOB_STRIDE,
  createLavaDotGrid,
  drawLavaDots,
  lavaThreshold,
  revealLavaDots,
  type LavaDotGrid,
  type LavaPaint,
} from "./lavaDots";
import { GLOW_PLACEMENT_STRIDE } from "./lavaGlowPlacement";
import { blobAt, emptyBlob, type LavaBlob, type LavaMass } from "./lavaMasses";
import { LAVA_BLEED_REM } from "./lavaPaint";
import { LAVA_RECIPE } from "./lavaRecipe";
import type { LavaInks } from "./useLavaInks";

export interface LavaScene {
  masses: readonly LavaMass[];
  blobs: LavaBlob[];
  fieldBlobs: Float64Array;
  glowPlacements: Float64Array;
  paint: LavaPaint | null;
}

export interface LavaLayout {
  surface: CanvasSurface;
  grid: LavaDotGrid;
  unit: number;
  fit: number;
}

const FULL_SIZE_REM = 36;
const THRESHOLD = lavaThreshold(LAVA_RECIPE.fusion);

function opacity(base: number, intensity: number): number {
  return clamp(base * intensity, 0, 1);
}

function surfaceFit(surface: CanvasSurface, unit: number): number {
  const visibleSide = Math.min(surface.width, surface.height) - 2 * LAVA_BLEED_REM * unit;
  return clamp(visibleSide / (FULL_SIZE_REM * unit), 0, 1);
}

export function createLavaScene(
  masses: readonly LavaMass[],
  inks: LavaInks | null,
  intensity: number,
): LavaScene {
  return {
    masses,
    blobs: masses.map(emptyBlob),
    fieldBlobs: new Float64Array(masses.length * FIELD_BLOB_STRIDE),
    glowPlacements: new Float64Array(masses.length * GLOW_PLACEMENT_STRIDE).fill(Number.NaN),
    paint: inks
      ? {
          ...inks,
          inkOpacity: opacity(LAVA_RECIPE.dotOpacity, intensity),
          litOpacity: opacity(LAVA_RECIPE.litOpacity, intensity),
        }
      : null,
  };
}

export function measureLava(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): LavaLayout {
  const unit = rootFontSize();
  const surface = fitCanvas(canvas, context, width, height);
  return {
    surface,
    grid: createLavaDotGrid(width, height, LAVA_RECIPE.pitchRem * unit),
    unit,
    fit: surfaceFit(surface, unit),
  };
}

function writeFieldBlobs(
  scene: LavaScene,
  { surface, unit, fit }: LavaLayout,
  seconds: number,
): void {
  const massPixels = LAVA_RECIPE.sizeRem * unit;
  for (let index = 0; index < scene.masses.length; index += 1) {
    const blob = blobAt(scene.masses[index], seconds, scene.blobs[index]);
    const offset = index * FIELD_BLOB_STRIDE;
    scene.fieldBlobs[offset] = blob.x * surface.width;
    scene.fieldBlobs[offset + 1] = blob.y * surface.height;
    scene.fieldBlobs[offset + 2] =
      blob.sizeShare * blob.breath * fit * massPixels * THRESHOLD.spread;
  }
}

export function paintLava(scene: LavaScene, layout: LavaLayout, seconds: number): void {
  writeFieldBlobs(scene, layout, seconds);
  if (!scene.paint) return;
  revealLavaDots(layout.grid, scene.fieldBlobs, THRESHOLD);
  drawLavaDots(layout.surface, layout.grid, scene.paint, LAVA_RECIPE.dotRem * layout.unit);
}
