import { foldForSearch } from "@canop/ui";
import type { TextRange } from "./searchTypes";

const SEPARATOR = " ";

export interface FoldedText {
  folded: string;
  origins: TextRange[];
}

export function foldWithOrigins(text: string): FoldedText {
  let folded = "";
  const origins: TextRange[] = [];
  let offset = 0;

  for (const character of text) {
    const origin = { start: offset, end: offset + character.length };
    offset = origin.end;
    const piece = foldForSearch(character) || SEPARATOR;
    if (piece === SEPARATOR && (folded === "" || folded.endsWith(SEPARATOR))) continue;
    folded += piece;
    origins.push(...Array.from({ length: piece.length }, () => origin));
  }

  return { folded, origins };
}

export function originalRange({ origins }: FoldedText, start: number, end: number): TextRange {
  return { start: origins[start].start, end: origins[end - 1].end };
}
