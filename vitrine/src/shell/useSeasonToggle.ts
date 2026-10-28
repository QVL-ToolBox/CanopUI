import { useDocLocale } from "../i18n/useDocLocale";
import { useSeasonChoice } from "../season/useSeasonChoice";
import { shellTexts } from "./shellTexts";

export interface UseSeasonToggleResult {
  active: boolean;
  label: string;
  toggle: () => void;
}

export function useSeasonToggle(): UseSeasonToggleResult {
  const t = shellTexts[useDocLocale()];
  const { halloweenShown, flipShownSeason } = useSeasonChoice();

  return {
    active: halloweenShown,
    label: halloweenShown ? t.seasonOff : t.seasonOn,
    toggle: flipShownSeason,
  };
}
