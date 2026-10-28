import Stack from "@mui/material/Stack";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";
import { LavaField } from "./LavaField";
import type { CanopShapeVariant } from "./shapeLayout";
import { useShapeBackground } from "./useShapeBackground";

export type { CanopShapeVariant } from "./shapeLayout";

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
  const { layout, lava, motion, backgroundColor } = useShapeBackground({
    variant,
    density,
    intensity,
    color,
    animated,
  });

  return (
    <Stack
      ref={motion.ref}
      component={component}
      sx={[
        {
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          minHeight: minHeight ?? layout.minHeight,
          alignItems: "center",
          justifyContent: layout.justifyContent,
          padding: layout.framePadding,
          backgroundColor,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <LavaField lava={lava} motion={motion} />
      <Stack
        sx={[
          {
            position: "relative",
            zIndex: 1,
            width: "100%",
            alignItems: "center",
            padding: layout.contentPadding,
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {children}
      </Stack>
    </Stack>
  );
}
