import Box from "@mui/material/Box";
import { CanopyBackground, type CanopCanopyBackgroundProps } from "@canop/ui";
import { DemoViewport } from "../../../kit/DemoViewport";
import { useSingleLive } from "../../../kit/useSingleLive";

export interface CanopyLiveFrameProps extends Omit<
  CanopCanopyBackgroundProps,
  "animated" | "minHeight"
> {
  height: string;
}

export function CanopyLiveFrame({ height, onQualityChange, ...canopy }: CanopyLiveFrameProps) {
  const { ref, live } = useSingleLive();

  return (
    <Box ref={ref}>
      <DemoViewport height={height}>
        <CanopyBackground
          {...canopy}
          animated={live}
          onQualityChange={live ? onQualityChange : undefined}
          minHeight="100%"
        />
      </DemoViewport>
    </Box>
  );
}
