import { useContext, useMemo } from "react";
import {
  SkeletonScopeContext,
  type CanopSkeletonScopeValue,
  type CanopSkeletonSurface,
} from "./skeletonScopeContext";

export function useSkeletonScope(): CanopSkeletonScopeValue {
  return useContext(SkeletonScopeContext);
}

export interface UseNestedSkeletonScopeParams {
  surface?: CanopSkeletonSurface | null;
  enabled: boolean;
  titled?: boolean;
}

function nestedScope(
  parent: CanopSkeletonScopeValue,
  { surface, enabled, titled = false }: UseNestedSkeletonScopeParams,
): CanopSkeletonScopeValue {
  if (surface === null) return { surface: null, enabled, titled: false };
  if (surface === undefined) {
    return { surface: parent.surface, enabled: parent.enabled && enabled, titled: parent.titled };
  }
  return { surface, enabled: parent.enabled && enabled, titled };
}

export function useNestedSkeletonScope(
  params: UseNestedSkeletonScopeParams,
): CanopSkeletonScopeValue {
  const parent = useSkeletonScope();
  const { surface, enabled, titled } = nestedScope(parent, params);
  return useMemo(() => ({ surface, enabled, titled }), [surface, enabled, titled]);
}
