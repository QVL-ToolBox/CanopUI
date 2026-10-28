import { FROSTED_CARD_LIQUID_GLASS } from "../../liquidGlass/frostedCardLiquidGlass";
import type { CanopLiquidGlassParams } from "../../liquidGlass/liquidGlassParams";
import {
  useRefractionFilter,
  type CanopRefractionFilter,
} from "../../liquidGlass/useRefractionFilter";

interface UseCardLiquidGlassParams {
  frosted: boolean;
  refraction: boolean;
  radius: string;
}

export interface CardLiquidGlass {
  ref: ((element: HTMLDivElement | null) => void) | undefined;
  filter: CanopRefractionFilter | null;
  params: Readonly<CanopLiquidGlassParams>;
  radius: string;
}

export function useCardLiquidGlass({
  frosted,
  refraction,
  radius,
}: UseCardLiquidGlassParams): CardLiquidGlass | null {
  const { ref, filter } = useRefractionFilter<HTMLDivElement>({
    enabled: frosted && refraction,
    radius,
    bevel: FROSTED_CARD_LIQUID_GLASS.bevel,
    displacement: FROSTED_CARD_LIQUID_GLASS.displacement,
    dispersion: FROSTED_CARD_LIQUID_GLASS.dispersion,
  });

  if (!frosted) return null;
  return { ref, filter, params: FROSTED_CARD_LIQUID_GLASS, radius };
}
