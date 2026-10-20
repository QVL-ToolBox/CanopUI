import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import { paletteGradient, sheenGradient } from "../_shared/paletteGradient";
import { squircleClip } from "../../squircle";
import { ProgressBarHeader } from "./ProgressBarHeader";
import { clampPercentage, type CanopProgressBarColor } from "./progressBarHelpers";

const FillBox = motion.create(Box);

const SWEEP = "canop-progress-sweep";
const SWEEP_DURATION = "1.8s";

const SHEEN_HALF_BAR_SIZE = "50% 100%";
const SHEEN_FROM_FULLY_OUTSIDE = "-100%";
const SHEEN_TO_FULLY_OUTSIDE = "200%";
const LIFT = 45;

interface ProgressBarSingleProps {
  value: number;
  label?: string;
  color: CanopProgressBarColor;
  showValue: boolean;
  animated: boolean;
  ariaLabel?: string;
}

export function ProgressBarSingle({
  value,
  label,
  color,
  showValue,
  animated,
  ariaLabel,
}: ProgressBarSingleProps) {
  const reducedMotion = useReducedMotion();
  const percentage = clampPercentage(value);
  const rounded = Math.round(percentage);
  const play = animated && !reducedMotion;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        width: "100%",
      }}
    >
      <ProgressBarHeader label={label} valueText={showValue ? `${rounded}%` : undefined} />
      <Box
        role="progressbar"
        aria-label={ariaLabel ?? label}
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        sx={{
          position: "relative",
          width: "100%",
          height: "0.5rem",
          ...squircleClip("0.25rem", { shape: "pill" }),
          backgroundColor: "var(--canop-palette-surface-sunken)",
          overflow: "hidden",
        }}
      >
        <FillBox
          data-sweep={play ? "on" : "off"}
          initial={play ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={
            play
              ? { duration: motionDurationSeconds.base, ease: motionEasing.organic }
              : { duration: 0 }
          }
          sx={{
            width: `${percentage}%`,
            height: "100%",
            transformOrigin: "left",
            backgroundImage: play
              ? `${sheenGradient()}, ${paletteGradient(color, { lift: LIFT })}`
              : paletteGradient(color, { lift: LIFT }),
            backgroundRepeat: "no-repeat",
            backgroundSize: play ? `${SHEEN_HALF_BAR_SIZE}, 100% 100%` : "100% 100%",

            ...squircleClip("0.25rem", { shape: "pill" }),
            ...(play
              ? {
                  animation: `${SWEEP} ${SWEEP_DURATION} linear infinite`,
                  [`@keyframes ${SWEEP}`]: {
                    from: { backgroundPositionX: `${SHEEN_FROM_FULLY_OUTSIDE}, 0%` },
                    to: { backgroundPositionX: `${SHEEN_TO_FULLY_OUTSIDE}, 0%` },
                  },
                }
              : null),
          }}
        />
      </Box>
    </Box>
  );
}
