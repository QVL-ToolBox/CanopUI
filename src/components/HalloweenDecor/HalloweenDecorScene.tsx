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
  const { animated, tabHidden, revealed, toneVariables, overlayZIndex, ...scene } =
    useHalloweenDecor(density);

  return (
    <Box sx={decorRootSx(behindPageContent)}>
      <HalloweenSceneLayer
        scene={scene}
        scope={scope}
        animated={animated}
        tabHidden={tabHidden}
        revealed={revealed}
        toneVariables={toneVariables}
      />
      <Box sx={decorContentSx}>{children}</Box>
      <HalloweenOverlayLayer
        witch={scene.witch}
        spiders={scene.spiders}
        scope={scope}
        animated={animated}
        tabHidden={tabHidden}
        revealed={revealed}
        zIndex={overlayZIndex}
        toneVariables={toneVariables}
      />
    </Box>
  );
}
