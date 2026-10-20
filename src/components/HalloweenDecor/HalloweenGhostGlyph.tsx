import Box from "@mui/material/Box";
import { ghostGlyphSx } from "./ghostSx";
import { HalloweenGhostFace } from "./HalloweenGhostFace";
import type { HalloweenDepth, HalloweenExpression } from "./halloweenSceneTypes";

const BODY =
  "M5.5 19.25V11a7.5 7.5 0 0 1 15 0v8.25a2.5 1.6 0 0 1-5 0a2.5 1.6 0 0 1-5 0a2.5 1.6 0 0 1-5 0z";
const LEFT_ARM = "M5.6 13.6c-1.5.1-2.8 1.1-3.3 2.6c1.1-.5 2.3-.5 3.3.1z";
const RIGHT_ARM = "M20.4 13.6c1.5.1 2.8 1.1 3.3 2.6c-1.1-.5-2.3-.5-3.3.1z";

interface HalloweenGhostGlyphProps {
  depth: HalloweenDepth;
  expression: HalloweenExpression;
  sway: number;
  breathe: number | null;
  delay: number;
  animated: boolean;
}

export function HalloweenGhostGlyph({
  depth,
  expression,
  sway,
  breathe,
  delay,
  animated,
}: HalloweenGhostGlyphProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 26 26"
      sx={ghostGlyphSx(depth, { sway, breathe, delay }, animated)}
    >
      <path d={BODY} fill="currentColor" />
      <path d={LEFT_ARM} fill="currentColor" />
      <path d={RIGHT_ARM} fill="currentColor" />
      <HalloweenGhostFace expression={expression} />
    </Box>
  );
}
