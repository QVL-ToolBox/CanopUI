const BAR_HEIGHT = "4rem";
const BAR_INSET = "1rem";
const WIDGET_GAP = "0.5rem";
const SAFE_AREA_BOTTOM = "env(safe-area-inset-bottom)";
const SAFE_AREA_LEFT = "env(safe-area-inset-left, 0rem)";
const SAFE_AREA_RIGHT = "env(safe-area-inset-right, 0rem)";

function aboveSafeArea(...lengths: string[]): string {
  return `calc(${[...lengths, SAFE_AREA_BOTTOM].join(" + ")})`;
}

export const NAVBAR_MOBILE_BAR_OFFSET = aboveSafeArea(BAR_INSET);

export const NAVBAR_MOBILE_BAR_LEFT = `calc(${BAR_INSET} + ${SAFE_AREA_LEFT})`;

export const NAVBAR_MOBILE_BAR_RIGHT = `calc(${BAR_INSET} + ${SAFE_AREA_RIGHT})`;

export const NAVBAR_MOBILE_BAR_PADDING_Y = "0.5rem";

export const NAVBAR_MOBILE_BAR_PADDING_X = "0.75rem";

export const NAVBAR_MOBILE_BAR_MAX_WIDTH = `calc(100vw - ${NAVBAR_MOBILE_BAR_LEFT} - ${NAVBAR_MOBILE_BAR_RIGHT})`;

export const NAVBAR_MOBILE_BAR_SPACE = aboveSafeArea(BAR_HEIGHT, BAR_INSET);

export const NAVBAR_MOBILE_WIDGET_OFFSET = aboveSafeArea(BAR_HEIGHT, BAR_INSET, WIDGET_GAP);

const SETTINGS_INSET = "0.75rem";

export const NAVBAR_MOBILE_SETTINGS_SIZE = "2.75rem";

export const NAVBAR_MOBILE_SETTINGS_TOP = SETTINGS_INSET;

export const NAVBAR_MOBILE_SETTINGS_RIGHT = SETTINGS_INSET;

export const NAVBAR_MOBILE_SETTINGS_FOOTPRINT = `calc(${SAFE_AREA_RIGHT} + ${NAVBAR_MOBILE_SETTINGS_SIZE} + 2 * ${SETTINGS_INSET})`;

export const NAVBAR_ACTIONS_GAP = "0.5rem";

export const NAVBAR_MOBILE_ACTIONS_TOP = `calc(${NAVBAR_MOBILE_SETTINGS_TOP} + ${NAVBAR_MOBILE_SETTINGS_SIZE} + ${NAVBAR_ACTIONS_GAP})`;

const UTILITY_INSET = "1rem";

export const NAVBAR_UTILITIES_WIDTH = "4.5rem";

export const NAVBAR_UTILITIES_TOP = `calc(env(safe-area-inset-top, 0rem) + ${UTILITY_INSET})`;

export const NAVBAR_UTILITIES_BOTTOM = `calc(env(safe-area-inset-bottom, 0rem) + ${UTILITY_INSET})`;

export const NAVBAR_UTILITIES_RIGHT = `calc(${SAFE_AREA_RIGHT} + ${UTILITY_INSET})`;

export const NAVBAR_UTILITIES_FOOTPRINT = `calc(${SAFE_AREA_RIGHT} + ${NAVBAR_UTILITIES_WIDTH} + 2 * ${UTILITY_INSET})`;
