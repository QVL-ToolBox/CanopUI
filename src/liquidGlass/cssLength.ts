const FALLBACK_ROOT_FONT_SIZE = 16;
const CSS_VARIABLE = /^var\(\s*(--[^),\s]+)/;
const REM = "rem";

function rootFontSize(): number {
  if (typeof document === "undefined") return FALLBACK_ROOT_FONT_SIZE;
  const size = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(size) && size > 0 ? size : FALLBACK_ROOT_FONT_SIZE;
}

function resolveVariable(element: Element, length: string): string {
  const variable = CSS_VARIABLE.exec(length);
  if (!variable) return length;
  return getComputedStyle(element).getPropertyValue(variable[1]).trim();
}

export function remToPixels(rem: number): number {
  return rem * rootFontSize();
}

export function lengthToPixels(element: Element, length: string): number {
  const resolved = resolveVariable(element, length.trim());
  const value = Number.parseFloat(resolved);
  if (!Number.isFinite(value)) return 0;
  return resolved.endsWith(REM) ? remToPixels(value) : value;
}
