import {
  formatUnit,
  MINUTES_PER_HOUR,
  snapMinutes,
  type CanopClockMode,
  type CanopTime,
} from "./clockTime";

export const DIAL_SIZE = 240;
export const DIAL_CENTER = DIAL_SIZE / 2;
export const OUTER_RADIUS = 94;
export const INNER_RADIUS = 62;
export const KNOB_RADIUS = 17;

const HOUR_POSITIONS = 12;
const DEGREES_PER_HOUR = 360 / HOUR_POSITIONS;
const DEGREES_PER_MINUTE = 360 / MINUTES_PER_HOUR;
const LABELLED_MINUTE_STEP = 5;
const RING_BOUNDARY = (OUTER_RADIUS + INNER_RADIUS) / 2;

export interface CanopClockMark {
  value: number;
  label: string;
  x: number;
  y: number;
  inner: boolean;
}

function pointAt(angle: number, radius: number): { x: number; y: number } {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: DIAL_CENTER + radius * Math.cos(radians),
    y: DIAL_CENTER + radius * Math.sin(radians),
  };
}

function isInnerHour(hours: number): boolean {
  return hours === 0 || hours > HOUR_POSITIONS;
}

export function hourMarks(): CanopClockMark[] {
  return Array.from({ length: HOUR_POSITIONS * 2 }, (_, hours) => {
    const inner = isInnerHour(hours);
    return {
      value: hours,
      label: inner ? formatUnit(hours) : String(hours),
      inner,
      ...pointAt((hours % HOUR_POSITIONS) * DEGREES_PER_HOUR, inner ? INNER_RADIUS : OUTER_RADIUS),
    };
  });
}

export function minuteMarks(): CanopClockMark[] {
  return Array.from({ length: MINUTES_PER_HOUR / LABELLED_MINUTE_STEP }, (_, index) => {
    const minutes = index * LABELLED_MINUTE_STEP;
    return {
      value: minutes,
      label: formatUnit(minutes),
      inner: false,
      ...pointAt(minutes * DEGREES_PER_MINUTE, OUTER_RADIUS),
    };
  });
}

export function handAngle(time: CanopTime, mode: CanopClockMode): number {
  if (mode === "hours") return (time.hours % HOUR_POSITIONS) * DEGREES_PER_HOUR;
  return time.minutes * DEGREES_PER_MINUTE;
}

export function handRadius(time: CanopTime, mode: CanopClockMode): number {
  return mode === "hours" && isInnerHour(time.hours) ? INNER_RADIUS : OUTER_RADIUS;
}

function hourFromPosition(position: number, inner: boolean): number {
  if (inner) return position === 0 ? 0 : position + HOUR_POSITIONS;
  return position === 0 ? HOUR_POSITIONS : position;
}

export function timeAtPoint(
  x: number,
  y: number,
  mode: CanopClockMode,
  time: CanopTime,
  minuteStep: number,
): CanopTime {
  const dx = x - DIAL_CENTER;
  const dy = y - DIAL_CENTER;
  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
  if (mode === "minutes") {
    return { ...time, minutes: snapMinutes(angle / DEGREES_PER_MINUTE, minuteStep) };
  }
  const position = Math.round(angle / DEGREES_PER_HOUR) % HOUR_POSITIONS;
  const inner = Math.hypot(dx, dy) < RING_BOUNDARY;
  return { ...time, hours: hourFromPosition(position, inner) };
}
