import { Button, EmptyState, Icon } from "@canop/ui";
import type { EmptyStateTexts } from "./emptyStateTexts";
import { GlassBackdrop } from "./GlassBackdrop";

export interface FullPageDemoProps {
  t: EmptyStateTexts;
}

export function FullPageDemo({ t }: FullPageDemoProps) {
  return (
    <GlassBackdrop height="38rem" animated>
      <EmptyState
        size="lg"
        headingLevel={3}
        icon={<Icon name="folder" size="xl" />}
        title={t.samples.pageTitle}
        description={t.samples.pageDescription}
        action={<Button startIcon={<Icon name="plus" size="xs" />}>{t.samples.createLabel}</Button>}
      />
    </GlassBackdrop>
  );
}
