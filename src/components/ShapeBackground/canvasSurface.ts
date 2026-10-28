export interface CanvasSurface {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelRatio: number;
}

const MAX_PIXEL_RATIO = 2;
const ROOT_FONT_FALLBACK = 16;

export function rootFontSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || ROOT_FONT_FALLBACK;
}

function cappedPixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
}

export function fitCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): CanvasSurface {
  const pixelRatio = cappedPixelRatio();
  canvas.width = Math.max(1, Math.round(width * pixelRatio));
  canvas.height = Math.max(1, Math.round(height * pixelRatio));
  return { context, width, height, pixelRatio };
}
