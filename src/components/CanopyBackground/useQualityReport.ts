import { useEffect, useRef } from "react";
import type { CanopCanopyQualityState } from "./canopyQuality";

export type CanopyQualityListener = (state: CanopCanopyQualityState) => void;

export function useQualityReport(
  { level, reason }: CanopCanopyQualityState,
  onQualityChange: CanopyQualityListener | undefined,
): void {
  const listenerRef = useRef(onQualityChange);

  useEffect(() => {
    listenerRef.current = onQualityChange;
  }, [onQualityChange]);

  useEffect(() => {
    listenerRef.current?.({ level, reason });
  }, [level, reason]);
}
