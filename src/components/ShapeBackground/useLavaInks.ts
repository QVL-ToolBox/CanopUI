import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";
import type { CanopThemeMode } from "../../theme";

export interface LavaInks {
  ink: string;
  lit: string;
}

const LIT_SHADE: Record<CanopThemeMode, "main" | "light"> = { dark: "light", light: "main" };

function readVariable(element: Element, name: string): string {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

function readInks(
  element: Element,
  hue: CanopPaletteColorName,
  mode: CanopThemeMode,
): LavaInks | null {
  const ink = readVariable(element, "--canop-palette-text-primary");
  const lit = readVariable(element, `--canop-palette-${hue}-${LIT_SHADE[mode]}`);
  return ink && lit ? { ink, lit } : null;
}

export function useLavaInks(
  element: Element | null,
  hue: CanopPaletteColorName,
  mode: CanopThemeMode,
): LavaInks | null {
  const theme = useTheme();
  const [inks, setInks] = useState<LavaInks | null>(null);

  useEffect(() => {
    if (!element) return;
    const frame = requestAnimationFrame(() => setInks(readInks(element, hue, mode)));
    return () => cancelAnimationFrame(frame);
  }, [element, hue, mode, theme]);

  return inks;
}
