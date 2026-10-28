export type CanopWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAYS_PER_WEEK = 7;
export const WEEKS_PER_GRID = 6;
export const WEEKDAYS: readonly CanopWeekday[] = [1, 2, 3, 4, 5, 6, 7];

const FIRST_MONDAY_OF_2024 = new Date(2024, 0, 1);

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return new Date(target.getFullYear(), target.getMonth(), day);
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function monthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

export function isoWeekday(date: Date): CanopWeekday {
  return WEEKDAYS[(date.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK];
}

export function startOfWeek(date: Date): Date {
  return addDays(date, 1 - isoWeekday(date));
}

export function monthGrid(month: Date): Date[] {
  const first = startOfWeek(startOfMonth(month));
  return Array.from({ length: DAYS_PER_WEEK * WEEKS_PER_GRID }, (_, index) =>
    addDays(first, index),
  );
}

export function chunkWeeks<T>(days: T[]): T[][] {
  return Array.from({ length: Math.ceil(days.length / DAYS_PER_WEEK) }, (_, week) =>
    days.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK),
  );
}

export function isBeforeDay(date: Date, limit: Date | undefined): boolean {
  return limit !== undefined && startOfDay(date) < startOfDay(limit);
}

export function isAfterDay(date: Date, limit: Date | undefined): boolean {
  return limit !== undefined && startOfDay(date) > startOfDay(limit);
}

export function clampDay(date: Date, min: Date | undefined, max: Date | undefined): Date {
  if (min && isBeforeDay(date, min)) return startOfDay(min);
  if (max && isAfterDay(date, max)) return startOfDay(max);
  return startOfDay(date);
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function weekdayReference(weekday: CanopWeekday): Date {
  return addDays(FIRST_MONDAY_OF_2024, weekday - 1);
}
