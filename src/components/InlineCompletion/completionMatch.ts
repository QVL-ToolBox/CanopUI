import { graphemeEndsBeforeLast, withoutLastGrapheme } from "./graphemes";
import type { CompletionMatch, CompletionNormalizer } from "./inlineCompletionTypes";

export interface PreparedCandidate {
  suggestion: string;
  key: string;
}

export function prepareCandidate(
  candidate: string,
  normalize: CompletionNormalizer,
): PreparedCandidate {
  const suggestion = candidate.normalize("NFC");
  return { suggestion, key: normalize(suggestion) };
}

function suffixStart(
  suggestion: string,
  typed: string,
  target: string,
  normalize: CompletionNormalizer,
): number | undefined {
  const ends = graphemeEndsBeforeLast(suggestion);
  const isCut = (end: number) => normalize(suggestion.slice(0, end)) === target;
  const endsWithIgnoredCharacter = normalize(withoutLastGrapheme(typed)) === target;
  return endsWithIgnoredCharacter ? ends.reverse().find(isCut) : ends.find(isCut);
}

function completionOf(
  candidate: PreparedCandidate,
  typed: string,
  target: string,
  normalize: CompletionNormalizer,
): CompletionMatch | undefined {
  if (candidate.key === target || !candidate.key.startsWith(target)) return undefined;
  const start = suffixStart(candidate.suggestion, typed, target, normalize);
  if (start === undefined) return undefined;
  return { suggestion: candidate.suggestion, suffix: candidate.suggestion.slice(start) };
}

export function matchCompletion(
  typed: string,
  candidate: PreparedCandidate,
  normalize: CompletionNormalizer,
): CompletionMatch | undefined {
  const target = normalize(typed);
  if (target === "") return undefined;
  return completionOf(candidate, typed, target, normalize);
}

export function firstCompletionIn(
  candidates: readonly PreparedCandidate[],
  typed: string,
  normalize: CompletionNormalizer,
): CompletionMatch | undefined {
  const target = normalize(typed);
  if (target === "" || candidates.some((candidate) => candidate.key === target)) return undefined;
  for (const candidate of candidates) {
    const match = completionOf(candidate, typed, target, normalize);
    if (match) return match;
  }
  return undefined;
}
