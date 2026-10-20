import Box from "@mui/material/Box";
import { tokens } from "../../tokens";
import { squircleClip } from "../../squircle";
import type { CanopBadgeColor } from "./useBadge";

interface BadgePillProps {
  isDot: boolean;
  color: CanopBadgeColor;
  label: string;
  ariaLabel?: string;
}

export function BadgePill({ isDot, color, label, ariaLabel }: BadgePillProps) {
  const background = `var(--canop-palette-${color}-main)`;
  const foreground = `var(--canop-palette-${color}-contrastText)`;

  if (isDot) {
    return (
      <Box
        component="span"
        role={ariaLabel ? "status" : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        sx={{
          display: "inline-block",
          width: "0.625rem",
          height: "0.625rem",
          ...squircleClip("50%", { shape: "circle" }),
          backgroundColor: background,
        }}
      />
    );
  }

  return (
    <Box
      component="span"
      role={ariaLabel ? "status" : undefined}
      aria-label={ariaLabel}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "1.25rem",
        height: "1.25rem",
        paddingX: 0.5,
        ...squircleClip("0.625rem", { shape: "pill" }),
        backgroundColor: background,
        color: foreground,
        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.app.overline.fontSize,
        fontWeight: tokens.typography.app.label.fontWeight,
        lineHeight: 1,
      }}
    >
      {label}
    </Box>
  );
}
