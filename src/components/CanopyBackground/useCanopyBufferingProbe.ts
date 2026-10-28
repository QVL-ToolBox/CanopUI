import { useEffect, useState, type RefObject } from "react";

const STALLS_BEFORE_VERDICT = 2;
const STALL_EVENTS = ["waiting", "stalled"] as const;

export interface UseCanopyBufferingProbeParams {
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function useCanopyBufferingProbe({
  enabled,
  videoRef,
}: UseCanopyBufferingProbeParams): number {
  const [downgrades, setDowngrades] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) return;
    let stalls = 0;
    const disarm = () => {
      STALL_EVENTS.forEach((type) => video.removeEventListener(type, onStall));
    };
    const onStall = () => {
      stalls += 1;
      if (stalls < STALLS_BEFORE_VERDICT) return;
      disarm();
      setDowngrades((current) => current + 1);
    };
    STALL_EVENTS.forEach((type) => video.addEventListener(type, onStall));
    return disarm;
  }, [enabled, downgrades, videoRef]);

  return downgrades;
}
