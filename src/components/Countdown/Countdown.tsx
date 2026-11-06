import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import type { CanopIconName } from "../Icon";
import { ProgressBar, type CanopProgressBarColor } from "../ProgressBar";
import { CountdownTime } from "./CountdownTime";
import { useCountdownDisplay, type CanopCountdownFormat } from "./useCountdownDisplay";

export type { CanopCountdownFormat } from "./useCountdownDisplay";

export interface CanopCountdownProps {
  duration: number;
  running?: boolean;
  onEnd?: () => void;
  urgentBelow?: number;
  format?: CanopCountdownFormat;
  color?: CanopProgressBarColor;
  showProgress?: boolean;
  icon?: CanopIconName;
  animated?: boolean;
  ariaLabel?: string;
}

const DEFAULT_URGENT_BELOW = 10;

const URGENT_COLOR: CanopProgressBarColor = "error";

const OFFSCREEN_SX = {
  position: "absolute",
  width: "0.0625rem",
  height: "0.0625rem",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
} as const;

export function Countdown({
  duration,
  running = true,
  onEnd,
  urgentBelow = DEFAULT_URGENT_BELOW,
  format = "auto",
  color = "primary",
  showProgress = true,
  icon = "timer",
  animated = true,
  ariaLabel,
}: CanopCountdownProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { seconds, text, percentage, urgent, beating } = useCountdownDisplay({
    duration,
    running,
    format,
    urgentBelow,
    beat: animated && !reduced,
    onEnd,
  });

  return (
    <Box
      role="timer"
      aria-label={ariaLabel ?? t("canop.countdown.label", { seconds })}
      sx={{ position: "relative", width: "100%" }}
    >
      <Box
        aria-hidden
        sx={{ display: "flex", flexDirection: "column", gap: "0.375rem", width: "100%" }}
      >
        <CountdownTime
          text={text}
          icon={icon}
          urgent={urgent}
          beating={beating}
          animated={animated}
        />
        {showProgress && (
          <ProgressBar
            value={percentage}
            color={urgent ? URGENT_COLOR : color}
            animated={animated}
          />
        )}
      </Box>
      <Box component="span" aria-live="polite" sx={OFFSCREEN_SX}>
        {urgent ? t("canop.countdown.urgent", { seconds: urgentBelow }) : ""}
      </Box>
    </Box>
  );
}
