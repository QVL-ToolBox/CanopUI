import Box from "@mui/material/Box";
import { HalloweenBackdrop } from "./HalloweenBackdrop";
import { HalloweenForeground } from "./HalloweenForeground";
import { HalloweenMidground } from "./HalloweenMidground";
import { decorLayerSx } from "./halloweenLayerSx";
import type { CanopHalloweenDecorScope, HalloweenScene } from "./halloweenSceneTypes";

interface HalloweenSceneLayerProps {
  scene: HalloweenScene;
  scope: CanopHalloweenDecorScope;
  animated: boolean;
  paused: boolean;
  toneVariables: Record<string, string>;
}

export function HalloweenSceneLayer({
  scene,
  scope,
  animated,
  paused,
  toneVariables,
}: HalloweenSceneLayerProps) {
  return (
    <Box
      aria-hidden="true"
      data-paused={paused ? "true" : "false"}
      sx={[decorLayerSx(scope, paused), toneVariables]}
    >
      <HalloweenBackdrop scene={scene} animated={animated} />
      <HalloweenMidground scene={scene} animated={animated} />
      <HalloweenForeground scene={scene} animated={animated} />
    </Box>
  );
}
