import { useMemo, useState, type RefObject } from "react";
import { hardwareConstraints } from "./canopyDevice";
import {
  resolveCanopyQuality,
  type CanopCanopyQuality,
  type CanopCanopyQualityState,
  type CanopyMotionBlocker,
} from "./canopyQuality";
import { useCanopyBufferingProbe } from "./useCanopyBufferingProbe";
import { useCanopyFrameProbe } from "./useCanopyFrameProbe";
import { useNetworkConstraint } from "./useNetworkConstraint";
import { useQualityReport, type CanopyQualityListener } from "./useQualityReport";

export interface UseCanopyQualityParams {
  quality: CanopCanopyQuality;
  motionBlocker?: CanopyMotionBlocker;
  liteAvailable: boolean;
  canProbe: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onQualityChange?: CanopyQualityListener;
}

export function useCanopyQuality({
  quality,
  motionBlocker,
  liteAvailable,
  canProbe,
  videoRef,
  onQualityChange,
}: UseCanopyQualityParams): CanopCanopyQualityState {
  const network = useNetworkConstraint();
  const [hardware] = useState(hardwareConstraints);
  const constraints = useMemo(
    () => (network ? [network, ...hardware] : hardware),
    [network, hardware],
  );
  const probing = quality === "auto" && canProbe;
  const frameDowngrades = useCanopyFrameProbe({ enabled: probing, videoRef });
  const bufferingDowngrades = useCanopyBufferingProbe({ enabled: probing, videoRef });
  const state = resolveCanopyQuality({
    quality,
    motionBlocker,
    constraints,
    frameDowngrades,
    bufferingDowngrades,
    liteAvailable,
  });
  useQualityReport(state, onQualityChange);
  return state;
}
