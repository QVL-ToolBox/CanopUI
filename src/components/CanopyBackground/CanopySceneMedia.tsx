import Box from "@mui/material/Box";
import type { RefObject, SyntheticEvent } from "react";
import { canopySceneMediaSx } from "./canopySceneMediaSx";
import { CanopySceneVideo } from "./CanopySceneVideo";
import type { CanopCanopySource } from "./useCanopyVideoSources";

export interface CanopySceneMediaProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  playing: boolean;
  poster: string;
  sources: CanopCanopySource[];
  onMediaError: (event: SyntheticEvent<HTMLVideoElement>) => void;
}

const canopySceneLayerSx = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
} as const;

export function CanopySceneMedia({
  videoRef,
  playing,
  poster,
  sources,
  onMediaError,
}: CanopySceneMediaProps) {
  return (
    <Box aria-hidden sx={canopySceneLayerSx}>
      <Box component="img" aria-hidden alt="" src={poster} sx={canopySceneMediaSx} />
      {playing ? (
        <CanopySceneVideo
          key={sources[0].src}
          videoRef={videoRef}
          poster={poster}
          sources={sources}
          onMediaError={onMediaError}
        />
      ) : null}
    </Box>
  );
}
