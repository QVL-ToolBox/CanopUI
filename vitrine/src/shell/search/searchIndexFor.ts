import type { DocLocale } from "../../i18n/useDocLocale";
import { buildSearchEntries } from "./searchEntries";
import { indexEntries, type IndexedEntry } from "./searchIndex";

const indexes = new Map<DocLocale, IndexedEntry[]>();

export function searchIndexFor(locale: DocLocale): IndexedEntry[] {
  const cached = indexes.get(locale);
  if (cached) return cached;
  const index = indexEntries(buildSearchEntries(locale));
  indexes.set(locale, index);
  return index;
}
