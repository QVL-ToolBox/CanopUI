import Box from "@mui/material/Box";
import { HalloweenGlyphLayer } from "./HalloweenGlyphLayer";
import type { HalloweenSpiderSpec } from "./halloweenSceneTypes";
import { hiddenOnMobileSx } from "./hiddenOnMobileSx";
import { spiderAnchorSx, spiderBodySx, spiderLegsSx, threadSx } from "./spiderSx";

const VIEW_BOX = "0 0 24 24";
const LEGS =
  "M9 11.5L4 8L2.5 3M8.5 13L3 12L1 9M8.5 15L3 17L1.5 21M9.5 17L6 21L5 23.5M15 11.5L20 8L21.5 3M15.5 13L21 12L23 9M15.5 15L21 17L22.5 21M14.5 17L18 21L19 23.5";

interface HalloweenSpiderProps {
  spec: HalloweenSpiderSpec;
  animated: boolean;
}

export function HalloweenSpider({ spec, animated }: HalloweenSpiderProps) {
  return (
    <Box sx={[spiderAnchorSx(spec, animated), spec.hiddenOnMobile && hiddenOnMobileSx]}>
      <Box sx={threadSx(spec, animated)} />
      <Box component="span" sx={spiderBodySx(spec, animated)}>
        <HalloweenGlyphLayer viewBox={VIEW_BOX} sx={spiderLegsSx(spec, animated)}>
          <path data-part="legs" d={LEGS} strokeWidth="1.1" />
        </HalloweenGlyphLayer>
        <HalloweenGlyphLayer viewBox={VIEW_BOX}>
          <ellipse cx="12" cy="14" rx="4" ry="4.6" fill="currentColor" />
          <circle cx="12" cy="8.6" r="2.4" fill="currentColor" />
          <circle data-part="eye" cx="11.1" cy="8.2" r="0.45" />
          <circle data-part="eye" cx="12.9" cy="8.2" r="0.45" />
        </HalloweenGlyphLayer>
      </Box>
    </Box>
  );
}
