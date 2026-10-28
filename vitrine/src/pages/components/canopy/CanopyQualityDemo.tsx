import {
  Card,
  SegmentedControl,
  Stack,
  type CanopCanopyQuality,
  type CanopSegmentedControlOption,
} from "@canop/ui";
import { CanopyLiveFrame } from "./CanopyLiveFrame";
import { CanopyQualityReadout } from "./CanopyQualityReadout";
import type { CanopyQualityLabels } from "./canopyQualityLabels";
import { useCanopyQualityDemo } from "./useCanopyQualityDemo";

export interface CanopyQualityDemoProps {
  labels: CanopyQualityLabels;
}

const QUALITIES: CanopCanopyQuality[] = ["auto", "high", "low"];

export function CanopyQualityDemo({ labels }: CanopyQualityDemoProps) {
  const demo = useCanopyQualityDemo();
  const options: CanopSegmentedControlOption<CanopCanopyQuality>[] = QUALITIES.map((value) => ({
    value,
    label: labels.qualities[value],
  }));

  return (
    <Stack gap="lg">
      <SegmentedControl
        options={options}
        value={demo.quality}
        onChange={demo.setQuality}
        ariaLabel={labels.quality}
        size="small"
      />
      <CanopyQualityReadout detected={demo.detected} labels={labels} />
      <CanopyLiveFrame
        key={demo.quality}
        height="24rem"
        quality={demo.quality}
        onQualityChange={demo.onQualityChange}
      >
        <Card title={labels.cardTitle}>{labels.cardBody}</Card>
      </CanopyLiveFrame>
    </Stack>
  );
}
