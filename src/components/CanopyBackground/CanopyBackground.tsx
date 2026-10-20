import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";
import { SurfaceVeil } from "../_shared/SurfaceVeil";
import { useCanopyBackground } from "./useCanopyBackground";
import type {
  CanopCanopyScene,
  CanopCanopySceneMode,
  CanopCanopySceneOverride,
} from "./canopyScenes";

export type { CanopCanopyScene, CanopCanopySceneMode, CanopCanopySceneOverride };

export interface CanopCanopyBackgroundProps {
  children?: ReactNode;
  sceneMode?: CanopCanopySceneMode;
  scenes?: CanopCanopySceneOverride;
  animated?: boolean;
  veil?: number;
  minHeight?: number | string;
  component?: ElementType;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

const mediaSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 0,
  pointerEvents: "none",
} as const;

export function CanopyBackground({
  children,
  sceneMode = "auto",
  scenes,
  animated = true,
  veil,
  minHeight,
  component = "div",
  sx,
  contentSx,
}: CanopCanopyBackgroundProps) {
  const { scene, playing, veilOpacity, sources, videoRef, onMediaError } = useCanopyBackground({
    sceneMode,
    scenes,
    animated,
    veil,
  });

  return (
    <Box
      component={component}
      sx={[
        {
          position: "relative",
          overflow: "hidden",
          minHeight: minHeight ?? "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {playing ? (
        <Box
          key={sources[0].src}
          ref={videoRef}
          component="video"
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={scene.poster}
          onError={onMediaError}
          sx={mediaSx}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </Box>
      ) : (
        <Box component="img" aria-hidden alt="" src={scene.poster} sx={mediaSx} />
      )}
      <SurfaceVeil opacity={veilOpacity} />
      <Box
        sx={[
          {
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {children}
      </Box>
    </Box>
  );
}
