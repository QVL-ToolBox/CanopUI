import Box from "@mui/material/Box";
import type { HalloweenStarSpec } from "./halloweenSceneTypes";
import { starSx } from "./skySx";

const GLINT =
  "M12 0C12.6 8 16 11.4 24 12C16 12.6 12.6 16 12 24C11.4 16 8 12.6 0 12C8 11.4 11.4 8 12 0z";

interface HalloweenStarProps {
  spec: HalloweenStarSpec;
  animated: boolean;
}

export function HalloweenStar({ spec, animated }: HalloweenStarProps) {
  return (
    <Box sx={starSx(spec, animated)}>
      {spec.glint ? (
        <svg viewBox="0 0 24 24">
          <path d={GLINT} fill="currentColor" />
        </svg>
      ) : null}
    </Box>
  );
}
