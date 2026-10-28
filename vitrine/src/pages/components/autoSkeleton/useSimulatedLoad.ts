import { useCallback, useEffect, useRef, useState } from "react";

export type SimulatedDuration = "100" | "600" | "1500" | "4000";

export interface SimulatedLoad {
  loading: boolean;
  duration: SimulatedDuration;
  setDuration: (duration: SimulatedDuration) => void;
  reload: () => void;
}

export function useSimulatedLoad(initialDuration: SimulatedDuration): SimulatedLoad {
  const [duration, setDuration] = useState(initialDuration);
  const [loading, setLoading] = useState(true);
  const timer = useRef<number | null>(null);

  const settleAfter = useCallback((durationMs: number) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setLoading(false);
    }, durationMs);
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    settleAfter(Number(duration));
  }, [duration, settleAfter]);

  useEffect(() => {
    settleAfter(Number(initialDuration));
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [initialDuration, settleAfter]);

  return { loading, duration, setDuration, reload };
}
