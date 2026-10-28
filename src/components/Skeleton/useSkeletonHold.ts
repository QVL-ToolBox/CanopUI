import { useEffect, useState } from "react";
import { SKELETON_MIN_VISIBLE_MS, SKELETON_REVEAL_DELAY_MS } from "./skeletonTiming";

interface HoldState {
  loading: boolean;
  startedAt: number | null;
  holdMs: number;
}

function remainingHoldMs(startedAt: number): number {
  const elapsed = Date.now() - startedAt;
  if (elapsed < SKELETON_REVEAL_DELAY_MS) return 0;
  return Math.max(0, SKELETON_REVEAL_DELAY_MS + SKELETON_MIN_VISIBLE_MS - elapsed);
}

function initialHoldState(loading: boolean): HoldState {
  return { loading, startedAt: loading ? Date.now() : null, holdMs: 0 };
}

function nextHoldState(previous: HoldState, loading: boolean): HoldState {
  if (loading) return initialHoldState(true);
  const holdMs = previous.startedAt === null ? 0 : remainingHoldMs(previous.startedAt);
  return { loading: false, startedAt: null, holdMs };
}

export function useSkeletonHold(loading: boolean): boolean {
  const [state, setState] = useState(() => initialHoldState(loading));

  if (state.loading !== loading) {
    setState(nextHoldState(state, loading));
  }

  useEffect(() => {
    if (state.holdMs === 0) return;
    const release = window.setTimeout(
      () => setState((current) => ({ ...current, holdMs: 0 })),
      state.holdMs,
    );
    return () => window.clearTimeout(release);
  }, [state.holdMs]);

  return loading || state.holdMs > 0;
}
