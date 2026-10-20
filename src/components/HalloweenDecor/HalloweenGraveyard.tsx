import Box from "@mui/material/Box";
import { graveyardSx } from "./groundSx";
import { HalloweenCat } from "./HalloweenCat";
import { HalloweenGraveGhost } from "./HalloweenGraveGhost";
import type { HalloweenGraveGhostSpec } from "./halloweenSceneTypes";

const ROUNDED_STONE = "M8 60V32a11 11 0 0 1 22 0v28z";
const CROSS = "M50 60V36h-7v-5h7v-9h5v9h7v5h-7v24z";
const TALL_STONE = "M74 60V26c0-8 6-13 13-13s13 5 13 13v34z";
const LEANING_STONE = "M112 60l2-20c.6-6 5-9 10-8.4s8.6 5 8 11l-2 17.4z";
const ENGRAVINGS = "M14 37h10M16 42h6M81 30h12M83 35h8M84 40h6M117 44l9 1M118 49l6 .6";

interface HalloweenGraveyardProps {
  ghost: HalloweenGraveGhostSpec;
  animated: boolean;
}

export function HalloweenGraveyard({ ghost, animated }: HalloweenGraveyardProps) {
  return (
    <Box sx={graveyardSx()}>
      <HalloweenGraveGhost spec={ghost} animated={animated} />
      <svg viewBox="0 0 140 60">
        <path data-part="stone" d={ROUNDED_STONE} />
        <path data-part="stone" d={CROSS} />
        <path data-part="stone" d={TALL_STONE} />
        <path data-part="stone" d={LEANING_STONE} />
        <path data-part="engraving" d={ENGRAVINGS} strokeWidth="1.2" />
      </svg>
      <HalloweenCat animated={animated} />
    </Box>
  );
}
