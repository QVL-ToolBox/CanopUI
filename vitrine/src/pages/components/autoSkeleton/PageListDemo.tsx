import { PageContent, Spinner, Stack } from "@canop/ui";
import { AccountsList } from "./AccountsList";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface PageListDemoProps {
  loading: boolean;
  t: AutoSkeletonTexts["sample"];
}

export function PageListDemo({ loading, t }: PageListDemoProps) {
  return (
    <PageContent hugContent>
      {loading ? (
        <Stack alignItems="center" padding="lg">
          <Spinner ariaLabel={t.pageLoading} />
        </Stack>
      ) : (
        <AccountsList accounts={t.accounts} />
      )}
    </PageContent>
  );
}
