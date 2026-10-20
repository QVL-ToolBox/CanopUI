import MuiBadge from "@mui/material/Badge";
import type { ReactNode } from "react";
import { tokens } from "../../tokens";
import { squircleClip } from "../../squircle";
import { BadgePill } from "./BadgePill";
import {
  useBadge,
  type CanopBadgeColor,
  type CanopBadgePlacement,
  type CanopBadgeVariant,
} from "./useBadge";

export type { CanopBadgeColor, CanopBadgePlacement, CanopBadgeVariant };

export interface CanopBadgeProps {
  variant?: CanopBadgeVariant;
  count?: number;
  max?: number;
  showZero?: boolean;
  color?: CanopBadgeColor;
  placement?: CanopBadgePlacement;
  ariaLabel?: string;
  children?: ReactNode;
}

const badgeSlotSx = {
  fontFamily: tokens.typography.fontFamily,
  fontSize: tokens.typography.app.overline.fontSize,
  fontWeight: tokens.typography.app.label.fontWeight,
  ...squircleClip("0.625rem", { shape: "pill" }),
};

export function Badge({
  variant = "count",
  count = 0,
  max = 99,
  showZero = false,
  color = "error",
  placement = "top-right",
  ariaLabel,
  children,
}: CanopBadgeProps) {
  const { isDot, invisible, displayValue, anchorOrigin } = useBadge({
    variant,
    count,
    max,
    showZero,
    placement,
  });

  if (!children) {
    if (invisible) return null;
    return <BadgePill isDot={isDot} color={color} label={displayValue} ariaLabel={ariaLabel} />;
  }

  return (
    <MuiBadge
      variant={isDot ? "dot" : "standard"}
      badgeContent={isDot ? undefined : count}
      max={max}
      showZero={showZero}
      color={color}
      overlap="rectangular"
      anchorOrigin={anchorOrigin}
      slotProps={{
        badge: {
          "aria-label": ariaLabel,
          "aria-hidden": isDot && !ariaLabel ? true : undefined,
        },
      }}
      sx={{ "& .MuiBadge-badge": badgeSlotSx }}
    >
      {children}
    </MuiBadge>
  );
}
