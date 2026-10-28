export const THERMOMETER_WIDTH = 40;
export const THERMOMETER_HEIGHT = 160;
export const TRACK_WIDTH = 14;
export const TRACK_X = (THERMOMETER_WIDTH - TRACK_WIDTH) / 2;
export const TRACK_TOP = 4;
export const BULB_CENTER_X = THERMOMETER_WIDTH / 2;
export const BULB_CENTER_Y = 140;
export const BULB_RADIUS = 17;
export const RESERVOIR_RADIUS = 13;
export const FILL_WIDTH = 8;
export const FILL_X = (THERMOMETER_WIDTH - FILL_WIDTH) / 2;
export const FILL_TOP = TRACK_TOP + (TRACK_WIDTH - FILL_WIDTH) / 2;
export const FILL_HEIGHT = BULB_CENTER_Y - FILL_TOP;
export const NECK_Y = BULB_CENTER_Y - RESERVOIR_RADIUS;
export const EMPTY_OFFSET = NECK_Y - FILL_TOP;

export function columnTop(ratio: number): number {
  return NECK_Y - ratio * EMPTY_OFFSET;
}

export function columnOffset(ratio: number): number {
  return columnTop(ratio) - FILL_TOP;
}

export function heightPercent(y: number): number {
  return (y / THERMOMETER_HEIGHT) * 100;
}
