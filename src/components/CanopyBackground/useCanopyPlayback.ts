import { useEffect, type RefObject } from "react";

export interface UseCanopyPlaybackParams {
  videoRef: RefObject<HTMLVideoElement | null>;
  sourceKey: string | undefined;
}

const GESTURE_EVENTS = ["pointerdown", "touchend", "keydown"] as const;

export function useCanopyPlayback({ videoRef, sourceKey }: UseCanopyPlaybackParams): void {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || sourceKey === undefined) return;

    let disposed = false;
    const disarm = () => {
      GESTURE_EVENTS.forEach((type) => document.removeEventListener(type, retry));
    };
    const attempt = () => {
      if (disposed || !video.paused) return;
      Promise.resolve(video.play()).catch(() => {
        if (disposed) return;
        GESTURE_EVENTS.forEach((type) =>
          document.addEventListener(type, retry, { once: true, passive: true }),
        );
      });
    };
    const retry = () => {
      disarm();
      attempt();
    };

    video.muted = true;
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) attempt();
    else video.addEventListener("canplay", attempt, { once: true });

    return () => {
      disposed = true;
      disarm();
      video.removeEventListener("canplay", attempt);
    };
  }, [sourceKey, videoRef]);
}
