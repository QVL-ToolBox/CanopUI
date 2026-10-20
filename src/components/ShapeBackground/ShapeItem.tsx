import Box from "@mui/material/Box";
import { RoundedTriangle } from "./RoundedTriangle";
import type { CanopShapeDefinition } from "./shapes";

export interface ShapeItemProps {
  shape: CanopShapeDefinition;
  animated: boolean;
  blur?: string;
  itemRef: (element: HTMLDivElement | null) => void;
}

export function ShapeItem({ shape, animated, blur, itemRef }: ShapeItemProps) {
  return (
    <Box
      ref={itemRef}
      sx={{
        position: "absolute",
        top: shape.top,
        bottom: shape.bottom,
        left: shape.left,
        right: shape.right,
        width: shape.width,
        height: shape.height,
        filter: blur ? `blur(${blur})` : undefined,
        ...(animated && { willChange: "transform" }),
      }}
    >
      {shape.triangle ? (
        <RoundedTriangle color={shape.color} opacity={shape.opacity} rotate={shape.rotate} />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: shape.color,
            opacity: shape.opacity,
            borderRadius: shape.borderRadius,
            transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
          }}
        />
      )}
    </Box>
  );
}
