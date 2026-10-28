import { useCallback, useState } from "react";
import type { CanopCanopyQuality, CanopCanopyQualityState } from "@canop/ui";

export interface UseCanopyQualityDemoResult {
  quality: CanopCanopyQuality;
  setQuality: (quality: CanopCanopyQuality) => void;
  detected: CanopCanopyQualityState | null;
  onQualityChange: (state: CanopCanopyQualityState) => void;
}

export function useCanopyQualityDemo(): UseCanopyQualityDemoResult {
  const [quality, setQualityState] = useState<CanopCanopyQuality>("auto");
  const [detected, setDetected] = useState<CanopCanopyQualityState | null>(null);

  const setQuality = useCallback((next: CanopCanopyQuality) => {
    setDetected(null);
    setQualityState(next);
  }, []);

  return { quality, setQuality, detected, onQualityChange: setDetected };
}
