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
import {
  resolveCanopyScene,
  type CanopCanopyScene,
  type CanopCanopySceneMode,
  type CanopCanopySceneOverride,
} from "./canopyScenes";

const DEFAULT_VEIL: Record<CanopThemeMode, number> = { light: 0.32, dark: 0.24 };

export const MEDIA_WATCH_INTERVAL_MS = 500;

export interface UseCanopyBackgroundParams {
  sceneMode: CanopCanopySceneMode;
  scenes?: CanopCanopySceneOverride;
  animated: boolean;
  veil?: number;
}

export interface CanopCanopySource {
  src: string;
  type: "video/webm" | "video/mp4";
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
  const playing = animated && !reducedMotion;

  const [webmIndecodableReplieSurMp4, setWebmIndecodableReplieSurMp4] = useState(false);
  useEffect(() => setWebmIndecodableReplieSurMp4(false), [scene]);

  const sources = useMemo<CanopCanopySource[]>(() => {
    const webmPlusLegerEnPremier: CanopCanopySource = { src: scene.webm, type: "video/webm" };
    const mp4: CanopCanopySource = { src: scene.mp4, type: "video/mp4" };
    return webmIndecodableReplieSurMp4 ? [mp4] : [webmPlusLegerEnPremier, mp4];
  }, [scene, webmIndecodableReplieSurMp4]);

  const signalerEchec = useCallback((lecteur: HTMLVideoElement) => {
    if (lecteur.currentSrc.endsWith(".webm")) setWebmIndecodableReplieSurMp4(true);
  }, []);

  const onMediaError = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => signalerEchec(event.currentTarget),
    [signalerEchec],
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(
    function surveillerErreurNonDispatcheeJusquALaLecture() {
      if (!playing || webmIndecodableReplieSurMp4) return;
      const id = setInterval(() => {
        const lecteur = videoRef.current;
        if (!lecteur) return;
        if (lecteur.error) {
          signalerEchec(lecteur);
          clearInterval(id);
        } else if (lecteur.currentTime > 0) {
          clearInterval(id);
        }
      }, MEDIA_WATCH_INTERVAL_MS);
      return () => clearInterval(id);
    },
    [playing, webmIndecodableReplieSurMp4, sources, signalerEchec],
  );

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
