import Stack from "@mui/material/Stack";
import type { MouseEventHandler } from "react";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";

export interface CanopAddButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  size?: string;
  iconSize?: CanopIconSize;
  fullWidth?: boolean;
  ariaLabel: string;
}

export function AddButton({
  onClick,
  disabled = false,
  size = "2.5rem",
  iconSize,
  fullWidth = true,
  ariaLabel,
}: CanopAddButtonProps) {
  const button = (
    <IconActionButton
      icon="plus"
      ariaLabel={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      size={size}
      iconSize={iconSize}
    />
  );

  if (!fullWidth) return button;

  return (
    <Stack direction="row" sx={{ justifyContent: "center", width: "100%" }}>
      {button}
    </Stack>
  );
}
