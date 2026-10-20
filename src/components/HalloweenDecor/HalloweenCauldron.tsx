import Box from "@mui/material/Box";
import { cauldronSx } from "./cauldronSx";

const POT = "M4 14h32c0 10-5 18-16 18S4 24 4 14z";
const RIM = "M2 12.5a2 2 0 0 1 2-2h32a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2z";
const LEGS = "M9 29l-2 6h3l2-5zM31 29l2 6h-3l-2-5z";
const STEAM_LEFT = "M15 7c-1.5-2 1.5-3 0-5";
const STEAM_RIGHT = "M25 7c1.5-2-1.5-3 0-5";

interface HalloweenCauldronProps {
  animated: boolean;
}

export function HalloweenCauldron({ animated }: HalloweenCauldronProps) {
  return (
    <Box sx={cauldronSx(animated)}>
      <svg viewBox="0 0 40 36">
        <ellipse data-part="fire" cx="20" cy="34" rx="14" ry="2.6" />
        <g>
          <path data-part="steam" d={STEAM_LEFT} strokeWidth="1.2" />
          <path data-part="steam" d={STEAM_RIGHT} strokeWidth="1.2" />
        </g>
        <path data-part="pot" d={LEGS} />
        <path data-part="pot" d={POT} />
        <path data-part="pot" d={RIM} />
        <ellipse data-part="brew" cx="20" cy="11" rx="15" ry="2.2" />
        <g>
          <circle data-part="bubble" cx="14" cy="10" r="1.6" />
          <circle data-part="bubble" cx="21" cy="9" r="2.2" />
          <circle data-part="bubble" cx="27" cy="10.5" r="1.3" />
        </g>
      </svg>
    </Box>
  );
}
