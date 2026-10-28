import { Stack, StatusChip, Text } from "@canop/ui";

export interface RetainedValueProps {
  value: string;
}

export function RetainedValue({ value }: RetainedValueProps) {
  return (
    <Stack direction="row" gap="sm" alignItems="center">
      <Text variant="body-sm" tone="muted">
        value
      </Text>
      <StatusChip tone={value ? "success" : "neutral"} label={value || "—"} />
    </Stack>
  );
}
