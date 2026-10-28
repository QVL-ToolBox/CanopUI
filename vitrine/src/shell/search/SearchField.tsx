import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import type { KeyboardEvent, MouseEvent, RefObject } from "react";
import { Icon, squircleSurface, tokens } from "@canop/ui";
import { SearchClearButton } from "./SearchClearButton";
import { SearchShortcutHint } from "./SearchShortcutHint";

const FIELD_HEIGHT = "2.75rem";
const FIELD_RADIUS = "1.375rem";
const KEY_SHORTCUTS = "Control+K Meta+K";

export interface SearchFieldProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  label: string;
  placeholder: string;
  clearLabel: string;
  shortcutLabel: string;
  listboxId: string;
  expanded: boolean;
  activeDescendant: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  keepFocus: (event: MouseEvent) => void;
}

export function SearchField({
  inputRef,
  value,
  label,
  placeholder,
  clearLabel,
  shortcutLabel,
  listboxId,
  expanded,
  activeDescendant,
  onChange,
  onClear,
  onFocus,
  onBlur,
  onKeyDown,
  keepFocus,
}: SearchFieldProps) {
  return (
    <Stack
      component="label"
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        height: FIELD_HEIGHT,
        paddingLeft: tokens.spacing.md,
        paddingRight: tokens.spacing.xs,
        cursor: "text",
        color: "text.secondary",
        ...squircleSurface({
          radius: FIELD_RADIUS,
          shape: "pill",
          background: "var(--canop-palette-surface-raised)",
          shadow: "var(--canop-drop-shadow-e2)",
          shadowTransition:
            "filter var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
        }),
        "&:hover": { filter: "var(--canop-drop-shadow-e3)" },
      }}
    >
      <Icon name="search" variant="outline" size="sm" color="inherit" />
      <InputBase
        inputRef={inputRef}
        value={value}
        placeholder={placeholder}
        fullWidth
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        inputProps={{
          role: "combobox",
          "aria-label": label,
          "aria-haspopup": "listbox",
          "aria-expanded": expanded,
          "aria-controls": expanded ? listboxId : undefined,
          "aria-activedescendant": activeDescendant,
          "aria-autocomplete": "list",
          "aria-keyshortcuts": KEY_SHORTCUTS,
          autoComplete: "off",
          spellCheck: false,
          inputMode: "search",
          enterKeyHint: "go",
        }}
        sx={{
          minWidth: 0,
          color: "text.primary",
          fontSize: tokens.typography.app["body-md"].fontSize,
          "& input::placeholder": { textOverflow: "ellipsis" },
        }}
      />
      {value ? (
        <SearchClearButton label={clearLabel} onMouseDown={keepFocus} onClear={onClear} />
      ) : (
        <SearchShortcutHint label={shortcutLabel} />
      )}
    </Stack>
  );
}
