import { useCanopSound } from "../../sound";
import { useTranslation } from "../../i18n";
import type { CanopIconName } from "../Icon";

export interface UseSoundToggleResult {
  muted: boolean;
  label: string;
  icon: CanopIconName;
  toggle: () => void;
}

export function useSoundToggle(): UseSoundToggleResult {
  const { muted, toggleMuted } = useCanopSound();
  const { t } = useTranslation();

  return {
    muted,
    label: muted ? t("canop.sound.enable") : t("canop.sound.disable"),
    icon: muted ? "volumeOff" : "volumeUp",
    toggle: toggleMuted,
  };
}
