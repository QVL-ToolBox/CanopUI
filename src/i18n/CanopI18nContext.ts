import { createContext, useContext } from "react";
import { canopBaseMessages, type CanopLocale, type CanopMessages } from "./messages";

export type CanopTranslateVars = Record<string, string | number>;

export type CanopTranslate = (key: string, vars?: CanopTranslateVars) => string;

export interface CanopI18nContextValue {
  locale: CanopLocale;
  locales: CanopLocale[];
  t: CanopTranslate;
  setLocale: (locale: CanopLocale) => void;
}

export function interpolate(template: string, vars?: CanopTranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

function pluralKey(messages: CanopMessages, key: string, locale: CanopLocale, count: number) {
  const category = new Intl.PluralRules(locale).select(count);
  if (`${key}.${category}` in messages) return `${key}.${category}`;
  if (`${key}.other` in messages) return `${key}.other`;
  return key;
}

function resolveKey(
  messages: CanopMessages,
  key: string,
  locale: CanopLocale,
  vars?: CanopTranslateVars,
): string {
  const count = vars?.count;
  if (typeof count !== "number") return key;
  return pluralKey(messages, key, locale, count);
}

export function createTranslate(
  messages: CanopMessages,
  locale: CanopLocale = "fr",
): CanopTranslate {
  return (key, vars) => {
    const resolved = resolveKey(messages, key, locale, vars);
    return interpolate(messages[resolved] ?? key, vars);
  };
}

export function apiErrorMessage(
  t: CanopTranslate,
  code: string | undefined,
  fallback: string,
): string {
  if (!code) return fallback;
  const key = `canop.error.${code}`;
  const translated = t(key);
  return translated === key ? fallback : translated;
}

export const CanopI18nContext = createContext<CanopI18nContextValue>({
  locale: "fr",
  locales: ["fr"],
  t: createTranslate(canopBaseMessages.fr),
  setLocale: () => {},
});

export function useTranslation(): CanopI18nContextValue {
  return useContext(CanopI18nContext);
}
