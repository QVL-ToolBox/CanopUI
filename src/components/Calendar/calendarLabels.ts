import { capitalizeFirst } from "../_shared/intlLocale";
import { WEEKDAYS, weekdayReference, type CanopWeekday } from "./calendarDates";

export interface CalendarWeekdayLabel {
  weekday: CanopWeekday;
  narrow: string;
  short: string;
  long: string;
}

export function monthTitle(month: Date, localeTag: string): string {
  return capitalizeFirst(
    new Intl.DateTimeFormat(localeTag, { month: "long", year: "numeric" }).format(month),
  );
}

export function weekdayLabels(localeTag: string): CalendarWeekdayLabel[] {
  const narrow = new Intl.DateTimeFormat(localeTag, { weekday: "narrow" });
  const short = new Intl.DateTimeFormat(localeTag, { weekday: "short" });
  const long = new Intl.DateTimeFormat(localeTag, { weekday: "long" });
  return WEEKDAYS.map((weekday) => {
    const reference = weekdayReference(weekday);
    return {
      weekday,
      narrow: narrow.format(reference).toLocaleUpperCase(),
      short: capitalizeFirst(short.format(reference)),
      long: capitalizeFirst(long.format(reference)),
    };
  });
}

export function fullDateLabel(date: Date, localeTag: string): string {
  return new Intl.DateTimeFormat(localeTag, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function shortDateLabel(date: Date, localeTag: string): string {
  return new Intl.DateTimeFormat(localeTag, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
