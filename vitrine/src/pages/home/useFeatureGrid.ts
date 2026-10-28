import { useMemo } from "react";
import { useDocLocale } from "../../i18n/useDocLocale";
import { routeHref } from "../../router/routes";
import { HOME_FEATURES, type HomeFeatureLayout } from "./homeFeatures";
import { homeTexts, type HomeFeatureText, type HomeTexts } from "./homeTexts";

export interface HomeFeature extends HomeFeatureLayout, HomeFeatureText {
  href: string;
}

export interface UseFeatureGridResult {
  texts: HomeTexts["features"];
  demoTexts: HomeTexts["demos"];
  features: HomeFeature[];
}

export function useFeatureGrid(): UseFeatureGridResult {
  const { features: texts, demos: demoTexts } = homeTexts[useDocLocale()];

  const features = useMemo(
    () =>
      HOME_FEATURES.map((layout) => ({
        ...layout,
        ...texts.items[layout.id],
        href: routeHref(layout.path),
      })),
    [texts],
  );

  return { texts, demoTexts, features };
}
