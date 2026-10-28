import Box from "@mui/material/Box";
import { bubbleSx, cauldronSx, fireSx, steamSx, type CauldronPuff } from "./cauldronSx";
import { HalloweenGlyphLayer } from "./HalloweenGlyphLayer";

const VIEW_BOX = "0 0 40 36";
const POT = "M4 14h32c0 10-5 18-16 18S4 24 4 14z";
const RIM = "M2 12.5a2 2 0 0 1 2-2h32a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2z";
const LEGS = "M9 29l-2 6h3l2-5zM31 29l2 6h-3l-2-5z";

interface SteamWisp extends CauldronPuff {
  id: string;
  d: string;
}

interface BrewBubble extends CauldronPuff {
  id: string;
  r: number;
}

const STEAM: readonly SteamWisp[] = [
  { id: "steam-left", d: "M15 7c-1.5-2 1.5-3 0-5", x: 15, y: 7, seconds: 4.3, delay: 0 },
  { id: "steam-right", d: "M25 7c1.5-2-1.5-3 0-5", x: 25, y: 7, seconds: 5.1, delay: -2 },
];

const BUBBLES: readonly BrewBubble[] = [
  { id: "bubble-1", x: 14, y: 10, r: 1.6, seconds: 2.3, delay: 0 },
  { id: "bubble-2", x: 21, y: 9, r: 2.2, seconds: 1.9, delay: -0.8 },
  { id: "bubble-3", x: 27, y: 10.5, r: 1.3, seconds: 2.7, delay: -1.6 },
];

interface HalloweenCauldronProps {
  animated: boolean;
}

export function HalloweenCauldron({ animated }: HalloweenCauldronProps) {
  return (
    <Box sx={cauldronSx()}>
      <HalloweenGlyphLayer viewBox={VIEW_BOX} sx={fireSx(animated)}>
        <ellipse data-part="fire" cx="20" cy="34" rx="14" ry="2.6" />
      </HalloweenGlyphLayer>
      {STEAM.map((wisp) => (
        <HalloweenGlyphLayer key={wisp.id} viewBox={VIEW_BOX} sx={steamSx(wisp, animated)}>
          <path data-part="steam" d={wisp.d} strokeWidth="1.2" />
        </HalloweenGlyphLayer>
      ))}
      <HalloweenGlyphLayer viewBox={VIEW_BOX}>
        <path data-part="pot" d={LEGS} />
        <path data-part="pot" d={POT} />
        <path data-part="pot" d={RIM} />
        <ellipse data-part="brew" cx="20" cy="11" rx="15" ry="2.2" />
      </HalloweenGlyphLayer>
      {BUBBLES.map((bubble) => (
        <HalloweenGlyphLayer key={bubble.id} viewBox={VIEW_BOX} sx={bubbleSx(bubble, animated)}>
          <circle data-part="bubble" cx={bubble.x} cy={bubble.y} r={bubble.r} />
        </HalloweenGlyphLayer>
      ))}
    </Box>
  );
}
