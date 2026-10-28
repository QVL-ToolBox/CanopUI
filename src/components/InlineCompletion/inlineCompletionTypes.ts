import type { RefObject } from "react";

/**
 * Renvoie la suggestion complète pour une saisie, ou `undefined`.
 *
 * Une exception ou une promesse rejetée valent « aucune suggestion ». Le
 * résolveur est relu à chaque frappe : en passer un autre prend effet à la
 * frappe suivante, sans relancer la saisie en cours.
 */
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
