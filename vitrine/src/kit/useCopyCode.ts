import { useCallback } from "react";
import { useCopyToClipboard, type CanopCopyOutcome, type CanopIconName } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { docKitTexts } from "./docKitTexts";

export interface UseCopyCodeResult {
  label: string;
  icon: CanopIconName;
  copyCode: () => void;
}

const outcomeIcon: Record<CanopCopyOutcome, CanopIconName> = {
  idle: "copy",
  copied: "check",
  failed: "cancel",
};

export function useCopyCode(code: string): UseCopyCodeResult {
  const t = docKitTexts[useDocLocale()];
  const { outcome, copy } = useCopyToClipboard(code.trim());
  const copyCode = useCallback(() => copy(), [copy]);
  const label: Record<CanopCopyOutcome, string> = {
    idle: t.copy,
    copied: t.copied,
    failed: t.copyFailed,
  };

  return { label: label[outcome], icon: outcomeIcon[outcome], copyCode };
}
