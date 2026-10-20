import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";
import { EdgeBand } from "./EdgeBand";
import { ShapeLayer } from "./ShapeLayer";
import { SurfaceVeil } from "../_shared/SurfaceVeil";
import { useShapeBackground } from "./useShapeBackground";
import type { CanopShapeVariant } from "./shapes";

export type { CanopShapeVariant } from "./shapes";

export interface CanopShapeBackgroundProps {
  children?: ReactNode;
  variant?: CanopShapeVariant;
  density?: number;
  intensity?: number;
  animated?: boolean;
  color?: string;
  minHeight?: number | string;
  component?: ElementType;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

export function ShapeBackground({
  children,
  variant = "hero",
  density,
  intensity = 1,
  animated = false,
  color = "primary.main",
  minHeight,
  component = "div",
  sx,
  contentSx,
}: CanopShapeBackgroundProps) {
  const { shapes, shapeBlur, showVeil, veilOpacity, backgroundColor, contentJustify } =
    useShapeBackground({ variant, density, intensity, color });

  const isEdge = variant === "edge";
  const resolvedMinHeight = minHeight ?? (isEdge ? "auto" : "100vh");

  return (
    <Box
      component={component}
      sx={[
        {
          position: "relative",
          overflow: "hidden",
          minHeight: resolvedMinHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: contentJustify,
          padding: isEdge ? 0 : "1rem",
          backgroundColor,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {isEdge ? (
        <EdgeBand shapes={shapes} animated={animated} blur={shapeBlur} />
      ) : (
        <ShapeLayer shapes={shapes} animated={animated} blur={shapeBlur} />
      )}
      {showVeil && <SurfaceVeil opacity={veilOpacity} />}
      <Box
        sx={[
          {
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: isEdge ? "1rem" : 0,
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {children}
      </Box>
    </Box>
  );
}
