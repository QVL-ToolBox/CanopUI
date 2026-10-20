import type { MouseEventHandler } from "react";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";

export interface CanopEditButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  /** Largeur et hauteur du bouton, en unités CSS relatives (rem). */
  size?: string;
  /** Taille de l'icône affichée dans le bouton. */
  iconSize?: CanopIconSize;
  ariaLabel: string;
}

export function EditButton({
  onClick,
  disabled = false,
  size = "2.5rem",
  iconSize,
  ariaLabel,
}: CanopEditButtonProps) {
  return (
    <IconActionButton
      icon="pencil"
      variant="default"
      ariaLabel={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      size={size}
      iconSize={iconSize}
    />
  );
}
