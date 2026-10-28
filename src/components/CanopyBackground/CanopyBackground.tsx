import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";
import { SurfaceVeil } from "../_shared/SurfaceVeil";
import { CanopySceneMedia } from "./CanopySceneMedia";
import { useCanopyBackground } from "./useCanopyBackground";
import type {
  CanopCanopyQuality,
  CanopCanopyQualityLevel,
  CanopCanopyQualityReason,
  CanopCanopyQualityState,
} from "./canopyQuality";
import type {
  CanopCanopyLiteScene,
  CanopCanopyScene,
  CanopCanopySceneMode,
  CanopCanopySceneOverride,
} from "./canopyScenes";

export type {
  CanopCanopyLiteScene,
  CanopCanopyScene,
  CanopCanopySceneMode,
  CanopCanopySceneOverride,
};
export type {
  CanopCanopyQuality,
  CanopCanopyQualityLevel,
  CanopCanopyQualityReason,
  CanopCanopyQualityState,
};

export interface CanopCanopyBackgroundProps {
  children?: ReactNode;
  sceneMode?: CanopCanopySceneMode;
  scenes?: CanopCanopySceneOverride;
  animated?: boolean;
  quality?: CanopCanopyQuality;
  onQualityChange?: (state: CanopCanopyQualityState) => void;
  veil?: number;
  minHeight?: number | string;
  component?: ElementType;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

export function CanopyBackground({
  children,
  sceneMode = "auto",
  scenes,
  animated = true,
  quality = "auto",
  onQualityChange,
  veil,
  minHeight,
  component = "div",
  sx,
  contentSx,
}: CanopCanopyBackgroundProps) {
  const canopy = useCanopyBackground({
    sceneMode,
    scenes,
    animated,
    veil,
    quality,
    onQualityChange,
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
      <CanopySceneMedia
        sceneRef={canopy.sceneRef}
        videoRef={canopy.videoRef}
        playing={canopy.playing}
        poster={canopy.scene.poster}
        sources={canopy.sources}
        onMediaError={canopy.onMediaError}
        onPlaying={canopy.onPlaying}
      />
      <SurfaceVeil opacity={canopy.veilOpacity} />
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
