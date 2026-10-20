import Box from "@mui/material/Box";
import { treeAnchorSx, treeSx } from "./groundSx";
import type { HalloweenSide } from "./halloweenSceneTypes";

const TRUNK = "M50 140C52 120 44 104 48 88C51 76 46 66 50 56";
const BOUGHS =
  "M48 88C38 80 30 82 20 70C14 63 12 56 6 52M50 66C60 58 70 60 78 48C83 41 90 40 96 34";
const CROWN = "M50 56C48 44 54 36 50 22C48 15 52 10 56 4";
const TWIGS =
  "M20 70C18 62 22 58 18 50M30 80C28 90 22 92 16 96M78 48C76 40 80 34 78 28M64 60C66 70 74 72 80 78M50 22C42 18 38 12 34 8M12 56C8 60 4 60 1 64M90 40C92 46 96 48 99 50";

interface HalloweenTreeProps {
  side: HalloweenSide;
  animated: boolean;
}

export function HalloweenTree({ side, animated }: HalloweenTreeProps) {
  return (
    <Box sx={treeAnchorSx(side)}>
      <Box component="svg" viewBox="0 0 100 140" sx={treeSx(side, animated)}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d={TRUNK} strokeWidth="9" />
          <path d={BOUGHS} strokeWidth="5" />
          <path d={CROWN} strokeWidth="4" />
          <path d={TWIGS} strokeWidth="2" />
        </g>
      </Box>
    </Box>
  );
}
