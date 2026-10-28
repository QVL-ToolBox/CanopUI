import Box from "@mui/material/Box";
import { useCallback, useState, type RefObject, type SyntheticEvent } from "react";
import { tokens } from "../../tokens";
import { canopySceneMediaSx } from "./canopySceneMediaSx";
import type { CanopCanopySource } from "./useCanopyVideoSources";

export interface CanopySceneVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  poster: string;
  sources: CanopCanopySource[];
  onMediaError: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onPlaying: () => void;
}

const { duration, easing } = tokens.motion;
const REVEAL_TRANSITION = `opacity ${duration.slower} ${easing.decelerate}`;

function useVideoReveal(onPlaying: () => void) {
  const [revealed, setRevealed] = useState(false);
  const reveal = useCallback(() => {
    setRevealed(true);
    onPlaying();
  }, [onPlaying]);
  return { revealed, reveal };
}

export function CanopySceneVideo({
  videoRef,
  poster,
  sources,
  onMediaError,
  onPlaying,
}: CanopySceneVideoProps) {
  const { revealed, reveal } = useVideoReveal(onPlaying);

  return (
    <Box
      ref={videoRef}
      component="video"
      aria-hidden
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      onError={onMediaError}
      onPlaying={reveal}
      sx={{ ...canopySceneMediaSx, opacity: revealed ? 1 : 0, transition: REVEAL_TRANSITION }}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </Box>
  );
}
