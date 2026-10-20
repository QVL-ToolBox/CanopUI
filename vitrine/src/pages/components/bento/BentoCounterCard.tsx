import { Card, Stack, Text } from "@canop/ui";

export interface BentoCounterCardProps {
  title: string;
  subtitle: string;
  value: string;
  caption: string;
}

export function BentoCounterCard({ title, subtitle, value, caption }: BentoCounterCardProps) {
  return (
    <Card variant="interactive" fill arrow title={title} subtitle={subtitle}>
      <Stack fill justifyContent="end" gap="xs">
        <Text variant="display">{value}</Text>
        <Text variant="body-sm" tone="muted">
          {caption}
        </Text>
      </Stack>
    </Card>
  );
}
