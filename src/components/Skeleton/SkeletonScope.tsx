import type { ReactNode } from "react";
import { NestedSkeletonScope } from "./NestedSkeletonScope";
import type { CanopSkeletonSurface } from "./skeletonScopeContext";

export interface CanopSkeletonScopeProps {
  /**
   * Surface que les Spinner du sous-arbre remplacent. Absente, elle hérite de la portée parente ;
   * `null` coupe toute portée, comme à la racine d'un overlay.
   */
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
