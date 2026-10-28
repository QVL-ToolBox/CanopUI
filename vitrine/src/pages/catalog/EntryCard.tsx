import { Card, Text } from "@canop/ui";
import { routeHref } from "../../router/routes";

export interface EntryCardProps {
  title: string;
  description: string;
  path: string;
}

export function EntryCard({ title, description, path }: EntryCardProps) {
  return (
    <Card variant="interactive" arrow fill title={title} href={routeHref(path)}>
      <Text variant="body-sm" tone="muted">
        {description}
      </Text>
    </Card>
  );
}
