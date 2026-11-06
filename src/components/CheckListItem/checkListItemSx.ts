import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import { tokens } from "../../tokens";
import { TOUCH_TARGET_MIN } from "../_shared/touchTarget";

export type CanopCheckListItemCheckboxSize = "medium" | "large";

const STRIKE_THICKNESS = "0.09375rem";
const STRIKE_HEIGHT_RATIO = "55%";
const MUTED_OPACITY = 0.45;
const LARGE_CHECKBOX_TARGET = "3rem";
const LARGE_CHECKBOX_ICON = "2.25rem";
const CHECKBOX_PRESSED_SCALE = 0.86;
const BULLET_SIZE = "0.4375rem";
const STRUCK_BULLET_SCALE = 0.55;
const STRUCK_BULLET_OPACITY = 0.4;

const withoutMotion = { "@media (prefers-reduced-motion: reduce)": { transition: "none" } };

function settle(property: string): string {
  return `${property} var(--canop-motion-duration-slow) var(--canop-motion-ease-organic)`;
}

function spring(property: string): string {
  return `${property} var(--canop-motion-duration-fast) var(--canop-motion-ease-spring-soft)`;
}

export function checkListItemBodySx(muted: boolean): SystemStyleObject<Theme> {
  return {
    flex: "1 1 0%",
    minWidth: 0,
    minHeight: TOUCH_TARGET_MIN,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing["2xs"],
    opacity: muted ? MUTED_OPACITY : 1,
    transition: settle("opacity"),
  };
}

function largeCheckboxSx(disabled: boolean): SystemStyleObject<Theme> {
  return {
    "& .MuiCheckbox-root": {
      width: LARGE_CHECKBOX_TARGET,
      height: LARGE_CHECKBOX_TARGET,
      padding: 0,
    },
    "& .MuiSvgIcon-root": {
      fontSize: LARGE_CHECKBOX_ICON,
      transition: spring("transform"),
      ...withoutMotion,
    },
    ...(disabled
      ? {}
      : { "&:active .MuiSvgIcon-root": { transform: `scale(${CHECKBOX_PRESSED_SCALE})` } }),
  };
}

export function checkListItemToggleSx(
  disabled: boolean,
  fillsRow: boolean,
  size: CanopCheckListItemCheckboxSize,
  dimmed: boolean,
): SystemStyleObject<Theme> {
  return {
    flex: fillsRow ? "1 1 0%" : "0 0 auto",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing["3xs"],
    cursor: disabled ? "default" : "pointer",
    userSelect: "none",
    opacity: dimmed ? MUTED_OPACITY : 1,
    transition: settle("opacity"),
    ...(size === "large" ? largeCheckboxSx(disabled) : {}),
  };
}

export function checkListItemLabelSx(struck: boolean): SystemStyleObject<Theme> {
  return {
    ...tokens.typography.app["body-lg"],
    color: struck ? "text.secondary" : "text.primary",
    backgroundImage: "linear-gradient(currentColor, currentColor)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `0 ${STRIKE_HEIGHT_RATIO}`,
    backgroundSize: `${struck ? "100%" : "0%"} ${STRIKE_THICKNESS}`,
    transition: [settle("background-size"), settle("color")].join(", "),
    overflowWrap: "anywhere",
  };
}

export function checkListItemBulletSx(struck: boolean): SystemStyleObject<Theme> {
  return {
    flexShrink: 0,
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    marginX: tokens.spacing["2xs"],
    borderRadius: "50%",
    backgroundColor: "primary.main",
    transform: `scale(${struck ? STRUCK_BULLET_SCALE : 1})`,
    opacity: struck ? STRUCK_BULLET_OPACITY : 1,
    transition: [spring("transform"), settle("opacity")].join(", "),
    ...withoutMotion,
  };
}
