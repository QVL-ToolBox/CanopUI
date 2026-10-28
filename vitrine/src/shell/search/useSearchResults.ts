import { useMemo } from "react";
import { useDocLocale } from "../../i18n/useDocLocale";
import { groupResults } from "./groupResults";
import { findResults, queryTerms } from "./searchIndex";
import { searchIndexFor } from "./searchIndexFor";
import type { SearchResult, SearchResultGroup } from "./searchTypes";

export interface UseSearchResultsResult {
  groups: SearchResultGroup[];
  results: SearchResult[];
}

export function useSearchResults(query: string): UseSearchResultsResult {
  const locale = useDocLocale();

  return useMemo(() => {
    const terms = queryTerms(query);
    const groups =
      terms.length === 0 ? [] : groupResults(findResults(searchIndexFor(locale), terms));
    return { groups, results: groups.flatMap((group) => group.results) };
  }, [locale, query]);
}
