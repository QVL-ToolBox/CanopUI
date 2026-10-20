import Box from "@mui/material/Box";
import { Icon, type CanopIconName } from "../Icon";
import { Text } from "../Text";
import { CONTAINER_COLOR_TRANSITION_INHERITED_BY_ICON } from "../_shared/containerColorTransition";

interface CountdownTimeProps {
  text: string;
  icon: CanopIconName;
  urgent: boolean;
  beating: boolean;
  animated: boolean;
}

const CALM = "var(--canop-palette-text-primary)";
const URGENT = "var(--canop-palette-error-main)";

const BEAT = "canop-countdown-beat";
const BEAT_DURATION = "1s";

const beatSx = {
  animation: `${BEAT} ${BEAT_DURATION} var(--canop-motion-ease-standard) infinite`,
  [`@keyframes ${BEAT}`]: {
    "0%": { transform: "scale(1)" },
    "12%": { transform: "scale(1.12)" },
    "24%": { transform: "scale(1)" },
    "34%": { transform: "scale(1.06)" },
    "46%": { transform: "scale(1)" },
    "100%": { transform: "scale(1)" },
  },
};

export function CountdownTime({ text, icon, urgent, beating, animated }: CountdownTimeProps) {
  return (
    <Box
      component="span"
      data-urgent={urgent ? "on" : "off"}
      data-beat={beating ? "on" : "off"}
      sx={{
        alignSelf: "start",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        color: urgent ? URGENT : CALM,
        ...(animated ? { transition: CONTAINER_COLOR_TRANSITION_INHERITED_BY_ICON } : {}),
        ...(beating ? beatSx : {}),
      }}
    >
      <Icon name={icon} variant={urgent ? "solid" : "outline"} size="md" color="inherit" />
      <Text variant="metric" tone="inherit">
        {text}
      </Text>
    </Box>
  );
}
