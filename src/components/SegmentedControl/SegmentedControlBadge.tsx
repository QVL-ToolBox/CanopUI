import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { Badge } from "../Badge";
import { BadgePill } from "../Badge/BadgePill";
import type { SegmentBadge } from "./useSegmentBadge";

const POP = "canop-segment-badge-pop";

const popSx: SxProps<Theme> = {
  display: "inline-flex",
  flexShrink: 0,
  whiteSpace: "nowrap",
  animation: `${POP} var(--canop-motion-duration-slow) var(--canop-motion-ease-spring-soft) both`,
  [`@keyframes ${POP}`]: {
    from: { opacity: 0, transform: "scale(0.6)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

export interface SegmentedControlBadgeProps {
  badge: SegmentBadge;
}

export function SegmentedControlBadge({ badge }: SegmentedControlBadgeProps) {
  return (
    <Box component="span" sx={popSx}>
      {typeof badge.content === "number" ? (
        <Badge count={badge.content} color={badge.color} />
      ) : (
        <BadgePill isDot={false} color={badge.color} label={badge.content} />
      )}
    </Box>
  );
}
