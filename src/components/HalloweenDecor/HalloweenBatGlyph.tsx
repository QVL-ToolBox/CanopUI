import Box from "@mui/material/Box";
import { batGlyphSx } from "./batSx";

const LEFT_WING =
  "M11 9.6c-1.7-.5-4.1-.1-6.2 1.3c-1.2.8-2.3 1.95-3 3.2c1.15-.5 2.4-.45 3.4.25c.6-1 1.8-1.45 2.85-.95c.3-.95 1.4-1.4 2.35-.9z";
const RIGHT_WING =
  "M13 9.6c1.7-.5 4.1-.1 6.2 1.3c1.2.8 2.3 1.95 3 3.2c-1.15-.5-2.4-.45-3.4.25c-.6-1-1.8-1.45-2.85-.95c-.3-.95-1.4-1.4-2.35-.9z";
const BODY =
  "M12 8.25c-.45-.75-1-1.15-1.5-1.25l.2 1.6c-.5.45-.75 1.2-.75 2.15c0 1.6.85 3.1 2.05 4.1c1.2-1 2.05-2.5 2.05-4.1c0-.95-.25-1.7-.75-2.15l.2-1.6c-.5.1-1.05.5-1.5 1.25z";

interface HalloweenBatGlyphProps {
  mirrored: boolean;
  flap: number;
  animated: boolean;
}

export function HalloweenBatGlyph({ mirrored, flap, animated }: HalloweenBatGlyphProps) {
  return (
    <Box component="svg" viewBox="0 0 24 24" sx={batGlyphSx(mirrored, flap, animated)}>
      <path data-part="wing-left" d={LEFT_WING} fill="currentColor" />
      <path data-part="wing-right" d={RIGHT_WING} fill="currentColor" />
      <path d={BODY} fill="currentColor" />
      <circle data-part="eye" cx="11.3" cy="10" r="0.35" />
      <circle data-part="eye" cx="12.7" cy="10" r="0.35" />
    </Box>
  );
}
