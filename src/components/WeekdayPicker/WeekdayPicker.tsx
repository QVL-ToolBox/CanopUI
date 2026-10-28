import { FieldLabel } from "../_shared/FieldLabel";
import { useFieldLabelling } from "../_shared/useFieldLabelling";
import type { CanopWeekday } from "../Calendar/calendarDates";
import { Stack } from "../Stack";
import { WeekdayToggle } from "./WeekdayToggle";
import { useWeekdayPicker } from "./useWeekdayPicker";

export interface CanopWeekdayPickerProps {
  value: CanopWeekday[];
  onChange: (value: CanopWeekday[]) => void;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function WeekdayPicker({
  value,
  onChange,
  label,
  ariaLabel,
  disabled = false,
}: CanopWeekdayPickerProps) {
  const { labelId } = useFieldLabelling({ label, ariaLabel });
  const { options, groupLabel } = useWeekdayPicker({ value, onChange, ariaLabel, label });

  return (
    <Stack gap="xs">
      <FieldLabel id={labelId} label={label} />
      <Stack direction="row" wrap gap="xs" role="group" ariaLabel={groupLabel}>
        {options.map((option) => (
          <WeekdayToggle key={option.weekday} option={option} disabled={disabled} />
        ))}
      </Stack>
    </Stack>
  );
}
