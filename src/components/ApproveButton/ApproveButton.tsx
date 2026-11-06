import type { MouseEventHandler } from "react";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";

export interface CanopApproveButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  size?: string;
  iconSize?: CanopIconSize;
  ariaLabel: string;
}

export function ApproveButton({
  onClick,
  disabled = false,
  size = "2.5rem",
  iconSize,
  ariaLabel,
}: CanopApproveButtonProps) {
  return (
    <IconActionButton
      icon="check"
      variant="default"
      ariaLabel={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      size={size}
      iconSize={iconSize}
    />
  );
}
