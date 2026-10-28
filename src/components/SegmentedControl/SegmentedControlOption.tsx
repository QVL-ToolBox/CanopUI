import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { tokens } from "../../tokens";
import { hoverOrKeyboardFocus } from "../../interaction";
import { squircleClipPath } from "../../squircle";
import { SQUIRCLE_CLIP_VAR } from "../../squircle/squircleSx";
import { glowFilter, useNeonGlow } from "../../theme/neonGlow";
import { Icon } from "../Icon";
import { SlidingIndicator } from "../SlidingIndicator";
import type { CanopSegmentedControlOption, CanopSegmentedControlSize } from "./useSegmentedControl";

const SEGMENT_INDICATOR_HALO = glowFilter("primary", "rest");

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
  iconOnly: boolean;
  registerRef: (node: HTMLButtonElement | null) => void;
  onSelect: () => void;
}

export function SegmentedControlOption<T extends string>({
  option,
  selected,
  size,
  fullWidth,
  iconOnly,
  registerRef,
  onSelect,
}: SegmentedControlOptionProps<T>) {
  const glows = useNeonGlow();
  const padding = iconOnly ? { x: 0, y: 0 } : paddingBySize[size];
  const minHeight = minHeightBySize[size];
  const indicatorRadius = iconOnly ? "var(--canop-radius-pill)" : "var(--canop-radius-md)";

  return (
    <ButtonBase
      ref={registerRef}
      role="radio"
      aria-checked={selected}
      aria-label={iconOnly ? option.label : undefined}
      tabIndex={selected ? 0 : -1}
      disabled={option.disabled}
      onClick={onSelect}
      sx={{
        position: "relative",
        [SQUIRCLE_CLIP_VAR]: squircleClipPath(indicatorRadius),
        flex: fullWidth ? 1 : "0 0 auto",
        minHeight,
        minWidth: iconOnly ? minHeight : undefined,
        paddingX: padding.x,
        paddingY: padding.y,
        color: selected
          ? "var(--canop-palette-text-primary)"
          : "var(--canop-palette-text-secondary)",
        transition: "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
        [hoverOrKeyboardFocus(":not([aria-checked='true'])")]: {
          color: "var(--canop-palette-text-primary)",
        },
        "&.Mui-disabled": { opacity: 0.45 },
      }}
    >
      {selected ? (
        <SlidingIndicator
          radius={indicatorRadius}
          halo={glows ? SEGMENT_INDICATOR_HALO : undefined}
        />
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
          <Icon
            name={option.icon}
            variant={iconOnly && selected ? "solid" : "outline"}
            size="sm"
            color={selected ? "primary" : "inherit"}
          />
        ) : null}
        {iconOnly ? null : (
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
        )}
      </Stack>
    </ButtonBase>
  );
}
