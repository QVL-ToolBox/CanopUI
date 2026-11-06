import { useCallback } from "react";
import { useCopyToClipboard, type CanopCopyOutcome } from "../../clipboard";
import { useTranslation } from "../../i18n";
import type { CanopIconName } from "../Icon";

export interface UseCopyFieldParams {
  value: string;
  copyLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
}

export interface UseCopyFieldResult {
  copyText: string;
  failedText: string;
  announcement: string;
  icon: CanopIconName;
  confirming: boolean;
  failed: boolean;
  handleCopy: () => void;
}

const iconByOutcome: Record<CanopCopyOutcome, CanopIconName> = {
  idle: "copy",
  copied: "check",
  failed: "copy",
};

export function useCopyField({
  value,
  copyLabel,
  copiedLabel,
  failedLabel,
}: UseCopyFieldParams): UseCopyFieldResult {
  const { t } = useTranslation();
  const { outcome, copied, failed, copy } = useCopyToClipboard(value);

  const copyText = copyLabel ?? t("canop.copyField.copy");
  const failedText = failedLabel ?? t("canop.copyField.failed");
  const announcementByOutcome: Record<CanopCopyOutcome, string> = {
    idle: "",
    copied: copiedLabel ?? t("canop.copyField.copied"),
    failed: failedText,
  };

  const handleCopy = useCallback(() => copy(), [copy]);

  return {
    copyText,
    failedText,
    announcement: announcementByOutcome[outcome],
    icon: iconByOutcome[outcome],
    confirming: copied,
    failed,
    handleCopy,
  };
}
