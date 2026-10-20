import MuiButton from "@mui/material/Button";
import type { MouseEventHandler, ReactNode } from "react";
import { useButton } from "./useButton";

export type CanopButtonVariant =
  "primary" | "secondary" | "accent" | "danger" | "tonal" | "ghost" | "text";
export type CanopButtonSize = "small" | "medium" | "large";

export interface CanopButtonProps {
  variant?: CanopButtonVariant;
  size?: CanopButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  startIcon,
  endIcon,
  children,
}: CanopButtonProps) {
  const { muiVariant, muiColor, sx } = useButton(variant, size);
  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={size}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={sx}
    >
      {children}
    </MuiButton>
  );
}
