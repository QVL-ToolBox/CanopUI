import TextField from "@mui/material/TextField";
import { Input, Stack } from "@canop/ui";
import { useNotchFieldSet } from "./useNotchFieldSet";

export interface NotchFieldSetLabels {
  empty: string;
  filled: string;
  filledValue: string;
  longLabel: string;
  focused: string;
  error: string;
  errorValue: string;
  errorMessage: string;
}

export interface NotchFieldSetProps {
  labels: NotchFieldSetLabels;
}

export function NotchFieldSet({ labels }: NotchFieldSetProps) {
  const fields = useNotchFieldSet(labels.filledValue, labels.errorValue);

  return (
    <Stack gap="md">
      <Input label={labels.empty} value={fields.empty} onChange={fields.setEmpty} />
      <Input label={labels.filled} value={fields.filled} onChange={fields.setFilled} />
      <Input
        label={labels.longLabel}
        value={fields.longLabelled}
        onChange={fields.setLongLabelled}
      />
      <TextField label={labels.focused} focused fullWidth />
      <Input
        label={labels.error}
        value={fields.invalid}
        onChange={fields.setInvalid}
        error={labels.errorMessage}
      />
    </Stack>
  );
}
