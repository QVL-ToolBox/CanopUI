import type { CSSObject } from "@mui/material/styles";
import { squircleSurface } from "../../squircle";
import { tokens } from "../../tokens";

const CONFIRM_POP = "canop-copy-field-pop";
const CODE_TRACKING = "0.12em";

export function copyFieldSurfaceSx(): CSSObject {
  return {
    ...squircleSurface({
      radius: tokens.radius.md,
      background: "var(--canop-palette-surface-sunken)",
    }),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacing.sm,
    paddingTop: tokens.spacing.xs,
    paddingBottom: tokens.spacing.xs,
    paddingLeft: tokens.spacing.md,
    paddingRight: tokens.spacing.xs,
  };
}

export function copyFieldValueSx(): CSSObject {
  return {
    ...tokens.typography.app.code,
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: CODE_TRACKING,
    fontVariantNumeric: "tabular-nums slashed-zero",
    color: "var(--canop-palette-text-primary)",
    minWidth: 0,
    overflowWrap: "anywhere",
    userSelect: "all",
  };
}

export function copyFieldButtonSx(confirming: boolean): CSSObject {
  return {
    display: "flex",
    flexShrink: 0,
    ...(confirming
      ? {
          animation: `${CONFIRM_POP} var(--canop-motion-duration-slower) var(--canop-motion-ease-spring-soft)`,
        }
      : {}),
    [`@keyframes ${CONFIRM_POP}`]: {
      "0%": { transform: "scale(1)" },
      "35%": { transform: "scale(1.14)" },
      "100%": { transform: "scale(1)" },
    },
  };
}
