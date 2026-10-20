import { LayoutGroup } from "framer-motion";
import { squircleSurface } from "../../squircle";
import Stack from "@mui/material/Stack";
import { SegmentedControlOption } from "./SegmentedControlOption";
import {
  useSegmentedControl,
  type CanopSegmentedControlOption,
  type CanopSegmentedControlSize,
} from "./useSegmentedControl";

export type { CanopSegmentedControlOption, CanopSegmentedControlSize };

export interface CanopSegmentedControlProps<T extends string = string> {
  options: CanopSegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: CanopSegmentedControlSize;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "medium",
  fullWidth = false,
}: CanopSegmentedControlProps<T>) {
  const { groupId, registerOption, handleKeyDown, isSelected, selectOption } = useSegmentedControl({
    options,
    value,
    onChange,
  });

  return (
    <LayoutGroup id={groupId}>
      <Stack
        role="radiogroup"
        aria-label={ariaLabel}
        direction="row"
        spacing={0.5}
        onKeyDown={handleKeyDown}
        sx={{
          padding: 0.5,
          display: "inline-flex",
          width: fullWidth ? "100%" : "auto",

          ...squircleSurface({
            radius: "var(--canop-radius-lg)",
            background: "var(--canop-palette-surface-sunken)",
          }),
        }}
      >
        {options.map((option) => (
          <SegmentedControlOption
            key={option.value}
            option={option}
            size={size}
            fullWidth={fullWidth}
            selected={isSelected(option.value)}
            registerRef={registerOption(option.value)}
            onSelect={() => selectOption(option)}
          />
        ))}
      </Stack>
    </LayoutGroup>
  );
}
