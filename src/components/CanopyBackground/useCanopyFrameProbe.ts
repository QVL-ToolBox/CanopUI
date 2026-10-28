import { useEffect, useState, type RefObject } from "react";

const WARMUP_MS = 1500;
const WINDOW_MS = 2000;
const FALLBACK_LOW_FRAMES_PER_SECOND = 20;
const DROPPED_FRAME_RATIO = 0.2;
const SLOW_WINDOWS_BEFORE_VERDICT = 2;

interface PlaybackCounters {
  dropped: number;
  total: number;
}

export interface UseCanopyFrameProbeParams {
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

function readPlaybackCounters(video: HTMLVideoElement | null): PlaybackCounters | null {
  if (!video || typeof video.getVideoPlaybackQuality !== "function") return null;
  const quality = video.getVideoPlaybackQuality();
  return { dropped: quality.droppedVideoFrames, total: quality.totalVideoFrames };
}

function isSlowWindow(
  framesPerSecond: number,
  since: PlaybackCounters | null,
  now: PlaybackCounters | null,
): boolean {
  if (!since || !now) return framesPerSecond < FALLBACK_LOW_FRAMES_PER_SECOND;
  const decoded = now.total - since.total;
  const dropped = now.dropped - since.dropped;
  return decoded > 0 && dropped / decoded > DROPPED_FRAME_RATIO;
}

export function useCanopyFrameProbe({ enabled, videoRef }: UseCanopyFrameProbeParams): number {
  const [downgrades, setDowngrades] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window.requestAnimationFrame !== "function") return;
    let frame = 0;
    let frames = 0;
    let slowWindows = 0;
    let windowStart = performance.now() + WARMUP_MS;
    let baseline = readPlaybackCounters(videoRef.current);

    const step = (now: number) => {
      frame = window.requestAnimationFrame(step);
      if (now < windowStart) {
        baseline = readPlaybackCounters(videoRef.current);
        return;
      }
      frames += 1;
      const elapsed = now - windowStart;
      if (elapsed < WINDOW_MS) return;
      const counters = readPlaybackCounters(videoRef.current);
      const slowWindow = isSlowWindow((frames * 1000) / elapsed, baseline, counters);
      slowWindows = slowWindow ? slowWindows + 1 : 0;
      if (slowWindows >= SLOW_WINDOWS_BEFORE_VERDICT) {
        window.cancelAnimationFrame(frame);
        setDowngrades((current) => current + 1);
        return;
      }
      windowStart = now;
      frames = 0;
      baseline = counters;
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [enabled, downgrades, videoRef]);

  return downgrades;
}
