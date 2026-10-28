import { useMemo } from "react";
import { useTranslation } from "../../i18n";
import { intlLocale } from "../_shared/intlLocale";
import type { CanopWeekday } from "../Calendar/calendarDates";
import { weekdayLabels } from "../Calendar/calendarLabels";

export interface UseWeekdayPickerParams {
  value: readonly CanopWeekday[];
  onChange: (value: CanopWeekday[]) => void;
  ariaLabel?: string;
  label?: string;
}

export interface CanopWeekdayOption {
  weekday: CanopWeekday;
  short: string;
  long: string;
  selected: boolean;
  toggle: () => void;
}

export interface UseWeekdayPickerResult {
  options: CanopWeekdayOption[];
  groupLabel: string;
}

function toggled(value: readonly CanopWeekday[], weekday: CanopWeekday): CanopWeekday[] {
  const next = value.includes(weekday)
    ? value.filter((day) => day !== weekday)
    : [...value, weekday];
  return next.sort((left, right) => left - right);
}

export function useWeekdayPicker({
  value,
  onChange,
  ariaLabel,
  label,
}: UseWeekdayPickerParams): UseWeekdayPickerResult {
  const { t, locale } = useTranslation();
  const labels = useMemo(() => weekdayLabels(intlLocale(locale)), [locale]);

  return {
    options: labels.map((day) => ({
      weekday: day.weekday,
      short: day.short.replace(/\.$/, ""),
      long: day.long,
      selected: value.includes(day.weekday),
      toggle: () => onChange(toggled(value, day.weekday)),
    })),
    groupLabel: ariaLabel ?? label ?? t("canop.weekdayPicker.label"),
  };
}
