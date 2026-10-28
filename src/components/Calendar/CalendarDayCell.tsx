import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { calendarDaySx, selectedDayBackdropSx, todayMarkerSx } from "./calendarDaySx";
import type { CanopCalendarDay } from "./useCalendar";

export interface CalendarDayCellProps {
  day: CanopCalendarDay;
  animate: boolean;
  onSelect: (day: CanopCalendarDay) => void;
}

const SELECTED_SPRING = { type: "spring", stiffness: 520, damping: 30, mass: 0.7 } as const;
const BACKDROP_LAYER: CSSProperties = { position: "absolute", inset: 0, zIndex: -1 };
const CELL_SX = { display: "flex", justifyContent: "center" } as const;

export function CalendarDayCell({ day, animate, onSelect }: CalendarDayCellProps) {
  return (
    <Box role="gridcell" aria-selected={day.selected} sx={CELL_SX}>
      <ButtonBase
        data-day={day.key}
        tabIndex={day.tabbable ? 0 : -1}
        aria-label={day.ariaLabel}
        aria-current={day.today ? "date" : undefined}
        aria-disabled={day.disabled || undefined}
        onClick={() => onSelect(day)}
        sx={calendarDaySx(day.selected, day.inMonth)}
      >
        {day.selected ? (
          <motion.span
            aria-hidden
            style={BACKDROP_LAYER}
            initial={animate ? { scale: 0.4, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={SELECTED_SPRING}
          >
            <Box component="span" sx={selectedDayBackdropSx} />
          </motion.span>
        ) : null}
        <span aria-hidden>{day.dayOfMonth}</span>
        {day.today ? <Box component="span" aria-hidden sx={todayMarkerSx(day.selected)} /> : null}
      </ButtonBase>
    </Box>
  );
}
