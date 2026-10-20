export const TOUCH_TARGET_MIN = "2.75rem";

export function touchPaddingFor(size: string): string {
  const manque = Number.parseFloat(TOUCH_TARGET_MIN) - Number.parseFloat(size);
  return `${Math.max(0, manque / 2)}rem`;
}
