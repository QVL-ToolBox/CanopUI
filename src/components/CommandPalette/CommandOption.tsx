import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { squircleSurface } from "../../squircle";
import { tokens } from "../../tokens";
import { Icon, type CanopIconName } from "../Icon";
import { useScrollIntoViewWhenActive } from "./useScrollIntoViewWhenActive";

export interface CanopCommandOptionProps {
  id: string;
  label: ReactNode;
  icon?: CanopIconName;
  meta?: ReactNode;
  active: boolean;
  onHighlight: () => void;
  onSelect: () => void;
}

const ACTIVE_FILL = "var(--canop-palette-action-hover)";

const fillTransitionSx = {
  "&::before": {
    transition:
      "background-color var(--canop-motion-duration-instant) var(--canop-motion-ease-standard)",
  },
};

export function CommandOption({
  id,
  label,
  icon,
  meta,
  active,
  onHighlight,
  onSelect,
}: CanopCommandOptionProps) {
  const ref = useScrollIntoViewWhenActive<HTMLDivElement>(active);

  return (
    <Stack
      ref={ref}
      id={id}
      role="option"
      aria-selected={active}
      direction="row"
      spacing={1.5}
      onMouseMove={onHighlight}
      onClick={onSelect}
      sx={[
        {
          alignItems: "center",
          paddingX: tokens.spacing.md,
          paddingY: tokens.spacing.sm,
          cursor: "pointer",
          color: "text.primary",
          ...squircleSurface({
            radius: "var(--canop-radius-md)",
            background: active ? ACTIVE_FILL : "transparent",
          }),
        },
        fillTransitionSx,
      ]}
    >
      {icon ? <Icon name={icon} variant="outline" size="sm" color="inherit" /> : null}
      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {label}
      </Typography>
      {meta ? (
        <Typography variant="caption" noWrap sx={{ color: "text.secondary" }}>
          {meta}
        </Typography>
      ) : null}
    </Stack>
  );
}
