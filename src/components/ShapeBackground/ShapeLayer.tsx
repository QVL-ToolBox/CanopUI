import Box from "@mui/material/Box";
import { useRef } from "react";
import { ShapeItem } from "./ShapeItem";
import { useShapePhysics } from "./useShapePhysics";
import type { CanopShapeDefinition } from "./shapes";

export interface ShapeLayerProps {
  shapes: CanopShapeDefinition[];
  animated: boolean;
  blur?: string;
}

export function ShapeLayer({ shapes, animated, blur }: ShapeLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { registerItem } = useShapePhysics({ containerRef, animated, count: shapes.length });

  return (
    <Box
      ref={containerRef}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {shapes.map((shape, index) => (
        <ShapeItem
          key={index}
          shape={shape}
          animated={animated}
          blur={blur}
          itemRef={registerItem(index)}
        />
      ))}
    </Box>
  );
}
