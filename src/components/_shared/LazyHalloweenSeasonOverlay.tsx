import { lazy, Suspense } from "react";
import { DecorBoundary } from "./DecorBoundary";

const HalloweenSeasonOverlay = lazy(() =>
  import("../HalloweenDecor/HalloweenSeasonOverlay").then((module) => ({
    default: module.HalloweenSeasonOverlay,
  })),
);

export function LazyHalloweenSeasonOverlay() {
  return (
    <DecorBoundary>
      <Suspense fallback={null}>
        <HalloweenSeasonOverlay />
      </Suspense>
    </DecorBoundary>
  );
}
