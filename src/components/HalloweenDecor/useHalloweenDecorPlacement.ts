import type { CanopHalloweenDecorScope } from "./halloweenSceneTypes";
import { useSeasonalDecorContext } from "./SeasonalDecorContext";

interface HalloweenDecorPlacement {
  alreadyRenderedByTheme: boolean;
  behindPageContent: boolean;
}

export function useHalloweenDecorPlacement(
  scope: CanopHalloweenDecorScope,
  hasChildren: boolean,
): HalloweenDecorPlacement {
  const { managedByTheme } = useSeasonalDecorContext();
  const pinnedToViewport = scope === "viewport";
  return {
    alreadyRenderedByTheme: pinnedToViewport && managedByTheme,
    behindPageContent: pinnedToViewport && !hasChildren,
  };
}
