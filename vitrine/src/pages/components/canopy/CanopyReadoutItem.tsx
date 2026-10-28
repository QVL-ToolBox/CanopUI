import { Stack, Text, type CanopTextTone } from "@canop/ui";

export interface CanopyReadoutItemProps {
  label: string;
  value: string;
  tone: CanopTextTone;
}

export function CanopyReadoutItem({ label, value, tone }: CanopyReadoutItemProps) {
  return (
    <Stack gap="xs">
      <Text variant="overline" tone="muted">
        {label}
      </Text>
      <Text variant="label" weight="semibold" tone={tone} tabularNums>
        {value}
      </Text>
    </Stack>
  );
}
