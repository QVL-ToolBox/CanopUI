import Box from "@mui/material/Box";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { KeyboardEvent } from "react";
import { tokens } from "../../tokens";
import { CalendarDayCell } from "./CalendarDayCell";
import type { CalendarWeekdayLabel } from "./calendarLabels";
import type { CanopCalendarDay, CanopCalendarDirection } from "./useCalendar";

export interface CalendarMonthGridProps {
  labelledBy: string;
  weekdays: CalendarWeekdayLabel[];
  weeks: CanopCalendarDay[][];
  monthIndex: number;
  direction: CanopCalendarDirection;
  animate: boolean;
  gridRef: (node: HTMLElement | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onSelect: (day: CanopCalendarDay) => void;
}

const SLIDE_SPRING = { type: "spring", stiffness: 380, damping: 36, mass: 0.8 } as const;
const STILL = { duration: 0 } as const;

const slide: Variants = {
  enter: (direction: CanopCalendarDirection) => ({ x: `${direction * 30}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: CanopCalendarDirection) => ({ x: `${direction * -30}%`, opacity: 0 }),
};

const ROW_SX = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  justifyItems: "center",
} as const;

const WEEKDAY_SX = {
  ...ROW_SX,
  paddingBlock: "0.25rem",
  color: "text.secondary",
  fontSize: "0.75rem",
  fontWeight: tokens.typography.fontWeight.semibold,
  letterSpacing: "0.04em",
} as const;

const ABBREVIATION_SX = { textDecoration: "none", cursor: "default" } as const;
const SLIDING_VIEWPORT_SX = { position: "relative", overflow: "hidden" } as const;

export function CalendarMonthGrid({
  labelledBy,
  weekdays,
  weeks,
  monthIndex,
  direction,
  animate,
  gridRef,
  onKeyDown,
  onSelect,
}: CalendarMonthGridProps) {
  return (
    <Box ref={gridRef} role="grid" aria-labelledby={labelledBy} onKeyDown={onKeyDown}>
      <Box role="row" sx={WEEKDAY_SX}>
        {weekdays.map((weekday) => (
          <Box key={weekday.weekday} role="columnheader" aria-label={weekday.long}>
            <Box component="abbr" title={weekday.long} sx={ABBREVIATION_SX}>
              {weekday.narrow}
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={SLIDING_VIEWPORT_SX}>
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={monthIndex}
            data-month={monthIndex}
            role="rowgroup"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={animate ? SLIDE_SPRING : STILL}
          >
            {weeks.map((week) => (
              <Box key={week[0].key} role="row" sx={ROW_SX}>
                {week.map((day) => (
                  <CalendarDayCell key={day.key} day={day} animate={animate} onSelect={onSelect} />
                ))}
              </Box>
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
