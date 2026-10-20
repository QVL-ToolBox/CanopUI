import { HalloweenOverlayLayer } from "./HalloweenOverlayLayer";
import { SEASONAL_DECOR_DENSITY } from "./seasonalDecorDensity";
import { useHalloweenDecor } from "./useHalloweenDecor";

export function HalloweenSeasonOverlay() {
  const { witch, spiders, animated, paused, overlayZIndex, toneVariables } =
    useHalloweenDecor(SEASONAL_DECOR_DENSITY);

  return (
    <HalloweenOverlayLayer
      witch={witch}
      spiders={spiders}
      scope="viewport"
      animated={animated}
      paused={paused}
      zIndex={overlayZIndex}
      toneVariables={toneVariables}
    />
  );
}
