import { Card, Heading, PageContent, Spinner, Stack, Text } from "@canop/ui";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface FullPageDemoProps {
  loading: boolean;
  t: AutoSkeletonTexts["sample"];
}

export function FullPageDemo({ loading, t }: FullPageDemoProps) {
  return (
    <PageContent hugContent>
      {loading ? (
        <Stack alignItems="center" justifyContent="center">
          <Spinner size="large" ariaLabel={t.pageLoading} />
        </Stack>
      ) : (
        <Stack gap="lg">
          <Heading level={3} size={4} gutterBottom={false}>
            {t.pageHeading}
          </Heading>
          <Card title={t.cardTitle} elevation="sm">
            <Text variant="metric" tabularNums>
              {t.balance}
            </Text>
          </Card>
        </Stack>
      )}
    </PageContent>
  );
}
