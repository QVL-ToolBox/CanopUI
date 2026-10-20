import { IconActionButton, type CanopIconActionButtonVariant } from "../IconActionButton";
import type { CanopIconSize } from "../Icon";
import { useSoundToggle } from "./useSoundToggle";

export interface CanopSoundToggleProps {
  variant?: CanopIconActionButtonVariant;
  /** Largeur et hauteur du bouton, en unités CSS relatives (rem). */
  size?: string;
  iconSize?: CanopIconSize;
}

/**
 * Le bouton de coupure du son.
 *
 * Il ne garde aucun état : la coupure vit dans le provider, sinon deux boutons
 * posés sur deux écrans afficheraient des vérités différentes.
 */
export function SoundToggle({
  variant = "secondary",
  size = "2.5rem",
  iconSize = "md",
}: CanopSoundToggleProps) {
  const { icon, label, toggle } = useSoundToggle();

  return (
    <IconActionButton
      icon={icon}
      ariaLabel={label}
      onClick={toggle}
      variant={variant}
      size={size}
      iconSize={iconSize}
    />
  );
}
