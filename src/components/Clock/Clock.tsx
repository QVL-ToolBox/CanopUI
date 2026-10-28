import Box from "@mui/material/Box";
import { useReducedMotion } from "../../motion";
import { Stack } from "../Stack";
import { ClockDial } from "./ClockDial";
import { ClockHeader } from "./ClockHeader";
import { useClock } from "./useClock";

export interface CanopClockProps {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  onComplete?: () => void;
  ariaLabel?: string;
  autoFocus?: boolean;
  animated?: boolean;
}

const CLOCK_SX = { width: "100%", minWidth: "15rem", maxWidth: "18rem" } as const;

export function Clock({
  value,
  onChange,
  minuteStep,
  onComplete,
  ariaLabel,
  autoFocus = false,
  animated = true,
}: CanopClockProps) {
  const reduced = useReducedMotion();
  const clock = useClock({ value, onChange, minuteStep, onComplete, autoFocus });

  return (
    <Box sx={CLOCK_SX}>
      <Stack gap="md" role="group" ariaLabel={ariaLabel}>
        <ClockHeader
          mode={clock.mode}
          hoursText={clock.hoursText}
          minutesText={clock.minutesText}
          hoursLabel={clock.hoursLabel}
          minutesLabel={clock.minutesLabel}
          onShowHours={clock.showHours}
          onShowMinutes={clock.showMinutes}
        />
        <ClockDial
          mode={clock.mode}
          marks={clock.marks}
          selectedValue={clock.selectedValue}
          rotation={clock.rotation}
          handLength={clock.handLength}
          hasValue={clock.hasValue}
          animate={animated && !reduced}
          dialProps={clock.dialProps}
        />
      </Stack>
    </Box>
  );
}
