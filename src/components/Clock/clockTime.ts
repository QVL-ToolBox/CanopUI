export interface CanopTime {
  hours: number;
  minutes: number;
}

export type CanopClockMode = "hours" | "minutes";

export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const DEFAULT_MINUTE_STEP = 5;

const TIME_PATTERN = /^(\d{1,2})(?:\s*[:hH.]\s*(\d{1,2})?)?$/;
const COMPACT_PATTERN = /^(\d{1,2})(\d{2})$/;

function wrap(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}

function validTime(hours: number, minutes: number): CanopTime | null {
  if (hours >= HOURS_PER_DAY || minutes >= MINUTES_PER_HOUR) return null;
  return { hours, minutes };
}

export function parseTime(text: string): CanopTime | null {
  const trimmed = text.trim();
  const compact = COMPACT_PATTERN.exec(trimmed);
  if (compact) return validTime(Number(compact[1]), Number(compact[2]));
  const match = TIME_PATTERN.exec(trimmed);
  if (!match) return null;
  return validTime(Number(match[1]), Number(match[2] ?? 0));
}

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatTime(time: CanopTime): string {
  return `${twoDigits(time.hours)}:${twoDigits(time.minutes)}`;
}

export function formatUnit(value: number): string {
  return twoDigits(value);
}

export function normalizeStep(step: number): number {
  return Math.min(Math.max(Math.round(step), 1), 30);
}

export function snapMinutes(minutes: number, step: number): number {
  return wrap(Math.round(minutes / step) * step, MINUTES_PER_HOUR);
}

export function shiftTime(time: CanopTime, mode: CanopClockMode, amount: number): CanopTime {
  if (mode === "hours") return { ...time, hours: wrap(time.hours + amount, HOURS_PER_DAY) };
  return { ...time, minutes: wrap(time.minutes + amount, MINUTES_PER_HOUR) };
}

export function shortestTurn(from: number, to: number): number {
  return wrap(to - from + 180, 360) - 180;
}
