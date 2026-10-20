import type { DocLocale } from "../i18n/useDocLocale";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function formatReleaseDate(date: string, locale: DocLocale): string {
  if (!ISO_DATE.test(date)) return date;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
