import { useId, type ReactNode } from "react";
import { Heading, Stack, Text } from "@canop/ui";

export interface DocSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function DocSection({ title, description, children }: DocSectionProps) {
  const sectionId = useId();

  return (
    <Stack as="section" gap="sm" data-doc-section={sectionId}>
      <Heading level={2} size={{ xs: 5, md: 4 }} gutterBottom={false}>
        {title}
      </Heading>
      {description ? <Text tone="muted">{description}</Text> : null}
      {children ? <Stack gap="lg">{children}</Stack> : null}
    </Stack>
  );
}
