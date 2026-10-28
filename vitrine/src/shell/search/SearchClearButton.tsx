import IconButton from "@mui/material/IconButton";
import type { MouseEvent } from "react";
import { Icon } from "@canop/ui";

export interface SearchClearButtonProps {
  label: string;
  onMouseDown: (event: MouseEvent) => void;
  onClear: () => void;
}

export function SearchClearButton({ label, onMouseDown, onClear }: SearchClearButtonProps) {
  return (
    <IconButton
      aria-label={label}
      size="small"
      onMouseDown={onMouseDown}
      onClick={onClear}
      sx={{ flexShrink: 0, color: "text.secondary" }}
    >
      <Icon name="close" variant="outline" size="xs" color="inherit" />
    </IconButton>
  );
}
