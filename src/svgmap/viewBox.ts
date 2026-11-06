export interface CanopViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanopViewBoxLimits {
  minWidth: number;
}

export interface CanopViewBoxOrigin {
  x: number;
  y: number;
}

const NUMBER_SEPARATOR = /[\s,]+/;

export function parseViewBox(value: string): CanopViewBox | null {
  const parts = value.trim().split(NUMBER_SEPARATOR).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  const [x, y, width, height] = parts;
  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

export function formatViewBox(box: CanopViewBox): string {
  return `${box.x} ${box.y} ${box.width} ${box.height}`;
}

export function viewBoxAspect(box: CanopViewBox): number {
  return box.height === 0 ? 1 : box.width / box.height;
}

export function clampViewBox(
  box: CanopViewBox,
  base: CanopViewBox,
  limits: CanopViewBoxLimits,
): CanopViewBox {
  const aspect = viewBoxAspect(base);
  const width = Math.min(Math.max(box.width, limits.minWidth), base.width);
  const height = width / aspect;
  const x = Math.min(Math.max(box.x, base.x), base.x + base.width - width);
  const y = Math.min(Math.max(box.y, base.y), base.y + base.height - height);
  return { x, y, width, height };
}

export function zoomViewBox(
  box: CanopViewBox,
  base: CanopViewBox,
  factor: number,
  origin: CanopViewBoxOrigin,
  limits: CanopViewBoxLimits,
): CanopViewBox {
  const aspect = viewBoxAspect(base);
  const sceneX = box.x + origin.x * box.width;
  const sceneY = box.y + origin.y * box.height;
  const width = box.width * factor;
  const height = width / aspect;
  return clampViewBox(
    { x: sceneX - origin.x * width, y: sceneY - origin.y * height, width, height },
    base,
    limits,
  );
}

export function panViewBox(
  box: CanopViewBox,
  base: CanopViewBox,
  dxFraction: number,
  dyFraction: number,
  limits: CanopViewBoxLimits,
): CanopViewBox {
  return clampViewBox(
    { ...box, x: box.x - dxFraction * box.width, y: box.y - dyFraction * box.height },
    base,
    limits,
  );
}

export interface CanopFitOptions extends CanopViewBoxLimits {
  padding?: number;
}

export function fitViewBox(
  boxes: readonly CanopViewBox[],
  base: CanopViewBox,
  options: CanopFitOptions,
): CanopViewBox {
  const { padding = 1.25, minWidth } = options;
  if (boxes.length === 0) return clampViewBox(base, base, { minWidth });

  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));

  const aspect = viewBoxAspect(base);
  const wanted = Math.max(right - left, (bottom - top) * aspect) * padding;
  const width = Math.min(Math.max(wanted, minWidth), base.width);
  const height = width / aspect;
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;

  return clampViewBox({ x: centerX - width / 2, y: centerY - height / 2, width, height }, base, {
    minWidth,
  });
}

export function isZoomed(box: CanopViewBox, base: CanopViewBox): boolean {
  return box.width < base.width - Number.EPSILON * base.width - 1e-6;
}
