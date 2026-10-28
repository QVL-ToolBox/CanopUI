import { createContext } from "react";

export type CanopSkeletonSurface = "page" | "card";

export interface CanopSkeletonScopeValue {
  surface: CanopSkeletonSurface | null;
  enabled: boolean;
  titled: boolean;
}

const NO_SKELETON_SCOPE: CanopSkeletonScopeValue = {
  surface: null,
  enabled: true,
  titled: false,
};

export const SkeletonScopeContext = createContext<CanopSkeletonScopeValue>(NO_SKELETON_SCOPE);
