import { useCallback, useLayoutEffect, useMemo, useState, type RefObject } from "react";
import { isCaretAtEnd } from "./fieldGeometry";

export interface GhostVisibilityHandlers {
  onFocus: () => void;
  onBlur: () => void;
  onSelect: () => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
}

export interface UseGhostVisibilityResult {
  visible: boolean;
  dismiss: () => void;
  trackCaret: () => void;
  handlers: GhostVisibilityHandlers;
}

function hasFocus(input: HTMLInputElement | null): boolean {
  return input !== null && input === input.ownerDocument.activeElement;
}

export function useGhostVisibility(
  value: string,
  enabled: boolean,
  inputRef: RefObject<HTMLInputElement | null>,
): UseGhostVisibilityResult {
  const [focused, setFocused] = useState(false);
  const [composing, setComposing] = useState(false);
  const [caretAtEnd, setCaretAtEnd] = useState(true);
  const [dismissedValue, setDismissedValue] = useState<string | null>(null);

  const trackCaret = useCallback(() => setCaretAtEnd(isCaretAtEnd(inputRef.current)), [inputRef]);
  const dismiss = useCallback(() => setDismissedValue(value), [value]);

  useLayoutEffect(() => {
    if (!enabled) return;
    setFocused(hasFocus(inputRef.current));
    trackCaret();
  }, [enabled, inputRef, trackCaret]);

  const handlers = useMemo<GhostVisibilityHandlers>(
    () => ({
      onFocus: () => {
        setFocused(true);
        trackCaret();
      },
      onBlur: () => setFocused(false),
      onSelect: trackCaret,
      onCompositionStart: () => setComposing(true),
      onCompositionEnd: () => {
        setComposing(false);
        trackCaret();
      },
    }),
    [trackCaret],
  );

  const visible = enabled && focused && !composing && caretAtEnd && dismissedValue !== value;

  return { visible, dismiss, trackCaret, handlers };
}
