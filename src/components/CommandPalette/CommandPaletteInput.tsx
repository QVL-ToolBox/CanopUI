import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { type KeyboardEvent } from "react";
import { tokens } from "../../tokens";
import { Icon } from "../Icon";

export interface CommandPaletteInputProps {
  value: string;
  placeholder: string;
  ariaLabel: string;
  listboxId: string;
  expanded: boolean;
  activeDescendant: string | undefined;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function CommandPaletteInput({
  value,
  placeholder,
  ariaLabel,
  listboxId,
  expanded,
  activeDescendant,
  onChange,
  onKeyDown,
}: CommandPaletteInputProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.sm,
        px: tokens.spacing.md,
        py: tokens.spacing.sm,
        borderBottom: (theme) => `0.0625rem solid ${theme.palette.divider}`,
        color: "text.secondary",
      }}
    >
      <Icon name="search" variant="outline" size="sm" color="inherit" />
      <InputBase
        value={value}
        placeholder={placeholder}
        autoFocus
        fullWidth
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        inputProps={{
          role: "combobox",
          "aria-label": ariaLabel,
          "aria-haspopup": "listbox",
          "aria-expanded": expanded,
          "aria-controls": expanded ? listboxId : undefined,
          "aria-activedescendant": activeDescendant,
          "aria-autocomplete": "list",
        }}
        sx={{
          color: "text.primary",
          fontSize: tokens.typography.app["body-lg"].fontSize,
        }}
      />
    </Box>
  );
}
