import { useMemo } from "react";
import { useTranslation, type CanopTranslate } from "../../i18n";
import {
  FILE_UPLOADER_LABEL_KEYS,
  FILE_UPLOADER_MESSAGE_PREFIX,
  UPLOAD_ERROR_FALLBACK_MESSAGE_KEY,
  defaultFileUploaderLabels,
  defaultUploadErrorFallback,
  type CanopFileUploaderLabels,
} from "./labels";

type CanopFileUploaderLabelKey = keyof CanopFileUploaderLabels;

function translatedOrDefault(t: CanopTranslate, messageKey: string, fallback: string): string {
  const translated = t(messageKey);
  return translated === messageKey ? fallback : translated;
}

function translatedLabel(t: CanopTranslate, key: CanopFileUploaderLabelKey): string {
  return translatedOrDefault(
    t,
    `${FILE_UPLOADER_MESSAGE_PREFIX}${key}`,
    defaultFileUploaderLabels[key],
  );
}

export function resolveFileUploaderLabels(
  t: CanopTranslate,
  overrides?: Partial<CanopFileUploaderLabels>,
): CanopFileUploaderLabels {
  const resolved = {} as CanopFileUploaderLabels;
  for (const key of FILE_UPLOADER_LABEL_KEYS) {
    resolved[key] = overrides?.[key] ?? translatedLabel(t, key);
  }
  return resolved;
}

export function useFileUploaderLabels(
  overrides?: Partial<CanopFileUploaderLabels>,
): CanopFileUploaderLabels {
  const { t } = useTranslation();
  return useMemo(() => resolveFileUploaderLabels(t, overrides), [t, overrides]);
}

export function resolveUploadErrorFallback(t: CanopTranslate, override?: string): string {
  return (
    override ??
    translatedOrDefault(t, UPLOAD_ERROR_FALLBACK_MESSAGE_KEY, defaultUploadErrorFallback)
  );
}

export function useUploadErrorFallback(override?: string): string {
  const { t } = useTranslation();
  return useMemo(() => resolveUploadErrorFallback(t, override), [t, override]);
}
