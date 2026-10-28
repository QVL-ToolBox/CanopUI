import { useCallback, useState } from "react";

export type ResultStep = 1 | -1;

export interface UseActiveResultResult {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  move: (step: ResultStep) => void;
}

function clampIndex(index: number, count: number): number {
  return Math.min(index, count - 1);
}

export function useActiveResult(count: number): UseActiveResultResult {
  const [index, setActiveIndex] = useState(0);

  const move = useCallback(
    (step: ResultStep) => {
      if (count === 0) return;
      setActiveIndex((current) => (clampIndex(current, count) + step + count) % count);
    },
    [count],
  );

  return { activeIndex: clampIndex(index, count), setActiveIndex, move };
}
