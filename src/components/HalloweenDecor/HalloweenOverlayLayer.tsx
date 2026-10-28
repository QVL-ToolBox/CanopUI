import Box from "@mui/material/Box";
import Portal from "@mui/material/Portal";
import { overlayLayerSx } from "./halloweenLayerSx";
import type {
  CanopHalloweenDecorScope,
  HalloweenSpiderSpec,
  HalloweenWitchSpec,
} from "./halloweenSceneTypes";
import { HalloweenSpider } from "./HalloweenSpider";
import { HalloweenWitch } from "./HalloweenWitch";
import { useHalloweenLayerPause } from "./useHalloweenLayerPause";

interface HalloweenOverlayLayerProps {
  witch: HalloweenWitchSpec;
  spiders: HalloweenSpiderSpec[];
  scope: CanopHalloweenDecorScope;
  animated: boolean;
  tabHidden: boolean;
  revealed: boolean;
  zIndex: number;
  toneVariables: Record<string, string>;
}

export function HalloweenOverlayLayer({
  witch,
  spiders,
  scope,
  animated,
  tabHidden,
  revealed,
  zIndex,
  toneVariables,
}: HalloweenOverlayLayerProps) {
  const { ref, paused } = useHalloweenLayerPause(tabHidden);

  const layer = (
    <Box
      ref={ref}
      aria-hidden="true"
      data-paused={paused ? "true" : "false"}
      sx={[overlayLayerSx({ scope, paused, revealed }, zIndex), toneVariables]}
    >
      {revealed ? (
        <>
          {spiders.map((spec) => (
            <HalloweenSpider key={spec.id} spec={spec} animated={animated} />
          ))}
          {animated ? <HalloweenWitch spec={witch} /> : null}
        </>
      ) : null}
    </Box>
  );
  return scope === "viewport" ? <Portal>{layer}</Portal> : layer;
}
