import type { ReactNode } from "react";
import { HalloweenDecorScene } from "./HalloweenDecorScene";
import type { CanopHalloweenDecorDensity, CanopHalloweenDecorScope } from "./halloweenSceneTypes";
import { useHalloweenDecorPlacement } from "./useHalloweenDecorPlacement";

export type { CanopHalloweenDecorDensity, CanopHalloweenDecorScope };

export interface CanopHalloweenDecorProps {
  density?: CanopHalloweenDecorDensity;
  scope?: CanopHalloweenDecorScope;
  children?: ReactNode;
}

export function HalloweenDecor({
  density = "low",
  scope = "container",
  children,
}: CanopHalloweenDecorProps) {
  const { alreadyRenderedByTheme, behindPageContent } = useHalloweenDecorPlacement(
    scope,
    children !== undefined,
  );

  if (alreadyRenderedByTheme) return <>{children}</>;

  return (
    <HalloweenDecorScene density={density} scope={scope} behindPageContent={behindPageContent}>
      {children}
    </HalloweenDecorScene>
  );
}
