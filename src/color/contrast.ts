const HEX_COURT = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX_LONG = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export const LIGHT_COLOR_THRESHOLD = 0.62;

export interface CanopRgb {
  red: number;
  green: number;
  blue: number;
}

export function parseHexColor(hex: string): CanopRgb | null {
  const court = HEX_COURT.exec(hex.trim());
  if (court) {
    const [, r, g, b] = court;
    return {
      red: parseInt(r + r, 16),
      green: parseInt(g + g, 16),
      blue: parseInt(b + b, 16),
    };
  }
  const long = HEX_LONG.exec(hex.trim());
  if (!long) return null;
  const [, r, g, b] = long;
  return { red: parseInt(r, 16), green: parseInt(g, 16), blue: parseInt(b, 16) };
}

export function perceivedLuminance(hex: string): number | null {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;
  return (0.299 * rgb.red + 0.587 * rgb.green + 0.114 * rgb.blue) / 255;
}

export function isLightColor(hex: string): boolean {
  const luminance = perceivedLuminance(hex);
  return luminance !== null && luminance > LIGHT_COLOR_THRESHOLD;
}

export function contrastTextFor(hex: string): string {
  return isLightColor(hex)
    ? "var(--canop-palette-text-primary)"
    : "var(--canop-palette-background-default)";
}
