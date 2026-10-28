import { foldForSearch } from "@canop/ui";
import { foldWithOrigins, originalRange, type FoldedText } from "./foldWithOrigins";
import type { SearchEntry, SearchResult, TextRange } from "./searchTypes";

export interface IndexedEntry {
  entry: SearchEntry;
  title: FoldedText;
  compactTitle: CompactText;
  description: string;
  compactDescription: string;
}

interface CompactText {
  text: string;
  positions: number[];
}

interface RankedEntry {
  indexed: IndexedEntry;
  rank: number;
}

const TITLE_PREFIX_RANK = 0;
const TITLE_RANK = 1;
const DESCRIPTION_RANK = 2;

export function indexEntries(entries: SearchEntry[]): IndexedEntry[] {
  return entries.map((entry) => {
    const title = foldWithOrigins(entry.title);
    const description = foldForSearch(entry.description);
    return {
      entry,
      title,
      compactTitle: compact(title.folded),
      description,
      compactDescription: compact(description).text,
    };
  });
}

function compact(folded: string): CompactText {
  const positions = [...folded].flatMap((character, index) => (character === " " ? [] : [index]));
  return { text: folded.replaceAll(" ", ""), positions };
}

export function queryTerms(query: string): string[] {
  return foldForSearch(query).split(" ").filter(Boolean);
}

function rankEntry(indexed: IndexedEntry, terms: string[]): number | undefined {
  const { title, compactTitle, description, compactDescription } = indexed;
  const inTitle = (term: string) => title.folded.includes(term) || compactTitle.text.includes(term);
  const inDescription = (term: string) =>
    description.includes(term) || compactDescription.includes(term);
  if (!terms.every((term) => inTitle(term) || inDescription(term))) return undefined;
  if (title.folded.startsWith(terms[0]) || compactTitle.text.startsWith(terms[0])) {
    return TITLE_PREFIX_RANK;
  }
  return terms.every(inTitle) ? TITLE_RANK : DESCRIPTION_RANK;
}

function occurrences(text: string, term: string): number[] {
  const starts: number[] = [];
  let from = text.indexOf(term);
  while (from !== -1) {
    starts.push(from);
    from = text.indexOf(term, from + term.length);
  }
  return starts;
}

function termRanges({ title, compactTitle }: IndexedEntry, term: string): TextRange[] {
  const direct = occurrences(title.folded, term);
  if (direct.length > 0) {
    return direct.map((start) => originalRange(title, start, start + term.length));
  }
  return occurrences(compactTitle.text, term).map((start) =>
    originalRange(
      title,
      compactTitle.positions[start],
      compactTitle.positions[start + term.length - 1] + 1,
    ),
  );
}

function mergeRanges(ranges: TextRange[]): TextRange[] {
  const sorted = [...ranges].sort((left, right) => left.start - right.start);
  return sorted.reduce<TextRange[]>((merged, range) => {
    const last = merged.at(-1);
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
      return merged;
    }
    return [...merged, { ...range }];
  }, []);
}

export function findResults(index: IndexedEntry[], terms: string[]): SearchResult[] {
  return index
    .flatMap<RankedEntry>((indexed) => {
      const rank = rankEntry(indexed, terms);
      return rank === undefined ? [] : [{ indexed, rank }];
    })
    .sort((left, right) => left.rank - right.rank)
    .map(({ indexed }) => ({
      entry: indexed.entry,
      highlights: mergeRanges(terms.flatMap((term) => termRanges(indexed, term))),
    }));
}
