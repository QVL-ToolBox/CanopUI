import Box from "@mui/material/Box";
import { swarmBobSx, swarmSwingSx, swarmSx, swarmTurnSx } from "./batSx";
import { HalloweenBatGlyph } from "./HalloweenBatGlyph";
import type { HalloweenSwarmSpec } from "./halloweenSceneTypes";

interface HalloweenBatSwarmProps {
  spec: HalloweenSwarmSpec;
  animated: boolean;
}

export function HalloweenBatSwarm({ spec, animated }: HalloweenBatSwarmProps) {
  return (
    <Box sx={swarmSx(spec, animated)}>
      {spec.bats.map((bat) => (
        <Box key={bat.id} sx={swarmSwingSx(bat, animated)}>
          <Box sx={swarmBobSx(bat, animated)}>
            <Box sx={swarmTurnSx(bat, animated)}>
              <HalloweenBatGlyph mirrored={false} flap={bat.flap} animated={animated} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
