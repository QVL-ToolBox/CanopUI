import { SlidingIndicatorGroup } from "../../motion/SlidingIndicatorGroup";
import { squircleSurface } from "../../squircle";
import Stack from "@mui/material/Stack";
import { SegmentedControlOption } from "./SegmentedControlOption";
import {
  useSegmentedControl,
  type CanopSegmentedControlIconOption,
  type CanopSegmentedControlOption,
  type CanopSegmentedControlSize,
} from "./useSegmentedControl";

export type {
  CanopSegmentedControlIconOption,
  CanopSegmentedControlOption,
  CanopSegmentedControlSize,
};

const ICON_ONLY_PADDING = "0.1875rem";

const iconOnlyRadiusBySize: Record<CanopSegmentedControlSize, string> = {
  small: "1.1875rem",
  medium: "1.4375rem",
};

interface CanopSegmentedControlBaseProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: CanopSegmentedControlSize;
  fullWidth?: boolean;
}

interface CanopSegmentedControlLabeledProps<
  T extends string,
> extends CanopSegmentedControlBaseProps<T> {
  options: CanopSegmentedControlOption<T>[];
  iconOnly?: false;
}

interface CanopSegmentedControlIconOnlyProps<
  T extends string,
> extends CanopSegmentedControlBaseProps<T> {
  options: CanopSegmentedControlIconOption<T>[];
  /**
   * Segments carrés à icône seule, dans un conteneur en forme de pilule. Chaque option doit
   * porter une `icon` ; son `label` devient le nom accessible (`aria-label`) du segment.
   * L'icône passe en variante `solid` sur le segment sélectionné.
   */
  iconOnly: true;
}

export type CanopSegmentedControlProps<T extends string = string> =
  CanopSegmentedControlLabeledProps<T> | CanopSegmentedControlIconOnlyProps<T>;

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "medium",
  fullWidth = false,
  iconOnly = false,
}: CanopSegmentedControlProps<T>) {
  const segmentOptions: CanopSegmentedControlOption<T>[] = options;
  const { registerOption, handleKeyDown, isSelected, selectOption } = useSegmentedControl({
    options: segmentOptions,
    value,
    onChange,
  });

  return (
    <SlidingIndicatorGroup>
      <Stack
        role="radiogroup"
        aria-label={ariaLabel}
        direction="row"
        spacing={iconOnly ? 0 : 0.5}
        onKeyDown={handleKeyDown}
        sx={{
          padding: iconOnly ? ICON_ONLY_PADDING : 0.5,
          display: "inline-flex",
          width: fullWidth ? "100%" : "auto",

          ...squircleSurface({
            radius: iconOnly ? iconOnlyRadiusBySize[size] : "var(--canop-radius-lg)",
            shape: iconOnly ? "pill" : undefined,
            background: "var(--canop-palette-surface-sunken)",
          }),
        }}
      >
        {segmentOptions.map((option) => (
          <SegmentedControlOption
            key={option.value}
            option={option}
            size={size}
            fullWidth={fullWidth}
            iconOnly={iconOnly}
            selected={isSelected(option.value)}
            registerRef={registerOption(option.value)}
            onSelect={() => selectOption(option)}
          />
        ))}
      </Stack>
    </SlidingIndicatorGroup>
  );
}
