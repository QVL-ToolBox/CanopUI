import { useMemo } from "react";
import { useNeonGlow } from "../../theme/neonGlow";
import {
  emptyStateIllustrationSx,
  type EmptyStateIllustrationSx,
} from "./emptyStateIllustrationSx";
import {
  EMPTY_STATE_SIZES,
  type CanopEmptyStateSize,
  type EmptyStateSizeRecipe,
} from "./emptyStateSizes";
import type { CanopEmptyStateSurface } from "./emptyStateSurface";
import { useEmptyStateMotion, type EmptyStateMotion } from "./useEmptyStateMotion";

export interface UseEmptyStateParams {
  size: CanopEmptyStateSize;
  surface: CanopEmptyStateSurface;
  minHeight?: string;
  animated: boolean;
}

export interface UseEmptyStateResult {
  recipe: EmptyStateSizeRecipe;
  minHeight: string;
  choreography: EmptyStateMotion;
  illustrationSx: EmptyStateIllustrationSx;
}

export function useEmptyState({
  size,
  surface,
  minHeight,
  animated,
}: UseEmptyStateParams): UseEmptyStateResult {
  const recipe = EMPTY_STATE_SIZES[size];
  const choreography = useEmptyStateMotion(animated);
  const light = useNeonGlow() ? "neon" : "daylight";

  const illustrationSx = useMemo(
    () => emptyStateIllustrationSx(recipe, surface, light, choreography.live),
    [recipe, surface, light, choreography.live],
  );

  return { recipe, minHeight: minHeight ?? recipe.minHeight, choreography, illustrationSx };
}
