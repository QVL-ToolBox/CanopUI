import { useDocLocale } from "../../i18n/useDocLocale";

const NARROW_SCREEN_CAP_VW = 13;
const REM_SIZE = /^(\d*\.?\d+)rem$/;

const reducedLabels = {
  fr: "réduite pour tenir dans l'écran",
  en: "reduced to fit the screen",
};

export interface TypeSpecimenSizing {
  sampleFontSize: string;
  reducedMedia: string | undefined;
  reducedLabel: string;
}

function remValue(fontSize: string): number | undefined {
  const match = REM_SIZE.exec(fontSize);
  return match ? Number(match[1]) : undefined;
}

export function useTypeSpecimenSizing(fontSize: string): TypeSpecimenSizing {
  const reducedLabel = reducedLabels[useDocLocale()];
  const rem = remValue(fontSize);

  if (rem === undefined) {
    return { sampleFontSize: fontSize, reducedMedia: undefined, reducedLabel };
  }

  const cappedBelowRem = (rem * 100) / NARROW_SCREEN_CAP_VW;
  return {
    sampleFontSize: `min(${fontSize}, ${NARROW_SCREEN_CAP_VW}vw)`,
    reducedMedia: `@media (max-width: ${cappedBelowRem.toFixed(3)}rem)`,
    reducedLabel,
  };
}
