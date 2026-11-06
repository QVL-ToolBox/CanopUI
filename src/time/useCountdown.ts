import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownOptions {
  duration: number;
  running?: boolean;
  interval?: number;
  onEnd?: () => void;
}

export interface UseCountdownResult {
  remaining: number;
  seconds: number;
  elapsed: number;
  progress: number;
  ended: boolean;
  restart: () => void;
}

const DEFAULT_INTERVAL = 100;

export function useCountdown({
  duration,
  running = false,
  interval = DEFAULT_INTERVAL,
  onEnd,
}: UseCountdownOptions): UseCountdownResult {
  const [remaining, setRemaining] = useState(duration);
  const [epoch, setEpoch] = useState(0);

  const remainingRef = useRef(duration);
  const endedRef = useRef(false);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const apply = useCallback((value: number) => {
    remainingRef.current = value;
    setRemaining(value);
  }, []);

  useEffect(
    function resetDurationBeforeClockComputesDeadline() {
      endedRef.current = false;
      remainingRef.current = duration;
      setRemaining(duration);
    },
    [duration, epoch],
  );

  useEffect(() => {
    if (!running || remainingRef.current <= 0) return;

    const deadline = Date.now() + remainingRef.current;
    const id = window.setInterval(() => {
      const left = Math.max(0, deadline - Date.now());
      apply(left);
      if (left > 0) return;
      window.clearInterval(id);
      if (endedRef.current) return;
      endedRef.current = true;
      onEndRef.current?.();
    }, interval);

    return () => {
      window.clearInterval(id);
      const exactRemainingNotRoundedToLastTick = Math.max(0, deadline - Date.now());
      apply(exactRemainingNotRoundedToLastTick);
    };
  }, [running, duration, interval, epoch, apply]);

  const restart = useCallback(() => setEpoch((value) => value + 1), []);

  return {
    remaining,
    seconds: Math.ceil(remaining / 1000),
    elapsed: duration - remaining,
    progress: duration > 0 ? (duration - remaining) / duration : 1,
    ended: remaining <= 0,
    restart,
  };
}
