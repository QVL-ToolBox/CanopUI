import Box from "@mui/material/Box";
import { decorRootSx } from "./halloweenLayerSx";
import { HalloweenSceneLayer } from "./HalloweenSceneLayer";
import { SEASONAL_DECOR_DENSITY } from "./seasonalDecorDensity";
import { useHalloweenDecor } from "./useHalloweenDecor";

interface HalloweenSeasonBackdropProps {
  behindPageContent: boolean;
}

export function HalloweenSeasonBackdrop({ behindPageContent }: HalloweenSeasonBackdropProps) {
  const decor = useHalloweenDecor(SEASONAL_DECOR_DENSITY);

  const layer = (
    <HalloweenSceneLayer
      scene={decor}
      scope="viewport"
      animated={decor.animated}
      paused={decor.paused}
      toneVariables={decor.toneVariables}
    />
  );

  return behindPageContent ? <Box sx={decorRootSx(true)}>{layer}</Box> : layer;
}
