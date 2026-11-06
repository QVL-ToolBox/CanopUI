import { CanopyBackground, type CanopCanopyBackgroundProps } from "@canop/ui";
import { DemoViewport } from "../../../kit/DemoViewport";

export interface CanopyLiveFrameProps extends Omit<CanopCanopyBackgroundProps, "minHeight"> {
  height: string;
}

export function CanopyLiveFrame({ height, ...canopy }: CanopyLiveFrameProps) {
  return (
    <DemoViewport height={height}>
      <CanopyBackground {...canopy} minHeight="100%" />
    </DemoViewport>
  );
}
