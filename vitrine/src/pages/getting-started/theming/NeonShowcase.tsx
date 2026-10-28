import { Button, Checkbox, Heading, ProgressBar, Stack, StatusChip, Toggle } from "@canop/ui";
import { DarkStage } from "../../../kit/DarkStage";
import { NEON_DEMO_UPLOAD_PROGRESS } from "../../../kit/neonDemoProgress";
import { useNeonShowcase } from "./useNeonShowcase";

export interface NeonShowcaseTexts {
  heading: string;
  confirm: string;
  compare: string;
  highlight: string;
  remove: string;
  paid: string;
  pending: string;
  refused: string;
  notifications: string;
  remember: string;
  upload: string;
}

export interface NeonShowcaseProps {
  texts: NeonShowcaseTexts;
}

export function NeonShowcase({ texts }: NeonShowcaseProps) {
  const showcase = useNeonShowcase();

  return (
    <DarkStage size="roomy">
      <Stack gap="lg">
        <Heading level={3} size={{ xs: 4, md: 3 }} gutterBottom={false}>
          {texts.heading}
        </Heading>
        <Stack direction="row" gap="sm" wrap>
          <Button>{texts.confirm}</Button>
          <Button variant="secondary">{texts.compare}</Button>
          <Button variant="accent">{texts.highlight}</Button>
          <Button variant="danger">{texts.remove}</Button>
        </Stack>
        <Stack direction="row" gap="sm" alignItems="center" wrap>
          <StatusChip tone="success" label={texts.paid} />
          <StatusChip tone="warning" label={texts.pending} />
          <StatusChip tone="error" label={texts.refused} />
        </Stack>
        <Stack direction="row" gap="lg" alignItems="center" wrap>
          <Toggle
            checked={showcase.notifications}
            onChange={showcase.setNotifications}
            label={texts.notifications}
          />
          <Checkbox
            checked={showcase.remember}
            onChange={showcase.setRemember}
            label={texts.remember}
          />
        </Stack>
        <ProgressBar value={NEON_DEMO_UPLOAD_PROGRESS} label={texts.upload} showValue />
      </Stack>
    </DarkStage>
  );
}
