import ButtonBase from "@mui/material/ButtonBase";
import type { SxProps, Theme } from "@mui/material/styles";
import { hoverOrKeyboardFocus, withoutFocusRing } from "../../interaction";
import { squircleClipPath } from "../../squircle";
import { SQUIRCLE_CLIP_VAR } from "../../squircle/squircleSx";
import { tokens } from "../../tokens";
import { Stack } from "../Stack";
import { Text } from "../Text";
import type { CanopClockMode } from "./clockTime";

export interface ClockHeaderProps {
  mode: CanopClockMode;
  hoursText: string;
  minutesText: string;
  hoursLabel: string;
  minutesLabel: string;
  onShowHours: () => void;
  onShowMinutes: () => void;
}

const SEGMENT_CLIP = squircleClipPath("var(--canop-radius-sm)");
const EASE = "var(--canop-motion-duration-base) var(--canop-motion-ease-organic)";

function segmentSx(active: boolean): SxProps<Theme> {
  return {
    ...withoutFocusRing,
    minWidth: "4.25rem",
    paddingBlock: "0.25rem",
    paddingInline: "0.75rem",
    clipPath: SEGMENT_CLIP,
    [SQUIRCLE_CLIP_VAR]: SEGMENT_CLIP,
    fontFamily: tokens.typography.fontFamilyHeading,
    fontSize: "2.5rem",
    lineHeight: 1.1,
    fontVariantNumeric: "tabular-nums",
    color: active ? "primary.main" : "text.secondary",
    backgroundColor: active ? "action.selected" : "transparent",
    transition: `color ${EASE}, background-color ${EASE}`,
    [hoverOrKeyboardFocus()]: { backgroundColor: "action.hover" },
  };
}

export function ClockHeader({
  mode,
  hoursText,
  minutesText,
  hoursLabel,
  minutesLabel,
  onShowHours,
  onShowMinutes,
}: ClockHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" gap="xs">
      <ButtonBase
        aria-pressed={mode === "hours"}
        aria-label={`${hoursLabel} ${hoursText}`}
        onClick={onShowHours}
        sx={segmentSx(mode === "hours")}
      >
        {hoursText}
      </ButtonBase>
      <Text variant="display" tone="muted" as="span">
        :
      </Text>
      <ButtonBase
        aria-pressed={mode === "minutes"}
        aria-label={`${minutesLabel} ${minutesText}`}
        onClick={onShowMinutes}
        sx={segmentSx(mode === "minutes")}
      >
        {minutesText}
      </ButtonBase>
    </Stack>
  );
}
