import { useTheme } from "@mui/material/styles";
import { useMemo, useRef, type RefObject, type SyntheticEvent } from "react";
import { useReducedMotion } from "../../motion";
import type { CanopThemeMode } from "../../theme";
import { clamp } from "../_shared/clamp";
import {
  resolveCanopyScene,
  type CanopCanopyScene,
  type CanopCanopySceneMode,
  type CanopCanopySceneOverride,
} from "./canopyScenes";
import { useCanopyPlayback } from "./useCanopyPlayback";
import { useCanopyVideoSources, type CanopCanopySource } from "./useCanopyVideoSources";
import { useVideoCodecOrder } from "./useVideoCodecOrder";

export { MEDIA_WATCH_INTERVAL_MS } from "./useCanopyVideoSources";

const DEFAULT_VEIL: Record<CanopThemeMode, number> = { light: 0.32, dark: 0.24 };

export interface UseCanopyBackgroundParams {
  sceneMode: CanopCanopySceneMode;
  scenes?: CanopCanopySceneOverride;
  animated: boolean;
  veil?: number;
}

export interface UseCanopyBackgroundResult {
  mode: CanopThemeMode;
  scene: CanopCanopyScene;
  playing: boolean;
  veilOpacity: number;
  sources: CanopCanopySource[];
  videoRef: RefObject<HTMLVideoElement | null>;
  onMediaError: (event: SyntheticEvent<HTMLVideoElement>) => void;
}

export function useCanopyBackground({
  sceneMode,
  scenes,
  animated,
  veil,
}: UseCanopyBackgroundParams): UseCanopyBackgroundResult {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();

  const mode: CanopThemeMode = sceneMode === "auto" ? theme.palette.mode : sceneMode;
  const scene = useMemo(() => resolveCanopyScene(mode, scenes), [mode, scenes]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codecOrder = useVideoCodecOrder();
  const playing = animated && !reducedMotion && codecOrder !== "pending";

  const { sources, onMediaError } = useCanopyVideoSources({
    scene,
    playing,
    preferMp4: codecOrder === "mp4-first",
    videoRef,
  });

  useCanopyPlayback({ videoRef, sourceKey: playing ? sources[0].src : undefined });

  return {
    mode,
    scene,
    playing,
    veilOpacity: clamp(veil ?? DEFAULT_VEIL[mode], 0, 1),
    sources,
    videoRef,
    onMediaError,
  };
}
