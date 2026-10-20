import type { ReactNode } from "react";
import { Button, type CanopButtonVariant } from "../Button";
import { Feedback } from "../Feedback";
import { Stack, type CanopStackGap } from "../Stack";
import { useForm } from "./useForm";

export interface CanopFormProps {
  onSubmit: () => void | Promise<void>;
  submitLabel?: string;
  submitVariant?: CanopButtonVariant;
  loading?: boolean;
  submitDisabled?: boolean;
  error?: string | null;
  gap?: CanopStackGap;
  children: ReactNode;
}

export function Form({
  onSubmit,
  submitLabel,
  submitVariant = "primary",
  loading = false,
  submitDisabled = false,
  error = null,
  gap = "md",
  children,
}: CanopFormProps) {
  const { handleSubmit } = useForm({ onSubmit });
  return (
    <Stack as="form" gap={gap} onSubmit={handleSubmit}>
      {children}
      {error ? <Feedback severity="error">{error}</Feedback> : null}
      {submitLabel && (
        <Button
          type="submit"
          variant={submitVariant}
          loading={loading}
          disabled={submitDisabled}
          fullWidth
        >
          {submitLabel}
        </Button>
      )}
    </Stack>
  );
}
