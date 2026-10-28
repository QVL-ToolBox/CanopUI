import { useDocLocale } from "../../i18n/useDocLocale";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { componentGroups, groupEntries } from "../../registry/nav";
import { EntryCardGrid } from "../catalog/EntryCardGrid";

const labels = {
  fr: {
    title: "Composants",
    intro:
      "Tous les composants du design system, documentés avec démos interactives, code source et référence complète des props.",
  },
  en: {
    title: "Components",
    intro:
      "All design system components, documented with interactive demos, source code and a complete props reference.",
  },
};

export function ComponentsIndexPage() {
  const locale = useDocLocale();
  const t = labels[locale];

  return (
    <DocPage title={t.title} intro={t.intro}>
      {componentGroups.map((group) => (
        <DocSection
          key={group.id}
          title={group.title[locale]}
          description={group.description[locale]}
        >
          <EntryCardGrid entries={groupEntries(group)} />
        </DocSection>
      ))}
    </DocPage>
  );
}
