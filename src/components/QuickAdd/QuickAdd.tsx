import { useTranslation } from "../../i18n";
import { IconActionButton } from "../IconActionButton";
import { Input } from "../Input";
import { Stack } from "../Stack";
import { TOUCH_TARGET_MIN } from "../_shared/touchTarget";
import { useQuickAdd, type CanopQuickAddHandler } from "./useQuickAdd";

export type { CanopQuickAddHandler, CanopQuickAddOutcome } from "./useQuickAdd";

export interface CanopQuickAddProps {
  label: string;
  onAdd: CanopQuickAddHandler;
  placeholder?: string;
  submitLabel?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
}

export function QuickAdd({
  label,
  onAdd,
  placeholder,
  submitLabel,
  disabled = false,
  autoFocus = false,
  maxLength,
}: CanopQuickAddProps) {
  const { t } = useTranslation();
  const { draft, setDraft, canAdd, pending, inputRef, handleSubmit, keepFieldFocused } =
    useQuickAdd({ onAdd, disabled });

  return (
    <Stack as="form" direction="row" alignItems="center" gap="sm" onSubmit={handleSubmit}>
      <Stack fill>
        <Input
          label={label}
          value={draft}
          onChange={setDraft}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
          inputRef={inputRef}
          maxLength={maxLength}
        />
      </Stack>
      <IconActionButton
        icon="plus"
        type="submit"
        ariaLabel={submitLabel ?? t("canop.quickAdd.submit")}
        disabled={!canAdd}
        loading={pending}
        size={TOUCH_TARGET_MIN}
        onMouseDown={keepFieldFocused}
      />
    </Stack>
  );
}
