import type { ReactNode } from "react";
import { SkeletonScopeContext } from "./skeletonScopeContext";
import { useNestedSkeletonScope, type UseNestedSkeletonScopeParams } from "./useSkeletonScope";

interface NestedSkeletonScopeProps extends UseNestedSkeletonScopeParams {
  children: ReactNode;
}

export function NestedSkeletonScope({ children, ...params }: NestedSkeletonScopeProps) {
  const value = useNestedSkeletonScope(params);
  return <SkeletonScopeContext.Provider value={value}>{children}</SkeletonScopeContext.Provider>;
}
