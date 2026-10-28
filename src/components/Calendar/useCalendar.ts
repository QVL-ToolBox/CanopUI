import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "../../i18n";
import { intlLocale } from "../_shared/intlLocale";
import {
  addDays,
  addMonths,
  chunkWeeks,
  clampDay,
  dayKey,
  DAYS_PER_WEEK,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  isSameMonth,
  monthGrid,
  monthIndex,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "./calendarDates";
import {
  fullDateLabel,
  monthTitle,
  weekdayLabels,
  type CalendarWeekdayLabel,
} from "./calendarLabels";

export type CanopCalendarDirection = 1 | -1;

export interface UseCalendarParams {
  value: Date | null;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  autoFocus?: boolean;
}

export interface CanopCalendarDay {
  key: string;
  date: Date;
  dayOfMonth: number;
  ariaLabel: string;
  inMonth: boolean;
  selected: boolean;
  today: boolean;
  disabled: boolean;
  tabbable: boolean;
}

export interface UseCalendarResult {
  title: string;
  visibleMonthIndex: number;
  direction: CanopCalendarDirection;
  weekdays: CalendarWeekdayLabel[];
  weeks: CanopCalendarDay[][];
  canGoPrevious: boolean;
  canGoNext: boolean;
  previousLabel: string;
  nextLabel: string;
  goPrevious: () => void;
  goNext: () => void;
  selectDay: (day: CanopCalendarDay) => void;
  handleGridKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  gridRef: (node: HTMLElement | null) => void;
}

const MONTHS_PER_YEAR = 12;

function keyboardTarget(event: KeyboardEvent<HTMLElement>, focused: Date): Date | null {
  const months = event.shiftKey ? MONTHS_PER_YEAR : 1;
  switch (event.key) {
    case "ArrowLeft":
      return addDays(focused, -1);
    case "ArrowRight":
      return addDays(focused, 1);
    case "ArrowUp":
      return addDays(focused, -DAYS_PER_WEEK);
    case "ArrowDown":
      return addDays(focused, DAYS_PER_WEEK);
    case "Home":
      return startOfWeek(focused);
    case "End":
      return addDays(startOfWeek(focused), DAYS_PER_WEEK - 1);
    case "PageUp":
      return addMonths(focused, -months);
    case "PageDown":
      return addMonths(focused, months);
    default:
      return null;
  }
}

function initialDay(value: Date | null, min: Date | undefined, max: Date | undefined): Date {
  return clampDay(value ?? new Date(), min, max);
}

export function useCalendar({
  value,
  onChange,
  min,
  max,
  isDateDisabled,
  autoFocus = false,
}: UseCalendarParams): UseCalendarResult {
  const { t, locale } = useTranslation();
  const localeTag = intlLocale(locale);
  const [today] = useState(() => startOfDay(new Date()));
  const [focusedDay, setFocusedDay] = useState(() => initialDay(value, min, max));
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(focusedDay));
  const [direction, setDirection] = useState<CanopCalendarDirection>(1);
  const [syncedValue, setSyncedValue] = useState(value);
  const gridNode = useRef<HTMLElement | null>(null);
  const focusRequested = useRef(autoFocus);

  if (value?.getTime() !== syncedValue?.getTime()) {
    setSyncedValue(value);
    if (value) {
      setFocusedDay(startOfDay(value));
      setVisibleMonth(startOfMonth(value));
    }
  }

  const isDisabled = useCallback(
    (date: Date) =>
      isBeforeDay(date, min) || isAfterDay(date, max) || (isDateDisabled?.(date) ?? false),
    [min, max, isDateDisabled],
  );

  const showMonth = useCallback(
    (month: Date) => {
      const shift = monthIndex(month) - monthIndex(visibleMonth);
      if (shift === 0) return;
      setDirection(shift > 0 ? 1 : -1);
      setVisibleMonth(startOfMonth(month));
    },
    [visibleMonth],
  );

  const moveFocus = useCallback(
    (target: Date) => {
      const next = clampDay(target, min, max);
      setFocusedDay(next);
      showMonth(next);
      focusRequested.current = true;
    },
    [min, max, showMonth],
  );

  const goByMonths = useCallback(
    (amount: number) => {
      const month = addMonths(visibleMonth, amount);
      showMonth(month);
      setFocusedDay(clampDay(addMonths(focusedDay, amount), min, max));
    },
    [visibleMonth, focusedDay, min, max, showMonth],
  );

  const selectDay = useCallback(
    (day: CanopCalendarDay) => {
      if (day.disabled) return;
      setFocusedDay(day.date);
      if (!day.inMonth) showMonth(day.date);
      onChange(day.date);
    },
    [onChange, showMonth],
  );

  const handleGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const target = keyboardTarget(event, focusedDay);
      if (!target) return;
      event.preventDefault();
      moveFocus(target);
    },
    [focusedDay, moveFocus],
  );

  useEffect(() => {
    if (!focusRequested.current) return;
    const button = gridNode.current?.querySelector<HTMLElement>(
      `[data-month="${monthIndex(visibleMonth)}"] [data-day="${dayKey(focusedDay)}"]`,
    );
    if (!button) return;
    focusRequested.current = false;
    button.focus({ preventScroll: true });
  }, [focusedDay, visibleMonth]);

  const weeks = useMemo(() => {
    const days = monthGrid(visibleMonth);
    const focusInMonth = isSameMonth(focusedDay, visibleMonth);
    const fallbackKey = dayKey(
      days.find((date) => isSameMonth(date, visibleMonth) && !isDisabled(date)) ?? visibleMonth,
    );
    const tabbableKey = focusInMonth ? dayKey(focusedDay) : fallbackKey;
    const models = days.map<CanopCalendarDay>((date) => ({
      key: dayKey(date),
      date,
      dayOfMonth: date.getDate(),
      ariaLabel: fullDateLabel(date, localeTag),
      inMonth: isSameMonth(date, visibleMonth),
      selected: value !== null && isSameDay(date, value),
      today: isSameDay(date, today),
      disabled: isDisabled(date),
      tabbable: dayKey(date) === tabbableKey && isSameMonth(date, visibleMonth),
    }));
    return chunkWeeks(models);
  }, [visibleMonth, focusedDay, isDisabled, localeTag, value, today]);

  const gridRef = useCallback((node: HTMLElement | null) => {
    gridNode.current = node;
  }, []);

  return {
    title: monthTitle(visibleMonth, localeTag),
    visibleMonthIndex: monthIndex(visibleMonth),
    direction,
    weekdays: useMemo(() => weekdayLabels(localeTag), [localeTag]),
    weeks,
    canGoPrevious: !min || monthIndex(visibleMonth) > monthIndex(min),
    canGoNext: !max || monthIndex(visibleMonth) < monthIndex(max),
    previousLabel: t("canop.calendar.previousMonth"),
    nextLabel: t("canop.calendar.nextMonth"),
    goPrevious: () => goByMonths(-1),
    goNext: () => goByMonths(1),
    selectDay,
    handleGridKeyDown,
    gridRef,
  };
}
