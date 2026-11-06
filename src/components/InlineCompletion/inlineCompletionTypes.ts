import type { RefObject } from "react";

export type CanopCompletionResolver = (
  value: string,
  signal: AbortSignal,
) => string | undefined | PromiseLike<string | undefined>;

export type CanopCompletionSource = readonly string[] | CanopCompletionResolver;

export type CompletionNormalizer = (text: string) => string;

export interface CompletionMatch {
  suggestion: string;
  suffix: string;
}

export interface InlineCompletionGhost extends CompletionMatch {
  typed: string;
  keyHint: string;
  suffixRef: RefObject<HTMLSpanElement | null>;
  reportSuffixReach: (reachable: boolean) => void;
}
