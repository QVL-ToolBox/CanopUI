import type { CanopContentSkeletonShape } from "../Skeleton/ContentSkeleton";
import { useSkeletonScope } from "../Skeleton/useSkeletonScope";
import type { CanopSpinnerColor, CanopSpinnerSize } from "./Spinner";

interface UseSpinnerSkeletonParams {
  skeleton: boolean;
  fullPage: boolean;
  size: CanopSpinnerSize;
  color: CanopSpinnerColor;
}

export function useSpinnerSkeleton({
  skeleton,
  fullPage,
  size,
  color,
}: UseSpinnerSkeletonParams): CanopContentSkeletonShape | null {
  const { surface, enabled } = useSkeletonScope();
  const standsForContent =
    skeleton && enabled && !fullPage && size !== "small" && color !== "inherit";
  if (!standsForContent || surface === null) return null;
  if (surface === "card") return "card";
  return size === "large" ? "page" : "list";
}
