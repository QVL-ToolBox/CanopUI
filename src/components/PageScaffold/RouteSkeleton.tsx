import { PageContent } from "../PageContent";
import { ContentSkeleton } from "../Skeleton/ContentSkeleton";

export function RouteSkeleton() {
  return (
    <PageContent>
      <ContentSkeleton shape="page" />
    </PageContent>
  );
}
