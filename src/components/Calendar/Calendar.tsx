import Box from "@mui/material/Box";
import { useId } from "react";
import { useReducedMotion } from "../../motion";
import { Stack } from "../Stack";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarMonthGrid } from "./CalendarMonthGrid";
import { useCalendar } from "./useCalendar";

export interface CanopCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  ariaLabel?: string;
  autoFocus?: boolean;
  animated?: boolean;
}

const CALENDAR_SX = { width: "100%", maxWidth: "21rem", minWidth: "16.5rem" } as const;

export function Calendar({
  value,
  onChange,
  min,
  max,
  isDateDisabled,
  ariaLabel,
  autoFocus = false,
  animated = true,
}: CanopCalendarProps) {
  const titleId = useId();
  const reduced = useReducedMotion();
  const calendar = useCalendar({ value, onChange, min, max, isDateDisabled, autoFocus });

  return (
    <Box sx={CALENDAR_SX}>
      <Stack gap="xs" role="group" ariaLabel={ariaLabel}>
        <CalendarHeader
          title={calendar.title}
          titleId={titleId}
          canGoPrevious={calendar.canGoPrevious}
          canGoNext={calendar.canGoNext}
          previousLabel={calendar.previousLabel}
          nextLabel={calendar.nextLabel}
          onPrevious={calendar.goPrevious}
          onNext={calendar.goNext}
        />
        <CalendarMonthGrid
          labelledBy={titleId}
          weekdays={calendar.weekdays}
          weeks={calendar.weeks}
          monthIndex={calendar.visibleMonthIndex}
          direction={calendar.direction}
          animate={animated && !reduced}
          gridRef={calendar.gridRef}
          onKeyDown={calendar.handleGridKeyDown}
          onSelect={calendar.selectDay}
        />
      </Stack>
    </Box>
  );
}
