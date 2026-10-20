import { useEffect, useRef, useState } from "react";

export interface UseLivesResult {
  remaining: number;
  cells: boolean[];
  fading: number | null;
}

const BEAT_MS = 420;

export function useLives(value: number, max: number, beat: boolean): UseLivesResult {
  const remaining = Math.max(0, Math.min(value, max));
  const cells = Array.from({ length: Math.max(0, max) }, (_, index) => index < remaining);

  const [fading, setFading] = useState<number | null>(null);
  const previousRemainingToDetectActualLoss = useRef(remaining);

  useEffect(() => {
    const before = previousRemainingToDetectActualLoss.current;
    previousRemainingToDetectActualLoss.current = remaining;
    if (!beat || remaining >= before) {
      setFading(null);
      return;
    }
    setFading(remaining);
    const id = window.setTimeout(() => setFading(null), BEAT_MS);
    return () => window.clearTimeout(id);
  }, [remaining, beat]);

  return { remaining, cells, fading };
}
