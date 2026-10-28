import { useDocLocale } from "../../i18n/useDocLocale";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import type { NavGroup } from "../../registry/nav";
import { EntryCardGrid } from "./EntryCardGrid";

export interface CategoryPageProps {
  group: NavGroup;
}

export function CategoryPage({ group }: CategoryPageProps) {
  const locale = useDocLocale();

  return (
    <DocPage title={group.title[locale]} intro={group.description[locale]}>
      {group.categories.map((category) => (
        <DocSection key={category.title.en} title={category.title[locale]}>
          <EntryCardGrid entries={category.entries} />
        </DocSection>
      ))}
    </DocPage>
  );
}
