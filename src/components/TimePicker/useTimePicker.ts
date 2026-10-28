import { useCallback, useState, type KeyboardEvent, type RefObject } from "react";
import { useTranslation } from "../../i18n";
import { usePickerPopover } from "../_shared/usePickerPopover";
import { formatTime, parseTime } from "../Clock/clockTime";

export interface UseTimePickerParams {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export interface UseTimePickerResult {
  fieldRef: RefObject<HTMLDivElement | null>;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  draft: string;
  invalidMessage: string | null;
  openLabel: string;
  dialogLabel: string;
  open: () => void;
  close: () => void;
  handleDraftChange: (text: string) => void;
  handleCommit: () => void;
  handleFieldKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export function useTimePicker({
  value,
  onChange,
  disabled,
}: UseTimePickerParams): UseTimePickerResult {
  const { t } = useTranslation();
  const popover = usePickerPopover(disabled);
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const [invalid, setInvalid] = useState(false);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
    setInvalid(false);
  }

  const handleDraftChange = useCallback((text: string) => {
    setDraft(text);
    setInvalid(false);
  }, []);

  const handleCommit = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed === "") {
      if (value !== "") onChange("");
      return;
    }
    const parsed = parseTime(trimmed);
    if (!parsed) {
      setInvalid(true);
      return;
    }
    const formatted = formatTime(parsed);
    setDraft(formatted);
    if (formatted !== value) onChange(formatted);
  }, [draft, value, onChange]);

  const handleFieldKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter") {
        handleCommit();
        return;
      }
      if (event.key === "ArrowDown" && event.altKey) {
        event.preventDefault();
        popover.open();
      }
    },
    [handleCommit, popover],
  );

  return {
    ...popover,
    draft,
    invalidMessage: invalid ? t("canop.timePicker.invalid") : null,
    openLabel: t("canop.timePicker.open"),
    dialogLabel: t("canop.timePicker.dialog"),
    handleDraftChange,
    handleCommit,
    handleFieldKeyDown,
  };
}
