import ButtonBase from "@mui/material/ButtonBase";
import type { SxProps, Theme } from "@mui/material/styles";
import { hoverOrKeyboardFocus, withoutFocusRing } from "../../interaction";
import { squircleClipPath } from "../../squircle";
import { SQUIRCLE_CLIP_VAR } from "../../squircle/squircleSx";
import { tokens } from "../../tokens";
import type { CanopWeekdayOption } from "./useWeekdayPicker";

export interface WeekdayToggleProps {
  option: CanopWeekdayOption;
  disabled: boolean;
}

const PILL_CLIP = squircleClipPath("1.375rem", { shape: "pill" });
const EASE = "var(--canop-motion-duration-base) var(--canop-motion-ease-spring-soft)";

function toggleSx(selected: boolean): SxProps<Theme> {
  return {
    ...withoutFocusRing,
    minWidth: "2.75rem",
    height: "2.75rem",
    paddingInline: "0.75rem",
    clipPath: PILL_CLIP,
    [SQUIRCLE_CLIP_VAR]: PILL_CLIP,
    fontFamily: "inherit",
    fontSize: "0.875rem",
    fontWeight: tokens.typography.fontWeight.semibold,
    color: selected ? "primary.contrastText" : "text.primary",
    backgroundColor: selected ? "primary.main" : "surface.sunken",
    transition: `background-color ${EASE}, color ${EASE}, transform ${EASE}`,
    [hoverOrKeyboardFocus(":not(.Mui-disabled)")]: {
      backgroundColor: selected ? "primary.dark" : "action.hover",
    },
    "&:active": { transform: "scale(0.94)" },
    "&.Mui-disabled": { color: "text.disabled", backgroundColor: "action.disabledBackground" },
  };
}

export function WeekdayToggle({ option, disabled }: WeekdayToggleProps) {
  return (
    <ButtonBase
      aria-pressed={option.selected}
      aria-label={option.long}
      title={option.long}
      disabled={disabled}
      onClick={option.toggle}
      sx={toggleSx(option.selected)}
    >
      <span aria-hidden>{option.short}</span>
    </ButtonBase>
  );
}
