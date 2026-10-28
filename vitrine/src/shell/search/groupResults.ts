import type { SearchResult, SearchResultGroup } from "./searchTypes";

export function groupResults(results: SearchResult[]): SearchResultGroup[] {
  const buckets = new Map<string, SearchResult[]>();
  for (const result of results) {
    const bucket = buckets.get(result.entry.group);
    if (bucket) bucket.push(result);
    else buckets.set(result.entry.group, [result]);
  }

  let cursor = 0;
  return Array.from(buckets, ([label, members]) => {
    const group = { label, startIndex: cursor, results: members };
    cursor += members.length;
    return group;
  });
}
