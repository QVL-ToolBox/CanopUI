import { Button, Icon, SegmentedControl, Stack, StatusChip } from "@canop/ui";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";
import type { SimulatedDuration, SimulatedLoad } from "./useSimulatedLoad";

const DURATION_OPTIONS: { value: SimulatedDuration; label: string }[] = [
  { value: "100", label: "100 ms" },
  { value: "600", label: "600 ms" },
  { value: "1500", label: "1,5 s" },
  { value: "4000", label: "4 s" },
];

interface LoadControlsProps {
  load: SimulatedLoad;
  t: AutoSkeletonTexts["controls"];
}

export function LoadControls({ load, t }: LoadControlsProps) {
  return (
    <Stack direction="row" gap="md" alignItems="center" wrap>
      <SegmentedControl
        options={DURATION_OPTIONS}
        value={load.duration}
        onChange={load.setDuration}
        ariaLabel={t.durationLabel}
        size="small"
      />
      <Button variant="primary" onClick={load.reload} startIcon={<Icon name="refresh" size="sm" />}>
        {t.reload}
      </Button>
      <StatusChip
        label={load.loading ? t.loading : t.loaded}
        tone={load.loading ? "info" : "success"}
      />
    </Stack>
  );
}
