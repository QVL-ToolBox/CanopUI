import Box from "@mui/material/Box";
import {
  fadeAnchorSx,
  peekAnchorSx,
  peekSlideSx,
  riseAnchorSx,
  wanderRiseSx,
  wanderTrackSx,
} from "./ghostSx";
import { HalloweenGhostGlyph } from "./HalloweenGhostGlyph";
import type { HalloweenGhostSpec } from "./halloweenSceneTypes";

interface HalloweenGhostProps {
  spec: HalloweenGhostSpec;
  animated: boolean;
}

export function HalloweenGhost({ spec, animated }: HalloweenGhostProps) {
  switch (spec.behavior) {
    case "wander":
      return (
        <Box sx={wanderTrackSx(spec, animated)}>
          <Box sx={wanderRiseSx(spec, animated)}>
            <HalloweenGhostGlyph
              depth={spec.depth}
              expression={spec.expression}
              sway={spec.float * 1.6}
              breathe={spec.breathe}
              delay={spec.delay}
              animated={animated}
            />
          </Box>
        </Box>
      );
    case "fade":
      return (
        <Box sx={fadeAnchorSx(spec, animated)}>
          <HalloweenGhostGlyph
            depth={spec.depth}
            expression={spec.expression}
            sway={spec.cycle / 3}
            breathe={null}
            delay={spec.delay}
            animated={animated}
          />
        </Box>
      );
    case "rise":
      return (
        <Box sx={riseAnchorSx(spec, animated)}>
          <HalloweenGhostGlyph
            depth={spec.depth}
            expression={spec.expression}
            sway={spec.cycle / 3}
            breathe={null}
            delay={spec.delay}
            animated={animated}
          />
        </Box>
      );
    case "peek":
      return (
        <Box sx={peekAnchorSx(spec)}>
          <Box sx={peekSlideSx(spec, animated)}>
            <HalloweenGhostGlyph
              depth={spec.depth}
              expression={spec.expression}
              sway={spec.cycle / 4}
              breathe={null}
              delay={spec.delay}
              animated={animated}
            />
          </Box>
        </Box>
      );
  }
}
