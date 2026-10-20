import Box from "@mui/material/Box";
import { graveGhostSx } from "./ghostSx";
import { HalloweenGhostGlyph } from "./HalloweenGhostGlyph";
import type { HalloweenGraveGhostSpec } from "./halloweenSceneTypes";

interface HalloweenGraveGhostProps {
  spec: HalloweenGraveGhostSpec;
  animated: boolean;
}

export function HalloweenGraveGhost({ spec, animated }: HalloweenGraveGhostProps) {
  return (
    <Box sx={graveGhostSx(spec, animated)}>
      <HalloweenGhostGlyph
        depth="ground"
        expression={spec.expression}
        sway={spec.cycle / 3}
        breathe={null}
        delay={spec.delay}
        animated={animated}
      />
    </Box>
  );
}
