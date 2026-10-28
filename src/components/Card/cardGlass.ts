import type { CSSProperties } from "react";
import { FROSTED_CARD_LIQUID_GLASS } from "../../liquidGlass/frostedCardLiquidGlass";
import {
  liquidGlassBackdropFilter,
  liquidGlassBackground,
  liquidGlassFallbackBackground,
} from "../../liquidGlass/liquidGlassSx";
import { tokens } from "../../tokens";

export interface CardGlass {
  background: string;
  backdropFilter: string;
  opaqueFallback: { background: string } | { backgroundColor: string };
}

export const FROSTED_GLASS: CardGlass = {
  background: liquidGlassBackground(FROSTED_CARD_LIQUID_GLASS),
  backdropFilter: liquidGlassBackdropFilter(FROSTED_CARD_LIQUID_GLASS),
  opaqueFallback: { background: liquidGlassFallbackBackground(FROSTED_CARD_LIQUID_GLASS) },
};

export function frostedRefractionStyle(refractionFilterId?: string): CSSProperties | undefined {
  if (!refractionFilterId) return undefined;
  const backdropFilter = liquidGlassBackdropFilter(FROSTED_CARD_LIQUID_GLASS, refractionFilterId);
  return { backdropFilter, WebkitBackdropFilter: backdropFilter };
}

export const FROSTED_PADDING = { xs: tokens.spacing.md, md: tokens.spacing.xl } as const;
