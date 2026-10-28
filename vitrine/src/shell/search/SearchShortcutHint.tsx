import Box from "@mui/material/Box";
import { squircleSurface, tokens } from "@canop/ui";

export interface SearchShortcutHintProps {
  label: string;
}

export function SearchShortcutHint({ label }: SearchShortcutHintProps) {
  return (
    <Box
      component="kbd"
      aria-hidden
      sx={{
        display: { xs: "none", sm: "inline-flex" },
        alignItems: "center",
        flexShrink: 0,
        height: "1.5rem",
        paddingX: tokens.spacing.xs,
        marginRight: tokens.spacing["2xs"],
        ...squircleSurface({
          radius: "var(--canop-radius-sm)",
          background: "var(--canop-palette-surface-sunken)",
        }),
        color: "text.secondary",
        fontFamily: "inherit",
        fontSize: tokens.typography.app.caption.fontSize,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}
