import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
  type SyntheticEvent,
} from "react";
import type { CanopCanopyScene } from "./canopyScenes";

export const MEDIA_WATCH_INTERVAL_MS = 500;

export interface CanopCanopySource {
  src: string;
  type: "video/webm" | "video/mp4";
}

export interface UseCanopyVideoSourcesParams {
  scene: CanopCanopyScene;
  playing: boolean;
  lite: boolean;
  preferMp4: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export interface UseCanopyVideoSourcesResult {
  sources: CanopCanopySource[];
  onMediaError: (event: SyntheticEvent<HTMLVideoElement>) => void;
}

export function useCanopyVideoSources({
  scene,
  playing,
  lite,
  preferMp4,
  videoRef,
}: UseCanopyVideoSourcesParams): UseCanopyVideoSourcesResult {
  const [webmFallbackToMp4, setWebmFallbackToMp4] = useState(false);
  useEffect(() => setWebmFallbackToMp4(false), [scene]);

  const sources = useMemo<CanopCanopySource[]>(() => {
    const files = lite && scene.lite ? scene.lite : scene;
    const webm: CanopCanopySource = { src: files.webm, type: "video/webm" };
    const mp4: CanopCanopySource = { src: files.mp4, type: "video/mp4" };
    if (webmFallbackToMp4) return [mp4];
    return preferMp4 ? [mp4, webm] : [webm, mp4];
  }, [scene, lite, webmFallbackToMp4, preferMp4]);

  const reportFailure = useCallback((video: HTMLVideoElement) => {
    if (video.currentSrc.endsWith(".webm")) setWebmFallbackToMp4(true);
  }, []);

  const onMediaError = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => reportFailure(event.currentTarget),
    [reportFailure],
  );

  useEffect(
    function watchUndispatchedErrorUntilPlayback() {
      if (!playing || webmFallbackToMp4) return;
      const id = setInterval(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.error) {
          reportFailure(video);
          clearInterval(id);
        } else if (video.currentTime > 0) {
          clearInterval(id);
        }
      }, MEDIA_WATCH_INTERVAL_MS);
      return () => clearInterval(id);
    },
    [playing, webmFallbackToMp4, sources, reportFailure, videoRef],
  );

  return { sources, onMediaError };
}
