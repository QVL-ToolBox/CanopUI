import type { AnimationOptions } from "framer-motion";
import { useContext, useLayoutEffect, useRef, type RefObject } from "react";
import { slideIndicatorFrom } from "./slideIndicatorFrom";
import {
  SlidingIndicatorGroupContext,
  enterSlidingIndicatorGroup,
  leaveSlidingIndicatorGroup,
} from "./slidingIndicatorRegistry";
import { useReducedMotion } from "./useReducedMotion";

export interface SlidingIndicatorRefs {
  frameRef: RefObject<HTMLSpanElement | null>;
  pillRef: RefObject<HTMLSpanElement | null>;
}

export function useSlidingIndicator(transition: AnimationOptions): SlidingIndicatorRefs {
  const group = useContext(SlidingIndicatorGroupContext);
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const anchor = frameRef.current?.parentElement;
    const pill = pillRef.current;
    if (!group || !anchor || !pill) return undefined;

    const entry = { anchor, pill };
    const source = enterSlidingIndicatorGroup(group, entry);
    if (source && !reducedMotion) slideIndicatorFrom(pill, source, anchor, transition);
    return () => leaveSlidingIndicatorGroup(group, entry);
  }, [group, reducedMotion, transition]);

  return { frameRef, pillRef };
}
