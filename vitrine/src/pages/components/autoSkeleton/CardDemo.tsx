import { Card, Spinner, Stack, Text } from "@canop/ui";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface CardDemoProps {
  loading: boolean;
  t: AutoSkeletonTexts["sample"];
}

export function CardDemo({ loading, t }: CardDemoProps) {
  return (
    <Card title={t.cardTitle} elevation="sm">
      {loading ? (
        <Stack alignItems="center" padding="lg">
          <Spinner ariaLabel={t.cardLoading} />
        </Stack>
      ) : (
        <Stack gap="xs">
          <Text variant="metric" tabularNums>
            {t.balance}
          </Text>
          <Text variant="body-sm" tone="muted">
            {t.balanceHint}
          </Text>
        </Stack>
      )}
    </Card>
  );
}
