import type { ReactNode } from "react";
import { CanopyBackground } from "@canop/ui";
import { DemoViewport } from "../../../kit/DemoViewport";

export interface GlassBackdropProps {
  height: string;
  animated?: boolean;
  children: ReactNode;
}

export function GlassBackdrop({ height, animated = false, children }: GlassBackdropProps) {
  return (
    <DemoViewport height={height}>
      <CanopyBackground minHeight="100%" animated={animated}>
        {children}
      </CanopyBackground>
    </DemoViewport>
  );
}
