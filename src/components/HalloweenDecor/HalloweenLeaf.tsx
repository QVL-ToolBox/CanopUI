import Box from "@mui/material/Box";
import type { HalloweenLeafSpec } from "./halloweenSceneTypes";
import { leafFallSx, leafGlyphSx, leafSwaySx } from "./leafSx";

const BLADE =
  "M12 2l1.8 4.2l3.6-1.4l-1 3.9l4.1.5l-2.9 2.8l2.4 2.6l-3.9.4l.5 3.8l-3.4-2L12 21l-1.2-4.2l-3.4 2l.5-3.8l-3.9-.4l2.4-2.6l-2.9-2.8l4.1-.5l-1-3.9l3.6 1.4z";
const STEM = "M12 17v5";

interface HalloweenLeafProps {
  spec: HalloweenLeafSpec;
  animated: boolean;
}

export function HalloweenLeaf({ spec, animated }: HalloweenLeafProps) {
  return (
    <Box sx={leafFallSx(spec, animated)}>
      <Box sx={leafSwaySx(spec, animated)}>
        <Box component="svg" viewBox="0 0 24 24" sx={leafGlyphSx(spec, animated)}>
          <path d={BLADE} fill="currentColor" />
          <path d={STEM} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </Box>
      </Box>
    </Box>
  );
}
