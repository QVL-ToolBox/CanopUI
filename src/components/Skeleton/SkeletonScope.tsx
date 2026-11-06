import type { ReactNode } from "react";
import { NestedSkeletonScope } from "./NestedSkeletonScope";
import type { CanopSkeletonSurface } from "./skeletonScopeContext";

export interface CanopSkeletonScopeProps {
  surface?: CanopSkeletonSurface | null;
  enabled?: boolean;
  children: ReactNode;
}

export function SkeletonScope({ surface, enabled = true, children }: CanopSkeletonScopeProps) {
  return (
    <NestedSkeletonScope surface={surface} enabled={enabled}>
      {children}
    </NestedSkeletonScope>
  );
}
