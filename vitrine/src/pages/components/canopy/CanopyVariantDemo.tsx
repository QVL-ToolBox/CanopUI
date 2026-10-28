import type { ReactNode } from "react";
import { SegmentedControl, Stack, type CanopSegmentedControlOption } from "@canop/ui";
import { useCanopyVariant } from "./useCanopyVariant";

export interface CanopyVariantDemoProps<T extends string> {
  options: CanopSegmentedControlOption<T>[];
  initial: T;
  ariaLabel: string;
  renderFrame: (value: T) => ReactNode;
}

export function CanopyVariantDemo<T extends string>({
  options,
  initial,
  ariaLabel,
  renderFrame,
}: CanopyVariantDemoProps<T>) {
  const { value, setValue } = useCanopyVariant(initial);

  return (
    <Stack gap="md">
      <SegmentedControl
        options={options}
        value={value}
        onChange={setValue}
        ariaLabel={ariaLabel}
        size="small"
      />
      {renderFrame(value)}
    </Stack>
  );
}
