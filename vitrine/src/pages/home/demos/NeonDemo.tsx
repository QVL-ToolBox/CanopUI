import { ProgressBar, Stack, StatusChip } from "@canop/ui";
import { DarkStage } from "../../../kit/DarkStage";
import { NEON_DEMO_UPLOAD_PROGRESS } from "../../../kit/neonDemoProgress";

export interface NeonDemoProps {
  paid: string;
  pending: string;
  upload: string;
}

export function NeonDemo({ paid, pending, upload }: NeonDemoProps) {
  return (
    <DarkStage size="compact" decorative>
      <Stack gap="md">
        <Stack direction="row" gap="sm" wrap>
          <StatusChip tone="success" label={paid} />
          <StatusChip tone="warning" label={pending} />
        </Stack>
        <ProgressBar value={NEON_DEMO_UPLOAD_PROGRESS} label={upload} showValue />
      </Stack>
    </DarkStage>
  );
}
