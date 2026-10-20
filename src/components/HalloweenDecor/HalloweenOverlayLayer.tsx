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

interface HalloweenOverlayLayerProps {
  witch: HalloweenWitchSpec;
  spiders: HalloweenSpiderSpec[];
  scope: CanopHalloweenDecorScope;
  animated: boolean;
  paused: boolean;
  zIndex: number;
  toneVariables: Record<string, string>;
}

export function HalloweenOverlayLayer({
  witch,
  spiders,
  scope,
  animated,
  paused,
  zIndex,
  toneVariables,
}: HalloweenOverlayLayerProps) {
  const layer = (
    <Box
      aria-hidden="true"
      data-paused={paused ? "true" : "false"}
      sx={[overlayLayerSx(scope, paused, zIndex), toneVariables]}
    >
      {spiders.map((spec) => (
        <HalloweenSpider key={spec.id} spec={spec} animated={animated} />
      ))}
      {animated ? <HalloweenWitch spec={witch} /> : null}
    </Box>
  );
  return scope === "viewport" ? <Portal>{layer}</Portal> : layer;
}
