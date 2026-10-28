import Box from "@mui/material/Box";
import { HalloweenBackdrop } from "./HalloweenBackdrop";
import { HalloweenForeground } from "./HalloweenForeground";
import { HalloweenMidground } from "./HalloweenMidground";
import { decorLayerSx } from "./halloweenLayerSx";
import type { CanopHalloweenDecorScope, HalloweenScene } from "./halloweenSceneTypes";
import { useHalloweenLayerPause } from "./useHalloweenLayerPause";

interface HalloweenSceneLayerProps {
  scene: HalloweenScene;
  scope: CanopHalloweenDecorScope;
  animated: boolean;
  tabHidden: boolean;
  revealed: boolean;
  toneVariables: Record<string, string>;
}

export function HalloweenSceneLayer({
  scene,
  scope,
  animated,
  tabHidden,
  revealed,
  toneVariables,
}: HalloweenSceneLayerProps) {
  const { ref, paused } = useHalloweenLayerPause(tabHidden);

  return (
    <Box
      ref={ref}
      aria-hidden="true"
      data-paused={paused ? "true" : "false"}
      sx={[decorLayerSx({ scope, paused, revealed }), toneVariables]}
    >
      {revealed ? (
        <>
          <HalloweenBackdrop scene={scene} animated={animated} />
          <HalloweenMidground scene={scene} animated={animated} />
          <HalloweenForeground scene={scene} animated={animated} />
        </>
      ) : null}
    </Box>
  );
}
