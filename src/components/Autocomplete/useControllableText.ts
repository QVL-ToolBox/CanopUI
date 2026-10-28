import { useCallback, useState } from "react";

export interface ControllableText {
  text: string;
  updateText: (next: string) => void;
}

export function useControllableText(
  inputValue: string | undefined,
  onInputChange: ((text: string) => void) | undefined,
  initialText: () => string,
): ControllableText {
  const [uncontrolledText, setUncontrolledText] = useState(initialText);
  const text = inputValue ?? uncontrolledText;

  const updateText = useCallback(
    (next: string) => {
      if (next === text) return;
      if (inputValue === undefined) setUncontrolledText(next);
      onInputChange?.(next);
    },
    [text, inputValue, onInputChange],
  );

  return { text, updateText };
}
