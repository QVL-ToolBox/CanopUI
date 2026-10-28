import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Icon, type CanopIconName } from "../Icon";

export interface PickerFieldAdornmentProps {
  icon: CanopIconName;
  openLabel: string;
  expanded: boolean;
  disabled: boolean;
  onOpen: () => void;
  clearLabel?: string;
  onClear?: () => void;
}

export function PickerFieldAdornment({
  icon,
  openLabel,
  expanded,
  disabled,
  onOpen,
  clearLabel,
  onClear,
}: PickerFieldAdornmentProps) {
  return (
    <InputAdornment position="end">
      {onClear && clearLabel ? (
        <IconButton
          aria-label={clearLabel}
          onClick={(event) => {
            event.stopPropagation();
            onClear();
          }}
          disabled={disabled}
          size="small"
        >
          <Icon name="close" variant="outline" size="xs" color="inherit" />
        </IconButton>
      ) : null}
      <IconButton
        aria-label={openLabel}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        disabled={disabled}
        edge="end"
        size="small"
      >
        <Icon name={icon} variant="outline" size="sm" color="primary" />
      </IconButton>
    </InputAdornment>
  );
}
