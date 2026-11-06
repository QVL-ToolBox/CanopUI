import { IconActionButton, type CanopIconActionButtonVariant } from "../IconActionButton";
import type { CanopIconSize } from "../Icon";
import { useSoundToggle } from "./useSoundToggle";

export interface CanopSoundToggleProps {
  variant?: CanopIconActionButtonVariant;
  size?: string;
  iconSize?: CanopIconSize;
}

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
