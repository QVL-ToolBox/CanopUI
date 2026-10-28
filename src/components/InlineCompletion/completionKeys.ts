import type { CompletionMatch } from "./inlineCompletionTypes";

export type CompletionKeyAction = "accept" | "acceptWord" | "dismiss";

interface CompletionKeyStroke {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

const NEXT_WORD = /^[^\p{L}\p{M}\p{N}]*[\p{L}\p{M}\p{N}]*/u;

const WHOLE_ACCEPT_KEYS: ReadonlySet<string> = new Set(["Tab", "Enter"]);

export function completionKeyAction(stroke: CompletionKeyStroke): CompletionKeyAction | undefined {
  if (stroke.key === "Escape") return "dismiss";
  if (stroke.shiftKey || stroke.metaKey) return undefined;
  const withWordModifier = stroke.ctrlKey || stroke.altKey;
  if (WHOLE_ACCEPT_KEYS.has(stroke.key)) return withWordModifier ? undefined : "accept";
  if (stroke.key !== "ArrowRight") return undefined;
  return withWordModifier ? "acceptWord" : "accept";
}

export function completionUpToNextWord({ suggestion, suffix }: CompletionMatch): string {
  const word = NEXT_WORD.exec(suffix)?.[0] ?? suffix;
  return suggestion.slice(0, suggestion.length - suffix.length + word.length);
}
