import { useCallback, type KeyboardEvent, type RefObject } from "react";
import { useTranslation } from "../../i18n";
import { intlLocale } from "../_shared/intlLocale";
import { usePickerPopover } from "../_shared/usePickerPopover";
import { shortDateLabel } from "../Calendar/calendarLabels";

export interface UseDatePickerParams {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled: boolean;
  clearable: boolean;
}

export interface UseDatePickerResult {
  fieldRef: RefObject<HTMLDivElement | null>;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  displayValue: string;
  showClear: boolean;
  openLabel: string;
  clearLabel: string;
  dialogLabel: string;
  open: () => void;
  close: () => void;
  handleSelect: (date: Date) => void;
  handleClear: () => void;
  handleFieldKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const OPENING_KEYS = new Set(["Enter", " ", "ArrowDown"]);
const CLEARING_KEYS = new Set(["Backspace", "Delete"]);

export function useDatePicker({
  value,
  onChange,
  disabled,
  clearable,
}: UseDatePickerParams): UseDatePickerResult {
  const { t, locale } = useTranslation();
  const popover = usePickerPopover(disabled);
  const { close } = popover;
  const canClear = clearable && value !== null && !disabled;

  const handleSelect = useCallback(
    (date: Date) => {
      onChange(date);
      close();
    },
    [onChange, close],
  );

  const handleClear = useCallback(() => onChange(null), [onChange]);

  const handleFieldKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (OPENING_KEYS.has(event.key)) {
        event.preventDefault();
        popover.open();
        return;
      }
      if (canClear && CLEARING_KEYS.has(event.key)) {
        event.preventDefault();
        handleClear();
      }
    },
    [popover, canClear, handleClear],
  );

  return {
    ...popover,
    displayValue: value ? shortDateLabel(value, intlLocale(locale)) : "",
    showClear: canClear,
    openLabel: t("canop.datePicker.open"),
    clearLabel: t("canop.datePicker.clear"),
    dialogLabel: t("canop.datePicker.dialog"),
    handleSelect,
    handleClear,
    handleFieldKeyDown,
  };
}
