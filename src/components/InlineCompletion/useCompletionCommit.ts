import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

export function useCompletionCommit(
  value: string,
  onChange: (value: string) => void,
  inputRef: RefObject<HTMLInputElement | null>,
  onCaretPlaced: () => void,
): (completed: string) => void {
  const [pendingValue, setPendingValue] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (pendingValue === null) return;
    const input = inputRef.current;
    if (input && value === pendingValue) input.setSelectionRange(value.length, value.length);
    setPendingValue(null);
    onCaretPlaced();
  }, [pendingValue, value, inputRef, onCaretPlaced]);

  return useCallback(
    (completed: string) => {
      setPendingValue(completed);
      onChange(completed);
    },
    [onChange],
  );
}
