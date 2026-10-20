import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";
import { tokens } from "../../tokens";
import { squircleSurface } from "../../squircle";
import { Icon } from "../Icon";
import type { CanopCommandItem } from "./commandPaletteTypes";

export interface CommandPaletteOptionProps {
  item: CanopCommandItem;
  id: string;
  active: boolean;
  onHighlight: () => void;
  onSelect: () => void;
}

export function CommandPaletteOption({
  item,
  id,
  active,
  onHighlight,
  onSelect,
}: CommandPaletteOptionProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

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
      sx={{
        alignItems: "center",
        px: tokens.spacing.md,
        py: tokens.spacing.sm,
        cursor: "pointer",

        ...squircleSurface({
          radius: "var(--canop-radius-md)",
          background: active ? "var(--canop-palette-action-hover)" : "transparent",
        }),

        color: "text.primary",

        transition: (theme) =>
          theme.transitions.create("background-color", {
            duration: theme.transitions.duration.shortest,
            easing: tokens.motion.easing.standard,
          }),
      }}
    >
      {item.icon ? <Icon name={item.icon} variant="outline" size="sm" color="inherit" /> : null}
      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {item.label}
      </Typography>
      {item.group ? (
        <Typography
          variant="caption"
          noWrap
          sx={{
            color: "text.secondary",
          }}
        >
          {item.group}
        </Typography>
      ) : null}
    </Stack>
  );
}
