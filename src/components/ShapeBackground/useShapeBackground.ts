import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";
import { clamp } from "../_shared/clamp";
import {
  AMBIENT_DARK_OPACITY_FACTOR,
  edgeShapes,
  shapePools,
  variantConfig,
  type CanopShapeDefinition,
  type CanopShapeTier,
  type CanopShapeVariant,
} from "./shapes";

export interface UseShapeBackgroundParams {
  variant: CanopShapeVariant;
  density?: number;
  intensity: number;
  color: string;
}

export interface UseShapeBackgroundResult {
  shapes: CanopShapeDefinition[];
  shapeBlur?: string;
  showVeil: boolean;
  veilOpacity: number;
  backgroundColor: string;
  contentJustify: "center" | "flex-start";
}

export function useShapeBackground({
  variant,
  density,
  intensity,
  color,
}: UseShapeBackgroundParams): UseShapeBackgroundResult {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tier: CanopShapeTier = isDesktop ? "desktop" : isMobile ? "mobile" : "tablet";
  const config = variantConfig[variant];

  const shapes = useMemo(() => {
    const pool =
      variant === "edge"
        ? edgeShapes
        : tier === "mobile"
          ? shapePools[variant].mobile
          : shapePools[variant].desktop;
    const count = Math.min(density ?? config.defaultDensity[tier], pool.length);
    const opacityFactor =
      intensity * (variant === "ambient" && isDark ? AMBIENT_DARK_OPACITY_FACTOR : 1);
    return pool
      .slice(0, count)
      .map((shape) => ({ ...shape, opacity: clamp(shape.opacity * opacityFactor, 0, 1) }));
  }, [variant, tier, density, intensity, isDark, config]);

  return {
    shapes,
    shapeBlur: config.shapeBlur,
    showVeil: config.hasVeil,
    veilOpacity: isDark ? config.veilOpacity.dark : config.veilOpacity.light,
    backgroundColor: variant === "hero" ? color : config.backgroundRole,
    contentJustify: config.contentJustify,
  };
}
