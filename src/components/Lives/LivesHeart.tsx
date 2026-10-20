import Box from "@mui/material/Box";
import { Icon, type CanopIconName, type CanopIconSize } from "../Icon";
import { CONTAINER_COLOR_TRANSITION_INHERITED_BY_ICON } from "../_shared/containerColorTransition";

interface LivesHeartProps {
  icon: CanopIconName;
  size: CanopIconSize;
  filled: boolean;
  fading: boolean;
  animated: boolean;
}

const FULL = "var(--canop-palette-error-main)";
const EMPTY = "var(--canop-palette-text-disabled)";

const BEAT = "canop-lives-beat";
const BEAT_DURATION = "0.42s";

const beatSx = {
  animation: `${BEAT} ${BEAT_DURATION} var(--canop-motion-ease-spring-soft)`,
  [`@keyframes ${BEAT}`]: {
    "30%": { transform: "scale(1.28)" },
    "60%": { transform: "scale(0.92)" },
  },
};

export function LivesHeart({ icon, size, filled, fading, animated }: LivesHeartProps) {
  const beating = animated && fading;

  return (
    <Box
      component="span"
      data-filled={filled ? "on" : "off"}
      data-beat={beating ? "on" : "off"}
      sx={{
        display: "inline-flex",
        color: filled ? FULL : EMPTY,
        ...(animated ? { transition: CONTAINER_COLOR_TRANSITION_INHERITED_BY_ICON } : {}),
        ...(beating ? beatSx : {}),
      }}
    >
      <Icon name={icon} variant={filled ? "solid" : "outline"} size={size} color="inherit" />
    </Box>
  );
}
