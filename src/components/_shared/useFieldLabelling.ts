import { useId } from "react";

export interface UseFieldLabellingParams {
  label?: string;
  ariaLabel?: string;
}

export interface FieldLabelling {
  labelId: string;
  labelledBy: string | undefined;
  accessibleName: string | undefined;
}

export function useFieldLabelling({ label, ariaLabel }: UseFieldLabellingParams): FieldLabelling {
  const labelId = useId();

  return {
    labelId,
    labelledBy: !ariaLabel && label ? labelId : undefined,
    accessibleName: ariaLabel,
  };
}
