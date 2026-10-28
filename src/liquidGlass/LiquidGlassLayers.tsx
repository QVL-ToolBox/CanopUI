import Box from "@mui/material/Box";
import type { Ref } from "react";
import type { CanopLiquidGlassParams } from "./liquidGlassParams";
import { liquidGlassInnerShadowSx, liquidGlassLayersSx } from "./liquidGlassSx";
import { RefractionFilterDefs } from "./RefractionFilterDefs";
import type { CanopRefractionFilter } from "./useRefractionFilter";

export interface CanopLiquidGlassLayersProps {
  /** Ref du calque, à relier au `ref` de `useRefractionFilter` pour mesurer la surface. */
  ref?: Ref<HTMLDivElement>;
  params: CanopLiquidGlassParams;
  /** Rayon des coins : longueur CSS en rem ou `var(--…)`. */
  radius: string;
  filter: CanopRefractionFilter | null;
}

/**
 * Calques décoratifs du verre, à poser en premier enfant de la surface : liseré spéculaire, ombre
 * interne et définition SVG du filtre de réfraction. Masqués aux technologies d'assistance.
 */
export function LiquidGlassLayers({ ref, params, radius, filter }: CanopLiquidGlassLayersProps) {
  return (
    <Box ref={ref} aria-hidden sx={liquidGlassLayersSx(params, radius)}>
      {filter ? <RefractionFilterDefs filter={filter} /> : null}
      {params.innerShadow > 0 ? <Box sx={liquidGlassInnerShadowSx(params, radius)} /> : null}
    </Box>
  );
}
