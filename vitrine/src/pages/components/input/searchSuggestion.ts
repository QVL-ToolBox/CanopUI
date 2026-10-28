import { foldForSearch } from "@canop/ui";
import { SEARCH_QUERIES } from "./completionSamples";

const SIMULATED_LATENCY_MS = 120;

export function searchSuggestion(value: string, signal: AbortSignal): Promise<string | undefined> {
  return new Promise((resolve) => {
    const folded = foldForSearch(value);
    const timer = window.setTimeout(
      () => resolve(SEARCH_QUERIES.find((query) => foldForSearch(query).startsWith(folded))),
      SIMULATED_LATENCY_MS,
    );
    signal.addEventListener("abort", () => window.clearTimeout(timer));
  });
}
