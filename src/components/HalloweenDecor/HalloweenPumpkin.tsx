import Box from "@mui/material/Box";
import { HalloweenGlyphLayer } from "./HalloweenGlyphLayer";
import type { HalloweenPumpkinSpec } from "./halloweenSceneTypes";
import { pumpkinBodySx, pumpkinFaceSx, pumpkinGlowSx, pumpkinSx } from "./pumpkinSx";

const VIEW_BOX = "0 0 24 24";
const BODY =
  "M12 7.75c-1.6-.9-4-.95-5.9.1C3.7 9.2 2.75 11.6 2.75 14.25c0 3.6 2.6 6 5.6 6c1.4 0 2.6-.4 3.65-1.05c1.05.65 2.25 1.05 3.65 1.05c3 0 5.6-2.4 5.6-6c0-2.65-.95-5.05-3.35-6.4c-1.9-1.05-4.3-1-5.9-.1z";
const RIBS =
  "M12 7.75c-1.75 1.5-2.6 3.9-2.6 6.5s.9 4.25 2.6 4.95m0-11.45c1.75 1.5 2.6 3.9 2.6 6.5s-.9 4.25-2.6 4.95";
const STEM = "M12 7.25V5.5c0-1 .6-1.9 1.6-2.25m-.85 2c1.4-.2 2.6.4 3.1 1.5";
const FACE =
  "M7.75 13.25l1.5-2.25l1.5 2.25zm5.5 0l1.5-2.25l1.5 2.25zM7.5 15.5c1.2 1.6 2.7 2.25 4.5 2.25s3.3-.65 4.5-2.25l-1.5.5l-.75-.75l-1 .9l-1.25-.9l-1.25.9l-1-.9l-.75.75z";

interface HalloweenPumpkinProps {
  spec: HalloweenPumpkinSpec;
  animated: boolean;
}

export function HalloweenPumpkin({ spec, animated }: HalloweenPumpkinProps) {
  return (
    <Box sx={pumpkinSx(spec)}>
      {spec.lit ? <Box sx={pumpkinGlowSx(spec, animated)} /> : null}
      <Box component="span" sx={pumpkinBodySx}>
        <HalloweenGlyphLayer viewBox={VIEW_BOX}>
          <path data-part="body" d={BODY} />
          <path data-part="rib" d={RIBS} fill="none" strokeWidth="0.9" strokeLinecap="round" />
          <path
            data-part="stem"
            d={STEM}
            fill="none"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </HalloweenGlyphLayer>
        {spec.lit ? (
          <HalloweenGlyphLayer viewBox={VIEW_BOX} sx={pumpkinFaceSx(spec, animated)}>
            <path data-part="face" d={FACE} />
          </HalloweenGlyphLayer>
        ) : null}
      </Box>
    </Box>
  );
}
