import { CardGrid } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import type { NavEntry } from "../../registry/nav";
import { EntryCard } from "./EntryCard";

export interface EntryCardGridProps {
  entries: NavEntry[];
}

export function EntryCardGrid({ entries }: EntryCardGridProps) {
  const locale = useDocLocale();

  return (
    <CardGrid minItemWidth="15rem" gap="md">
      {entries.map((entry) => (
        <EntryCard
          key={entry.path}
          title={entry.title[locale]}
          description={entry.description[locale]}
          path={entry.path}
        />
      ))}
    </CardGrid>
  );
}
