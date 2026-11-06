import Box from "@mui/material/Box";
import type { Ref } from "react";
import type { CanopLiquidGlassParams } from "./liquidGlassParams";
import { liquidGlassInnerShadowSx, liquidGlassLayersSx } from "./liquidGlassSx";
import { RefractionFilterDefs } from "./RefractionFilterDefs";
import type { CanopRefractionFilter } from "./useRefractionFilter";

export interface CanopLiquidGlassLayersProps {
  ref?: Ref<HTMLDivElement>;
  params: CanopLiquidGlassParams;
  radius: string;
  filter: CanopRefractionFilter | null;
}

export function LiquidGlassLayers({ ref, params, radius, filter }: CanopLiquidGlassLayersProps) {
  return (
    <Box ref={ref} aria-hidden sx={liquidGlassLayersSx(params, radius)}>
      {filter ? <RefractionFilterDefs filter={filter} /> : null}
      {params.innerShadow > 0 ? <Box sx={liquidGlassInnerShadowSx(params, radius)} /> : null}
    </Box>
  );
}
