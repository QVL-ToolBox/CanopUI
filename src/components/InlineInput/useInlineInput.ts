import { useCallback, type KeyboardEvent, type MouseEvent } from "react";

export interface UseInlineInputParams {
  onCommit: () => void;
  onCancel: () => void;
}

export interface UseInlineInputResult {
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleClick: (event: MouseEvent<HTMLInputElement>) => void;
}

export function useInlineInput({ onCommit, onCancel }: UseInlineInputParams): UseInlineInputResult {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        onCommit();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    },
    [onCommit, onCancel],
  );

  const handleClick = useCallback((event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  }, []);

  return { handleKeyDown, handleClick };
}
