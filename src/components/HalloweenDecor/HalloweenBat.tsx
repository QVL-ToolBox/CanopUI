import Box from "@mui/material/Box";
import { batAltitudeSx, batCruiseSx, batJitterSx, batLoopSx } from "./batSx";
import { HalloweenBatGlyph } from "./HalloweenBatGlyph";
import type { HalloweenBatSpec } from "./halloweenSceneTypes";

interface HalloweenBatProps {
  spec: HalloweenBatSpec;
  animated: boolean;
}

export function HalloweenBat({ spec, animated }: HalloweenBatProps) {
  return (
    <Box sx={batCruiseSx(spec, animated)}>
      <Box sx={batAltitudeSx(spec, animated)}>
        <Box sx={batJitterSx(spec, animated)}>
          <Box sx={batLoopSx(spec, animated)}>
            <HalloweenBatGlyph
              mirrored={spec.heading === -1}
              flap={spec.flap}
              animated={animated}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
