import type { CanopSeason } from "./createCanopTheme";

const HALLOWEEN_FIRST_MONTH_DAY = 1015;
const HALLOWEEN_LAST_MONTH_DAY = 1101;

function localMonthDay(date: Date): number {
  return (date.getMonth() + 1) * 100 + date.getDate();
}

export function canopSeasonAt(date: Date): CanopSeason | null {
  const monthDay = localMonthDay(date);
  const isHalloween = monthDay >= HALLOWEEN_FIRST_MONTH_DAY && monthDay <= HALLOWEEN_LAST_MONTH_DAY;
  return isHalloween ? "halloween" : null;
}
