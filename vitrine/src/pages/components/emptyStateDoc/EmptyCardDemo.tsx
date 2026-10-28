import { Card, EmptyState, Icon } from "@canop/ui";
import type { EmptyStateTexts } from "./emptyStateTexts";

export interface EmptyCardDemoProps {
  t: EmptyStateTexts;
}

export function EmptyCardDemo({ t }: EmptyCardDemoProps) {
  return (
    <Card title={t.demos.card.cardTitle}>
      <EmptyState
        size="sm"
        surface="plain"
        headingLevel={4}
        icon={<Icon name="clock" size="md" />}
        title={t.samples.recentTitle}
        description={t.samples.recentDescription}
      />
    </Card>
  );
}
