import { useCallback, useMemo, useState, type ReactNode } from "react";
import { CanopI18nContext, createTranslate } from "./CanopI18nContext";
import { canopBaseMessages, type CanopLocale, type CanopLocaleMessages } from "./messages";

const DEFAULT_STORAGE_KEY = "canop-locale";

function toLocale(value: string | null | undefined, locales: CanopLocale[]): CanopLocale | null {
  return locales.find((locale) => locale === value) ?? null;
}

function readStored(storageKey: string | null, locales: CanopLocale[]): CanopLocale | null {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    return toLocale(window.localStorage?.getItem(storageKey), locales);
  } catch {
    return null;
  }
}

export interface CanopI18nProviderProps {
  locale?: CanopLocale;
  messages?: CanopLocaleMessages;
  storageKey?: string | null;
  children: ReactNode;
}

export function CanopI18nProvider({
  locale = "fr",
  messages,
  storageKey = DEFAULT_STORAGE_KEY,
  children,
}: CanopI18nProviderProps) {
  const locales = useMemo(() => {
    const keys = messages ? (Object.keys(messages) as CanopLocale[]) : [];
    return keys.length > 0 ? keys : [locale];
  }, [messages, locale]);

  const [current, setCurrent] = useState<CanopLocale>(
    () => readStored(storageKey, locales) ?? locale,
  );

  const setLocale = useCallback(
    (next: CanopLocale) => {
      setCurrent(next);
      if (storageKey && typeof window !== "undefined") {
        window.localStorage?.setItem(storageKey, next);
      }
    },
    [storageKey],
  );

  const value = useMemo(() => {
    const merged = { ...canopBaseMessages[current], ...(messages?.[current] ?? {}) };
    return { locale: current, locales, t: createTranslate(merged, current), setLocale };
  }, [current, locales, messages, setLocale]);

  return <CanopI18nContext.Provider value={value}>{children}</CanopI18nContext.Provider>;
}
