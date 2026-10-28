import { HalloweenOverlayLayer } from "./HalloweenOverlayLayer";
import { SEASONAL_DECOR_DENSITY } from "./seasonalDecorDensity";
import { useHalloweenDecor } from "./useHalloweenDecor";

export function HalloweenSeasonOverlay() {
  const { witch, spiders, animated, tabHidden, revealed, overlayZIndex, toneVariables } =
    useHalloweenDecor(SEASONAL_DECOR_DENSITY);

  return (
    <HalloweenOverlayLayer
      witch={witch}
      spiders={spiders}
      scope="viewport"
      animated={animated}
      tabHidden={tabHidden}
      revealed={revealed}
      zIndex={overlayZIndex}
      toneVariables={toneVariables}
    />
  );
}
