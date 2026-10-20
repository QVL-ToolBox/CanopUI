import type { CanopPaletteColorName } from "../_shared/paletteColorVar";

interface PaletteStrokeGradientProps {
  id: string;
  color: CanopPaletteColorName;
}

export function PaletteStrokeGradient({ id, color }: PaletteStrokeGradientProps) {
  return (
    <>
      <svg aria-hidden focusable="false" width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: `var(--canop-palette-${color}-light)` }} />
            <stop offset="55%" style={{ stopColor: `var(--canop-palette-${color}-main)` }} />
            <stop offset="100%" style={{ stopColor: `var(--canop-palette-${color}-dark)` }} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
