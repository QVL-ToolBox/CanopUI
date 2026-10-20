import { useTranslation } from "@canop/ui";

export type DocLocale = "fr" | "en";

export interface LocalizedLabel {
  fr: string;
  en: string;
}

export function useDocLocale(): DocLocale {
  const { locale } = useTranslation();
  return locale === "en" ? "en" : "fr";
}
