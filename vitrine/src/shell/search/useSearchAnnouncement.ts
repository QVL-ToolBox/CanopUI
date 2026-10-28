import { useDocLocale } from "../../i18n/useDocLocale";
import { shellTexts, type ShellTexts } from "../shellTexts";
import { useDebouncedValue } from "./useDebouncedValue";

const ANNOUNCE_DELAY_MS = 500;

function announcementFor(t: ShellTexts, term: string, resultCount: number): string {
  if (term === "") return "";
  return resultCount === 0 ? t.searchEmpty(term) : t.searchFound(resultCount);
}

export function useSearchAnnouncement(query: string, resultCount: number): string {
  const t = shellTexts[useDocLocale()];
  const message = announcementFor(t, query.trim(), resultCount);
  return useDebouncedValue(message, ANNOUNCE_DELAY_MS);
}
