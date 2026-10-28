import MuiTextField from "@mui/material/TextField";
import { PickerFieldAdornment } from "../_shared/PickerFieldAdornment";
import { PickerPopover } from "../_shared/PickerPopover";
import { Calendar } from "../Calendar";
import { useDatePicker } from "./useDatePicker";

export type CanopDatePickerSize = "small" | "medium";

export interface CanopDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  placeholder?: string;
  helperText?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  size?: CanopDatePickerSize;
  name?: string;
}

const READ_ONLY_FIELD_SX = { "& .MuiInputBase-input": { cursor: "pointer" } } as const;

export function DatePicker({
  label,
  value,
  onChange,
  min,
  max,
  isDateDisabled,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  clearable = false,
  fullWidth = true,
  size = "medium",
  name,
}: CanopDatePickerProps) {
  const picker = useDatePicker({ value, onChange, disabled, clearable });

  return (
    <>
      <MuiTextField
        ref={picker.fieldRef}
        label={label}
        value={picker.displayValue}
        name={name}
        placeholder={placeholder}
        helperText={error ?? helperText}
        error={Boolean(error)}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        onClick={picker.open}
        sx={READ_ONLY_FIELD_SX}
        slotProps={{
          htmlInput: {
            readOnly: true,
            "aria-haspopup": "dialog",
            "aria-expanded": picker.isOpen,
            onKeyDown: picker.handleFieldKeyDown,
          },
          input: {
            endAdornment: (
              <PickerFieldAdornment
                icon="calendar"
                openLabel={picker.openLabel}
                expanded={picker.isOpen}
                disabled={disabled}
                onOpen={picker.open}
                clearLabel={picker.showClear ? picker.clearLabel : undefined}
                onClear={picker.showClear ? picker.handleClear : undefined}
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
        <Calendar
          value={value}
          onChange={picker.handleSelect}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          ariaLabel={label}
          autoFocus
        />
      </PickerPopover>
    </>
  );
}
