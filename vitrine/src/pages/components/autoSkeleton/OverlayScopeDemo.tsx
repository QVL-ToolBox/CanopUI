import { Card, PageContent, SkeletonScope, Spinner, Stack, Text } from "@canop/ui";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface OverlayScopeDemoProps {
  loading: boolean;
  t: AutoSkeletonTexts["sample"];
}

export function OverlayScopeDemo({ loading, t }: OverlayScopeDemoProps) {
  return (
    <PageContent hugContent>
      <SkeletonScope surface={null}>
        <Stack gap="md">
          <Stack alignItems="center" padding="lg">
            {loading ? <Spinner ariaLabel={t.overlayLoading} /> : <Text>{t.overlayLoaded}</Text>}
          </Stack>
          <Card title={t.cardTitle} elevation="sm">
            {loading ? (
              <Spinner ariaLabel={t.cardLoading} />
            ) : (
              <Text variant="metric" tabularNums>
                {t.balance}
              </Text>
            )}
          </Card>
        </Stack>
      </SkeletonScope>
    </PageContent>
  );
}
