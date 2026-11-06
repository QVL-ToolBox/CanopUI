import { useCallback, useEffect, useRef, useState } from "react";

export interface UseTransientStateOptions {
  duration?: number;
  onSettle?: () => void;
}

export interface UseTransientStateResult<T> {
  value: T;
  show: (value: T, duration?: number) => void;
  clear: () => void;
}

const DEFAULT_DURATION = 1600;

export function useTransientState<T>(
  resting: T,
  options: UseTransientStateOptions = {},
): UseTransientStateResult<T> {
  const { duration = DEFAULT_DURATION, onSettle } = options;

  const [value, setValue] = useState<T>(resting);
  const timer = useRef<number | null>(null);
  const restingRef = useRef(resting);
  restingRef.current = resting;

  const onSettleReadAtDeadlineRef = useRef(onSettle);
  onSettleReadAtDeadlineRef.current = onSettle;

  const cancel = useCallback(() => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const show = useCallback(
    (next: T, override?: number) => {
      cancel();
      setValue(next);
      timer.current = window.setTimeout(() => {
        timer.current = null;
        setValue(restingRef.current);
        onSettleReadAtDeadlineRef.current?.();
      }, override ?? duration);
    },
    [cancel, duration],
  );

  const clear = useCallback(() => {
    cancel();
    setValue(restingRef.current);
  }, [cancel]);

  return { value, show, clear };
}
