import Box from "@mui/material/Box";
import type { MouseEventHandler } from "react";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";

export interface CanopAddButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  /** Largeur et hauteur du bouton, en unités CSS relatives (rem). */
  size?: string;
  /** Taille de l'icône affichée dans le bouton. */
  iconSize?: CanopIconSize;
  ariaLabel: string;
}

export function AddButton({
  onClick,
  disabled = false,
  size = "2.5rem",
  iconSize,
  ariaLabel,
}: CanopAddButtonProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <IconActionButton
        icon="plus"
        ariaLabel={ariaLabel}
        onClick={onClick}
        disabled={disabled}
        size={size}
        iconSize={iconSize}
      />
    </Box>
  );
}
