import InputBase from "@mui/material/InputBase";
import { squircleClip, squircleRingPath } from "../../squircle";
import { useInlineInput } from "./useInlineInput";

export interface CanopInlineInputProps {
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

export function InlineInput({
  value,
  onChange,
  onCommit,
  onCancel,
  placeholder,
  ariaLabel,
  autoFocus = true,
  maxLength,
  disabled = false,
}: CanopInlineInputProps) {
  const { handleKeyDown, handleClick } = useInlineInput({ onCommit, onCancel });

  return (
    <InputBase
      autoFocus={autoFocus}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      inputProps={{ "aria-label": ariaLabel, maxLength }}
      onChange={(event) => onChange(event.target.value)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={onCommit}
      sx={{
        ...squircleClip("var(--canop-radius-xs)"),
        position: "relative",
        flex: 1,
        minWidth: "8rem",
        paddingX: "var(--canop-spacing-xs)",
        paddingY: "var(--canop-spacing-3xs)",
        color: "text.primary",
        backgroundColor: "background.paper",
        "--canop-input-autofill": "var(--canop-palette-background-paper)",
        font: "inherit",
        "& .MuiInputBase-input": { padding: 0 },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          clipPath: squircleRingPath("var(--canop-radius-xs)", "0.0625rem"),
          backgroundColor: "var(--canop-palette-primary-main)",
        },
      }}
    />
  );
}
