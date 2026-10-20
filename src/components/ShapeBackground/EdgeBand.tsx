import Box from "@mui/material/Box";
import { ShapeLayer } from "./ShapeLayer";
import { edgeBandHeight, type CanopShapeDefinition } from "./shapes";

export interface EdgeBandProps {
  shapes: CanopShapeDefinition[];
  animated: boolean;
  blur?: string;
}

export function EdgeBand({ shapes, animated, blur }: EdgeBandProps) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: "100%",
        height: edgeBandHeight,
        overflow: "hidden",
        borderRadius: "0 0 50% 50% / 0 0 2.5rem 2.5rem",
        background: (theme) =>
          `linear-gradient(160deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
      }}
    >
      <ShapeLayer shapes={shapes} animated={animated} blur={blur} />
    </Box>
  );
}
