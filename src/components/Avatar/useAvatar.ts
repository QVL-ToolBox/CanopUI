import { useMemo } from "react";
import { useTranslation } from "../../i18n";
import { paletteColorVar } from "../_shared/paletteColorVar";
import type { CanopIconSize } from "../Icon";
import { avatarInitials } from "./avatarInitials";
import { avatarTone, type CanopAvatarTone } from "./avatarTone";

export type CanopAvatarSize = "sm" | "md" | "lg";

interface AvatarDimensions {
  diameter: string;
  fontSize: string;
  iconSize: CanopIconSize;
}

const dimensionsBySize: Record<CanopAvatarSize, AvatarDimensions> = {
  sm: { diameter: "2rem", fontSize: "0.8125rem", iconSize: "sm" },
  md: { diameter: "2.5rem", fontSize: "1rem", iconSize: "md" },
  lg: { diameter: "3.5rem", fontSize: "1.375rem", iconSize: "lg" },
};

interface UseAvatarResult extends AvatarDimensions {
  label: string;
  initials: string;
  tone: CanopAvatarTone;
  background: string;
  foreground: string;
}

export function useAvatar(name: string, size: CanopAvatarSize): UseAvatarResult {
  const { t } = useTranslation();
  const anonymousLabel = t("canop.avatar.anonymous");

  return useMemo(() => {
    const tone = avatarTone(name);
    return {
      ...dimensionsBySize[size],
      label: name.trim() ? name : anonymousLabel,
      initials: avatarInitials(name),
      tone,
      background: paletteColorVar[tone],
      foreground: `var(--canop-palette-${tone}-contrastText)`,
    };
  }, [name, size, anonymousLabel]);
}
