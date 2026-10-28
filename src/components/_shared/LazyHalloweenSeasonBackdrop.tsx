import { lazy, Suspense } from "react";
import { DecorBoundary } from "./DecorBoundary";

const HalloweenSeasonBackdrop = lazy(() =>
  import("../HalloweenDecor/HalloweenSeasonBackdrop").then((module) => ({
    default: module.HalloweenSeasonBackdrop,
  })),
);

export interface LazyHalloweenSeasonBackdropProps {
  behindPageContent: boolean;
}

export function LazyHalloweenSeasonBackdrop({
  behindPageContent,
}: LazyHalloweenSeasonBackdropProps) {
  return (
    <DecorBoundary>
      <Suspense fallback={null}>
        <HalloweenSeasonBackdrop behindPageContent={behindPageContent} />
      </Suspense>
    </DecorBoundary>
  );
}
