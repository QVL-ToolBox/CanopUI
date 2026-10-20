import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { tokens } from "../../tokens";
import { focusRingSx } from "../_shared/focusRing";
import { Icon } from "../Icon";
import { SlidingIndicator } from "../SlidingIndicator";
import type { CanopSegmentedControlOption, CanopSegmentedControlSize } from "./useSegmentedControl";

const SEGMENT_INDICATOR_LAYOUT_ID = "segment";

const paddingBySize: Record<CanopSegmentedControlSize, { x: number; y: number }> = {
  small: { x: 1.25, y: 0.5 },
  medium: { x: 1.75, y: 0.75 },
};

const minHeightBySize: Record<CanopSegmentedControlSize, string> = {
  small: "2rem",
  medium: "2.5rem",
};

interface SegmentedControlOptionProps<T extends string> {
  option: CanopSegmentedControlOption<T>;
  selected: boolean;
  size: CanopSegmentedControlSize;
  fullWidth: boolean;
  registerRef: (node: HTMLButtonElement | null) => void;
  onSelect: () => void;
}

export function SegmentedControlOption<T extends string>({
  option,
  selected,
  size,
  fullWidth,
  registerRef,
  onSelect,
}: SegmentedControlOptionProps<T>) {
  const padding = paddingBySize[size];

  return (
    <ButtonBase
      ref={registerRef}
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      disabled={option.disabled}
      onClick={onSelect}
      focusRipple
      sx={{
        position: "relative",
        flex: fullWidth ? 1 : "0 0 auto",
        minHeight: minHeightBySize[size],
        paddingX: padding.x,
        paddingY: padding.y,
        color: selected
          ? "var(--canop-palette-text-primary)"
          : "var(--canop-palette-text-secondary)",
        transition: "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
        "&:hover:not([aria-checked='true'])": { color: "var(--canop-palette-text-primary)" },
        "&:focus-visible": focusRingSx,
        "&.Mui-disabled": { opacity: 0.45 },
      }}
    >
      {selected ? (
        <SlidingIndicator layoutId={SEGMENT_INDICATOR_LAYOUT_ID} radius="var(--canop-radius-md)" />
      ) : null}
      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {option.icon ? (
          <Icon name={option.icon} size="sm" color={selected ? "primary" : "inherit"} />
        ) : null}
        <Typography
          component="span"
          sx={{
            fontFamily: tokens.typography.fontFamily,
            ...tokens.typography.app.label,
            whiteSpace: "nowrap",
          }}
        >
          {option.label}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}
