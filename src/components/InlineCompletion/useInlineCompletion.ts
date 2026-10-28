import { useCallback, useRef, type KeyboardEvent, type MouseEvent, type RefObject } from "react";
import { useTranslation } from "../../i18n";
import { completionKeyAction, completionUpToNextWord } from "./completionKeys";
import { isCaretAtEnd, isPointWithin } from "./fieldGeometry";
import type {
  CanopCompletionSource,
  CompletionMatch,
  CompletionNormalizer,
  InlineCompletionGhost,
} from "./inlineCompletionTypes";
import { useCompletionAnnouncement } from "./useCompletionAnnouncement";
import { useCompletionCandidate } from "./useCompletionCandidate";
import { useCompletionCommit } from "./useCompletionCommit";
import { useGhostVisibility, type GhostVisibilityHandlers } from "./useGhostVisibility";

export interface UseInlineCompletionOptions {
  value: string;
  onChange: (value: string) => void;
  onAccept?: (suggestion: string) => void;
  source: CanopCompletionSource | undefined;
  normalize?: CompletionNormalizer;
  disabled: boolean;
}

export interface InlineCompletionInputProps extends GhostVisibilityHandlers {
  ref: RefObject<HTMLInputElement | null>;
  "aria-autocomplete": "inline";
  onKeyDown: (event: KeyboardEvent<Element>) => void;
  onPointerDown: () => void;
  onClick: (event: MouseEvent<Element>) => void;
}

export interface UseInlineCompletionResult {
  ghost: InlineCompletionGhost | null;
  inputProps: InlineCompletionInputProps;
  announcement: string;
}

export function useInlineCompletion({
  value,
  onChange,
  onAccept,
  source,
  normalize,
  disabled,
}: UseInlineCompletionOptions): UseInlineCompletionResult {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const suffixReachableRef = useRef(true);
  const ghostShownAtPressRef = useRef(false);
  const match = useCompletionCandidate(value, source, normalize);
  const visibility = useGhostVisibility(value, source !== undefined && !disabled, inputRef);
  const shown = visibility.visible ? match : undefined;
  const commit = useCompletionCommit(value, onChange, inputRef, visibility.trackCaret);
  const announcement = useCompletionAnnouncement(shown?.suggestion);

  const reportSuffixReach = useCallback((reachable: boolean) => {
    suffixReachableRef.current = reachable;
  }, []);

  const acceptable = (): CompletionMatch | undefined =>
    shown && suffixReachableRef.current ? shown : undefined;

  const accept = (suggestion: string) => {
    commit(suggestion);
    onAccept?.(suggestion);
  };

  const acceptUpToNextWord = (offered: CompletionMatch) => {
    const completed = completionUpToNextWord(offered);
    if (completed === offered.suggestion) accept(completed);
    else commit(completed);
  };

  const handleKeyDown = (event: KeyboardEvent<Element>) => {
    const offered = acceptable();
    if (!offered || event.nativeEvent.isComposing || !isCaretAtEnd(inputRef.current)) return;
    const action = completionKeyAction(event);
    if (action === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    if (action === "dismiss") visibility.dismiss();
    else if (action === "acceptWord") acceptUpToNextWord(offered);
    else accept(offered.suggestion);
  };

  const handleClick = (event: MouseEvent<Element>) => {
    const offered = acceptable();
    if (!offered || !ghostShownAtPressRef.current) return;
    if (isPointWithin(suffixRef.current, event.clientX, event.clientY)) accept(offered.suggestion);
  };

  const ghost: InlineCompletionGhost | null = shown
    ? {
        ...shown,
        typed: value,
        keyHint: t("canop.inlineCompletion.keyHint"),
        suffixRef,
        reportSuffixReach,
      }
    : null;

  return {
    ghost,
    announcement,
    inputProps: {
      ref: inputRef,
      "aria-autocomplete": "inline",
      ...visibility.handlers,
      onKeyDown: handleKeyDown,
      onPointerDown: () => {
        ghostShownAtPressRef.current = acceptable() !== undefined;
      },
      onClick: handleClick,
    },
  };
}
