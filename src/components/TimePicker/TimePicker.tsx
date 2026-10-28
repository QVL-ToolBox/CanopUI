import MuiTextField from "@mui/material/TextField";
import { PickerFieldAdornment } from "../_shared/PickerFieldAdornment";
import { PickerPopover } from "../_shared/PickerPopover";
import { Clock } from "../Clock";
import { useTimePicker } from "./useTimePicker";

export type CanopTimePickerSize = "small" | "medium";

export interface CanopTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  placeholder?: string;
  helperText?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: CanopTimePickerSize;
  name?: string;
}

const TIME_FIELD_SX = { "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" } } as const;

export function TimePicker({
  label,
  value,
  onChange,
  minuteStep,
  placeholder = "HH:MM",
  helperText,
  error,
  required = false,
  disabled = false,
  fullWidth = true,
  size = "medium",
  name,
}: CanopTimePickerProps) {
  const picker = useTimePicker({ value, onChange, disabled });
  const shownError = error ?? picker.invalidMessage;

  return (
    <>
      <MuiTextField
        ref={picker.fieldRef}
        label={label}
        value={picker.draft}
        onChange={(event) => picker.handleDraftChange(event.target.value)}
        onBlur={picker.handleCommit}
        name={name}
        placeholder={placeholder}
        helperText={shownError ?? helperText}
        error={Boolean(shownError)}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        autoComplete="off"
        sx={TIME_FIELD_SX}
        slotProps={{
          htmlInput: {
            inputMode: "numeric",
            maxLength: 5,
            onKeyDown: picker.handleFieldKeyDown,
          },
          input: {
            endAdornment: (
              <PickerFieldAdornment
                icon="clock"
                openLabel={picker.openLabel}
                expanded={picker.isOpen}
                disabled={disabled}
                onOpen={picker.open}
              />
            ),
          },
        }}
      />
      <PickerPopover
        anchorEl={picker.anchorEl}
        onClose={picker.close}
        ariaLabel={picker.dialogLabel}
      >
        <Clock
          value={value}
          onChange={onChange}
          minuteStep={minuteStep}
          onComplete={picker.close}
          ariaLabel={label}
          autoFocus
        />
      </PickerPopover>
    </>
  );
}
