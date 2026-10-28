import { useLayoutEffect, useRef } from "react";

export function useTextFollowsValue(
  value: string,
  shownText: string,
  valueOfCurrentText: string,
  updateText: (next: string) => void,
): void {
  const latestRef = useRef({ valueOfCurrentText, updateText });

  useLayoutEffect(() => {
    latestRef.current = { valueOfCurrentText, updateText };
  });

  useLayoutEffect(() => {
    const latest = latestRef.current;
    if (latest.valueOfCurrentText !== value) latest.updateText(shownText);
  }, [value, shownText]);
}
