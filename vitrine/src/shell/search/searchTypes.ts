import type { CanopIconName } from "@canop/ui";

export interface SearchEntry {
  path: string;
  title: string;
  description: string;
  group: string;
  icon?: CanopIconName;
}

export interface TextRange {
  start: number;
  end: number;
}

export interface SearchResult {
  entry: SearchEntry;
  highlights: TextRange[];
}

export interface SearchResultGroup {
  label: string;
  startIndex: number;
  results: SearchResult[];
}

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}
