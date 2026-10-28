import Box from "@mui/material/Box";
import { lazy, Suspense } from "react";
import type { CanopBackgroundTone } from "../_shared/backgroundTone";
import { DecorBoundary } from "../_shared/DecorBoundary";

export type CanopPageBackground = "canopy" | "shapes";

const CanopyBackground = lazy(() =>
  import("../CanopyBackground").then((module) => ({ default: module.CanopyBackground })),
);

const ShapeBackground = lazy(() =>
  import("../ShapeBackground").then((module) => ({ default: module.ShapeBackground })),
);

const backdropFallback = <Box sx={{ height: "100%", backgroundColor: "background.default" }} />;

export interface PageBackdropProps {
  background: CanopPageBackground;
  tone: CanopBackgroundTone;
}

export function PageBackdrop({ background, tone }: PageBackdropProps) {
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
      <DecorBoundary fallback={backdropFallback}>
        <Suspense fallback={backdropFallback}>
          {background === "canopy" ? (
            <CanopyBackground minHeight="100%" sx={{ height: "100%" }} />
          ) : (
            <ShapeBackground
              variant="ambient"
              animated
              color={tone}
              minHeight="100%"
              sx={{ height: "100%" }}
            />
          )}
        </Suspense>
      </DecorBoundary>
    </Box>
  );
}
