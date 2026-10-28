import { useCallback, useState } from "react";
import { useReducedMotion } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { docKitTexts } from "./docKitTexts";

export interface UseDemoCardResult {
  showCode: boolean;
  toggleCode: () => void;
  toggleLabel: string;
  codeRevealTimeout: number | "auto";
}

export function useDemoCard(): UseDemoCardResult {
  const t = docKitTexts[useDocLocale()];
  const reducedMotion = useReducedMotion();
  const [showCode, setShowCode] = useState(false);
  const toggleCode = useCallback(() => setShowCode((value) => !value), []);

  return {
    showCode,
    toggleCode,
    toggleLabel: showCode ? t.hideCode : t.showCode,
    codeRevealTimeout: reducedMotion ? 0 : "auto",
  };
}
