import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { lavaBaseColor } from "./lavaPaint";
import { LAVA_RECIPE, type LavaSettings } from "./lavaRecipe";
import { resolveShapeHue } from "./shapeHue";
import { shapeLayouts, type CanopShapeVariant, type ShapeLayout } from "./shapeLayout";
import { useLavaMotion, type LavaMotion } from "./useLavaMotion";

export interface UseShapeBackgroundParams {
  variant: CanopShapeVariant;
  density?: number;
  intensity: number;
  color: string;
  animated: boolean;
}

export interface UseShapeBackgroundResult {
  layout: ShapeLayout;
  lava: LavaSettings;
  motion: LavaMotion;
  backgroundColor: string;
}

export function useShapeBackground({
  variant,
  density,
  intensity,
  color,
  animated,
}: UseShapeBackgroundParams): UseShapeBackgroundResult {
  const mode = useTheme().palette.mode;
  const motion = useLavaMotion(animated);
  const hue = resolveShapeHue(color);
  const masses = density ?? LAVA_RECIPE.masses;

  const lava = useMemo<LavaSettings>(
    () => ({ hue, mode, masses, intensity: Math.max(0, intensity) }),
    [hue, mode, masses, intensity],
  );

  return {
    layout: shapeLayouts[variant],
    lava,
    motion,
    backgroundColor: lavaBaseColor(hue),
  };
}
