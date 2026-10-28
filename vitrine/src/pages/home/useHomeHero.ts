import { useCallback } from "react";
import { useDocLocale } from "../../i18n/useDocLocale";
import { navigateTo } from "../../router/routes";
import { homeTexts, type HomeTexts } from "./homeTexts";

const START_PATH = "/docs/installation";
const COMPONENTS_PATH = "/components";

export interface UseHomeHeroResult {
  texts: HomeTexts["hero"];
  start: () => void;
  explore: () => void;
}

export function useHomeHero(): UseHomeHeroResult {
  const texts = homeTexts[useDocLocale()].hero;
  const start = useCallback(() => navigateTo(START_PATH), []);
  const explore = useCallback(() => navigateTo(COMPONENTS_PATH), []);

  return { texts, start, explore };
}
