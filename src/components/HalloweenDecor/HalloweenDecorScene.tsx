import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { decorContentSx, decorRootSx } from "./halloweenLayerSx";
import type { CanopHalloweenDecorDensity, CanopHalloweenDecorScope } from "./halloweenSceneTypes";
import { HalloweenOverlayLayer } from "./HalloweenOverlayLayer";
import { HalloweenSceneLayer } from "./HalloweenSceneLayer";
import { useHalloweenDecor } from "./useHalloweenDecor";

interface HalloweenDecorSceneProps {
  density: CanopHalloweenDecorDensity;
  scope: CanopHalloweenDecorScope;
  behindPageContent: boolean;
  children?: ReactNode;
}

export function HalloweenDecorScene({
  density,
  scope,
  behindPageContent,
  children,
}: HalloweenDecorSceneProps) {
  const { animated, paused, toneVariables, overlayZIndex, ...scene } = useHalloweenDecor(density);

  return (
    <Box sx={decorRootSx(behindPageContent)}>
      <HalloweenSceneLayer
        scene={scene}
        scope={scope}
        animated={animated}
        paused={paused}
        toneVariables={toneVariables}
      />
      <Box sx={decorContentSx}>{children}</Box>
      <HalloweenOverlayLayer
        witch={scene.witch}
        spiders={scene.spiders}
        scope={scope}
        animated={animated}
        paused={paused}
        zIndex={overlayZIndex}
        toneVariables={toneVariables}
      />
    </Box>
  );
}
