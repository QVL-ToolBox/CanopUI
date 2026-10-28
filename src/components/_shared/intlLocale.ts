import type { CanopLocale } from "../../i18n";

const intlLocaleTag: Record<CanopLocale, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

export function intlLocale(locale: CanopLocale): string {
  return intlLocaleTag[locale];
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}
