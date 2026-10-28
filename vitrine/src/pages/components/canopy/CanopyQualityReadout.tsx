import {
  Stack,
  type CanopCanopyQualityLevel,
  type CanopCanopyQualityState,
  type CanopTextTone,
} from "@canop/ui";
import { CanopyReadoutItem } from "./CanopyReadoutItem";
import type { CanopyQualityLabels } from "./canopyQualityLabels";

export interface CanopyQualityReadoutProps {
  detected: CanopCanopyQualityState | null;
  labels: CanopyQualityLabels;
}

const LEVEL_TONE: Record<CanopCanopyQualityLevel, CanopTextTone> = {
  high: "success",
  medium: "info",
  low: "warning",
};

export function CanopyQualityReadout({ detected, labels }: CanopyQualityReadoutProps) {
  return (
    <Stack direction="row" gap="xl" wrap>
      <CanopyReadoutItem
        label={labels.level}
        value={detected ? labels.levels[detected.level] : labels.pending}
        tone={detected ? LEVEL_TONE[detected.level] : "muted"}
      />
      <CanopyReadoutItem
        label={labels.reason}
        value={detected ? labels.reasons[detected.reason] : labels.pending}
        tone="default"
      />
    </Stack>
  );
}
