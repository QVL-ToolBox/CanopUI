import { useTheme } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { useReducedMotion } from "../../motion";
import type { CanopThemeMode } from "../../theme";
import { clamp } from "../_shared/clamp";
import type { CanopCanopyQuality, CanopyMotionBlocker } from "./canopyQuality";
import {
  resolveCanopyScene,
  type CanopCanopyScene,
  type CanopCanopySceneMode,
  type CanopCanopySceneOverride,
} from "./canopyScenes";
import { useCanopyPlayback } from "./useCanopyPlayback";
import { useCanopyQuality } from "./useCanopyQuality";
import { useCanopyVideoSources, type CanopCanopySource } from "./useCanopyVideoSources";
import { useCanopyViewport } from "./useCanopyViewport";
import type { CanopyQualityListener } from "./useQualityReport";
import { useVideoCodecOrder } from "./useVideoCodecOrder";

export { MEDIA_WATCH_INTERVAL_MS } from "./useCanopyVideoSources";

const DEFAULT_VEIL: Record<CanopThemeMode, number> = { light: 0.32, dark: 0.24 };

function motionBlockerOf(
  animated: boolean,
  reducedMotion: boolean,
): CanopyMotionBlocker | undefined {
  if (!animated) return "disabled";
  return reducedMotion ? "reduced-motion" : undefined;
}

export interface UseCanopyBackgroundParams {
  sceneMode: CanopCanopySceneMode;
  scenes?: CanopCanopySceneOverride;
  animated: boolean;
  veil?: number;
  quality: CanopCanopyQuality;
  onQualityChange?: CanopyQualityListener;
}

export interface UseCanopyBackgroundResult {
  mode: CanopThemeMode;
  scene: CanopCanopyScene;
  playing: boolean;
  veilOpacity: number;
  sources: CanopCanopySource[];
  sceneRef: (node: HTMLDivElement | null) => void;
  videoRef: RefObject<HTMLVideoElement | null>;
  onMediaError: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onPlaying: () => void;
}

export function useCanopyBackground({
  sceneMode,
  scenes,
  animated,
  veil,
  quality,
  onQualityChange,
}: UseCanopyBackgroundParams): UseCanopyBackgroundResult {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();

  const mode: CanopThemeMode = sceneMode === "auto" ? theme.palette.mode : sceneMode;
  const scene = useMemo(() => resolveCanopyScene(mode, scenes), [mode, scenes]);

  const viewport = useCanopyViewport();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [rolling, setRolling] = useState(false);
  const onPlaying = useCallback(() => setRolling(true), []);

  const motionBlocker = motionBlockerOf(animated, reducedMotion);
  const motionAllowed = motionBlocker === undefined;
  const qualityState = useCanopyQuality({
    quality,
    motionBlocker,
    liteAvailable: scene.lite !== undefined,
    canProbe: motionAllowed && viewport.active && rolling,
    videoRef,
    onQualityChange,
  });

  const adaptive = quality === "auto";
  const codecOrder = useVideoCodecOrder();
  const codecSettled = !adaptive || codecOrder !== "pending";
  const videoLevel = qualityState.level !== "low";
  const playing = motionAllowed && videoLevel && viewport.seen && codecSettled;

  const { sources, onMediaError } = useCanopyVideoSources({
    scene,
    playing,
    lite: qualityState.level === "medium",
    preferMp4: adaptive && codecOrder === "mp4-first",
    videoRef,
  });

  const sourceKey = playing ? sources[0].src : undefined;
  useEffect(() => setRolling(false), [sourceKey]);
  useCanopyPlayback({ videoRef, active: viewport.active, sourceKey });

  return {
    mode,
    scene,
    playing,
    veilOpacity: clamp(veil ?? DEFAULT_VEIL[mode], 0, 1),
    sources,
    sceneRef: viewport.ref,
    videoRef,
    onMediaError,
    onPlaying,
  };
}
