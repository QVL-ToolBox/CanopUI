import Box from "@mui/material/Box";
import { CanopyBackground } from "../CanopyBackground";
import { ShapeBackground } from "../ShapeBackground";

export type CanopPageBackground = "canopy" | "shapes";

const AMBIENT_INTENSITY = 1.28;

export interface PageBackdropProps {
  background: CanopPageBackground;
}

export function PageBackdrop({ background }: PageBackdropProps) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {background === "canopy" ? (
        <CanopyBackground minHeight="100%" sx={{ height: "100%" }} />
      ) : (
        <ShapeBackground
          variant="ambient"
          intensity={AMBIENT_INTENSITY}
          animated
          minHeight="100%"
          sx={{ height: "100%" }}
        />
      )}
    </Box>
  );
}
