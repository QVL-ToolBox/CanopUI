import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { startsInsideClip } from "./fieldGeometry";
import type { InlineCompletionGhost } from "./inlineCompletionTypes";

const SCROLL_SOURCES = ["scroll", "input", "select", "keyup", "pointerup"] as const;

export interface UseGhostScrollSyncResult {
  inputRef: RefObject<HTMLInputElement | null>;
  clipRef: RefObject<HTMLSpanElement | null>;
  trackRef: RefObject<HTMLSpanElement | null>;
}

export function useGhostScrollSync(ghost: InlineCompletionGhost | null): UseGhostScrollSyncResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const clipRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef(ghost);
  const active = ghost !== null;

  useLayoutEffect(() => {
    ghostRef.current = ghost;
  });

  const sync = useCallback(() => {
    const input = inputRef.current;
    const clip = clipRef.current;
    const track = trackRef.current;
    const shownGhost = ghostRef.current;
    if (!input || !clip || !track || !shownGhost) return;
    track.style.transform = `translateX(${-input.scrollLeft}px)`;
    const reachable = startsInsideClip(shownGhost.suffixRef.current, clip);
    track.style.visibility = reachable ? "" : "hidden";
    shownGhost.reportSuffixReach(reachable);
  }, []);

  useLayoutEffect(sync);

  useEffect(() => {
    const input = inputRef.current;
    if (!active || !input) return;
    SCROLL_SOURCES.forEach((source) => input.addEventListener(source, sync));
    return () => SCROLL_SOURCES.forEach((source) => input.removeEventListener(source, sync));
  }, [active, sync]);

  return { inputRef, clipRef, trackRef };
}
