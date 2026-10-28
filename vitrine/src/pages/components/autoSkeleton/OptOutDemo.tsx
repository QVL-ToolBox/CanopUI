import { PageContent, Spinner, Stack } from "@canop/ui";
import { AccountsList } from "./AccountsList";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface OptOutDemoProps {
  loading: boolean;
  t: AutoSkeletonTexts["sample"];
}

export function OptOutDemo({ loading, t }: OptOutDemoProps) {
  return (
    <PageContent hugContent skeleton={false}>
      {loading ? (
        <Stack alignItems="center" padding="lg">
          <Spinner ariaLabel={t.pageLoading} />
        </Stack>
      ) : (
        <AccountsList accounts={t.accounts.slice(0, 1)} />
      )}
    </PageContent>
  );
}
