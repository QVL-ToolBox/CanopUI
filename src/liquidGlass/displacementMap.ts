export interface DisplacementMapGeometry {
  width: number;
  height: number;
  radius: number;
  bevel: number;
  exponent: number;
}

interface EdgeSample {
  distance: number;
  normalX: number;
  normalY: number;
}

interface CornerRadii {
  x: number;
  y: number;
}

interface SizedGeometry {
  width: number;
  height: number;
  radii: CornerRadii;
  bevel: number;
  exponent: number;
}

const NEUTRAL_CHANNEL = 128;
const CHANNEL_REACH = 127;
const OPAQUE = 255;
const CHANNELS = 4;
const PIXEL_CENTER = 0.5;
const CACHE_CAPACITY = 16;

const mapCache = new Map<string, string>();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cornerRadii(width: number, height: number, radius: number): CornerRadii {
  const bounded = Math.max(0, radius);
  return { x: Math.min(bounded, width / 2), y: Math.min(bounded, height / 2) };
}

function sized(geometry: DisplacementMapGeometry): SizedGeometry {
  const width = Math.max(1, Math.round(geometry.width));
  const height = Math.max(1, Math.round(geometry.height));
  return {
    width,
    height,
    radii: cornerRadii(width, height, geometry.radius),
    bevel: geometry.bevel,
    exponent: geometry.exponent,
  };
}

function setSample(sample: EdgeSample, distance: number, normalX: number, normalY: number): void {
  sample.distance = distance;
  sample.normalX = normalX;
  sample.normalY = normalY;
}

function writeStraightEdgeSample(
  x: number,
  y: number,
  geometry: SizedGeometry,
  sample: EdgeSample,
): void {
  setSample(sample, x, -1, 0);
  if (geometry.width - x < sample.distance) setSample(sample, geometry.width - x, 1, 0);
  if (y < sample.distance) setSample(sample, y, 0, -1);
  if (geometry.height - y < sample.distance) setSample(sample, geometry.height - y, 0, 1);
}

function writeSuperellipseEdgeSample(
  offsetX: number,
  offsetY: number,
  geometry: SizedGeometry,
  sample: EdgeSample,
): void {
  const { radii, exponent } = geometry;
  const u = offsetX / radii.x;
  const v = offsetY / radii.y;
  const absoluteU = Math.abs(u);
  const absoluteV = Math.abs(v);
  const norm = (absoluteU ** exponent + absoluteV ** exponent) ** (1 / exponent);
  const gradientX = (Math.sign(u) * absoluteU ** (exponent - 1)) / radii.x;
  const gradientY = (Math.sign(v) * absoluteV ** (exponent - 1)) / radii.y;
  const length = Math.hypot(gradientX, gradientY) || 1;
  setSample(
    sample,
    (1 - norm) * Math.min(radii.x, radii.y),
    gradientX / length,
    gradientY / length,
  );
}

function writeEdgeSample(x: number, y: number, geometry: SizedGeometry, sample: EdgeSample): void {
  const { width, height, radii } = geometry;
  const offsetX = x - clamp(x, radii.x, width - radii.x);
  const offsetY = y - clamp(y, radii.y, height - radii.y);
  if (offsetX === 0 && offsetY === 0) {
    writeStraightEdgeSample(x, y, geometry, sample);
    return;
  }
  writeSuperellipseEdgeSample(offsetX, offsetY, geometry, sample);
}

function lensProfile(edgeProximity: number): number {
  return edgeProximity * edgeProximity;
}

function inwardPull(sample: EdgeSample, bevel: number): number {
  const proximity = clamp(1 - sample.distance / bevel, 0, 1);
  return lensProfile(proximity);
}

function channel(inwardComponent: number): number {
  return Math.round(NEUTRAL_CHANNEL + CHANNEL_REACH * inwardComponent);
}

function neutralPixels(width: number, height: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * CHANNELS).fill(NEUTRAL_CHANNEL);
  for (let alpha = CHANNELS - 1; alpha < pixels.length; alpha += CHANNELS) {
    pixels[alpha] = OPAQUE;
  }
  return pixels;
}

function writePixel(
  pixels: Uint8ClampedArray,
  geometry: SizedGeometry,
  sample: EdgeSample,
  column: number,
  row: number,
): void {
  writeEdgeSample(column + PIXEL_CENTER, row + PIXEL_CENTER, geometry, sample);
  const pull = inwardPull(sample, geometry.bevel);
  const index = (row * geometry.width + column) * CHANNELS;
  pixels[index] = channel(-sample.normalX * pull);
  pixels[index + 1] = channel(-sample.normalY * pull);
}

function columnReach(row: number, geometry: SizedGeometry): number {
  const { width, height, radii, bevel } = geometry;
  const rowsFromEdge = Math.min(row, height - 1 - row);
  if (rowsFromEdge < Math.ceil(Math.max(bevel, radii.y))) return width;
  return Math.max(bevel, radii.x);
}

function writeBevelRow(
  pixels: Uint8ClampedArray,
  geometry: SizedGeometry,
  sample: EdgeSample,
  row: number,
): void {
  const { width } = geometry;
  const reach = Math.ceil(columnReach(row, geometry));
  const leadingEnd = Math.min(width, reach);
  const trailingStart = Math.max(leadingEnd, width - reach);
  for (let column = 0; column < leadingEnd; column += 1) {
    writePixel(pixels, geometry, sample, column, row);
  }
  for (let column = trailingStart; column < width; column += 1) {
    writePixel(pixels, geometry, sample, column, row);
  }
}

function pixelsOf(geometry: SizedGeometry): Uint8ClampedArray {
  const pixels = neutralPixels(geometry.width, geometry.height);
  if (!(geometry.bevel > 0)) return pixels;
  const sample: EdgeSample = { distance: 0, normalX: 0, normalY: 0 };
  for (let row = 0; row < geometry.height; row += 1) {
    writeBevelRow(pixels, geometry, sample, row);
  }
  return pixels;
}

export function displacementPixels(geometry: DisplacementMapGeometry): Uint8ClampedArray {
  return pixelsOf(sized(geometry));
}

export function sameDisplacementGeometry(
  previous: DisplacementMapGeometry,
  next: DisplacementMapGeometry,
): boolean {
  return (
    previous.width === next.width &&
    previous.height === next.height &&
    previous.radius === next.radius &&
    previous.bevel === next.bevel &&
    previous.exponent === next.exponent
  );
}

function cacheKey({ width, height, radii, bevel, exponent }: SizedGeometry): string {
  return [width, height, radii.x, radii.y, bevel, exponent].join(":");
}

function recall(key: string): string | undefined {
  const map = mapCache.get(key);
  if (map === undefined) return undefined;
  mapCache.delete(key);
  mapCache.set(key, map);
  return map;
}

function remember(key: string, map: string): void {
  mapCache.set(key, map);
  if (mapCache.size <= CACHE_CAPACITY) return;
  const oldest = mapCache.keys().next();
  if (!oldest.done) mapCache.delete(oldest.value);
}

function paint(geometry: SizedGeometry): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = geometry.width;
  canvas.height = geometry.height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(geometry.width, geometry.height);
  image.data.set(pixelsOf(geometry));
  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function displacementMapKey(geometry: DisplacementMapGeometry): string {
  return cacheKey(sized(geometry));
}

export function cachedDisplacementMap(key: string): string | null {
  return mapCache.get(key) ?? null;
}

export function createDisplacementMap(geometry: DisplacementMapGeometry): string | null {
  const sizedGeometry = sized(geometry);
  const key = cacheKey(sizedGeometry);
  const known = recall(key);
  if (known !== undefined) return known;
  const map = paint(sizedGeometry);
  if (map !== null) remember(key, map);
  return map;
}
