import { BulletList, Button, Icon } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { BulletList } from "@canop/ui";`;

const basicCode = `<BulletList
  items={[
    { key: "a", content: "Analyse du besoin" },
    { key: "b", content: "Conception de la maquette" },
    { key: "c", content: "Développement et recette" },
  ]}
/>`;

const actionCode = `<BulletList
  items={[
    {
      key: "spec",
      content: "Rédiger la spécification",
      action: <Button size="small" variant="secondary" startIcon={<Icon name="pencil" size="xs" />}>Éditer</Button>,
    },
    {
      key: "review",
      content: "Relire la documentation",
      action: <Button size="small" variant="secondary" startIcon={<Icon name="check" size="xs" />}>Valider</Button>,
    },
  ]}
/>`;

const fr = {
  intro:
    "Liste à puces personnalisée qui remplace le marqueur natif par une pastille à la couleur primaire. Chaque ligne peut porter une action alignée à droite.",
  sections: {
    basic: {
      title: "Usage de base",
      demoTitle: "Éléments à puces",
      demoDescription: "Chaque item associe une clé unique et un contenu React.",
    },
    action: {
      title: "Avec action",
      demoTitle: "Action en fin de ligne",
      demoDescription:
        "La propriété action affiche un nœud aligné à droite, sans décaler le contenu principal.",
    },
    api: "API",
    item: {
      title: "CanopBulletListItem",
      description: "Structure d'un élément de la liste à puces.",
    },
  },
  props: {
    items: "Liste des éléments à puces à afficher.",
    key: "Clé unique utilisée pour le rendu de la liste.",
    content: "Contenu principal affiché à droite de la puce.",
    action: "Élément optionnel aligné à la fin de la ligne, typiquement un bouton.",
  },
};

const en: typeof fr = {
  intro:
    "Custom bulleted list that replaces the native marker with a dot in the primary color. Each row can carry an action aligned to the right.",
  sections: {
    basic: {
      title: "Basic usage",
      demoTitle: "Bulleted items",
      demoDescription: "Each item pairs a unique key with React content.",
    },
    action: {
      title: "With action",
      demoTitle: "Action at the end of the row",
      demoDescription:
        "The action prop renders a node aligned to the right, without shifting the main content.",
    },
    api: "API",
    item: {
      title: "CanopBulletListItem",
      description: "Shape of a bulleted list item.",
    },
  },
  props: {
    items: "List of bulleted items to display.",
    key: "Unique key used to render the list.",
    content: "Main content displayed to the right of the bullet.",
    action: "Optional element aligned to the end of the row, typically a button.",
  },
};

const texts = { fr, en };

export default function BulletListDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "items",
      type: "CanopBulletListItem[]",
      required: true,
      description: t.props.items,
    },
  ];

  const itemRows: PropRow[] = [
    {
      name: "key",
      type: "string",
      required: true,
      description: t.props.key,
    },
    {
      name: "content",
      type: "ReactNode",
      required: true,
      description: t.props.content,
    },
    {
      name: "action",
      type: "ReactNode",
      description: t.props.action,
    },
  ];

  return (
    <DocPage title="BulletList" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic.title}>
        <DemoCard
          title={t.sections.basic.demoTitle}
          description={t.sections.basic.demoDescription}
          code={basicCode}
          align="stretch"
        >
          <BulletList
            items={[
              { key: "a", content: "Analyse du besoin" },
              { key: "b", content: "Conception de la maquette" },
              { key: "c", content: "Développement et recette" },
            ]}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.action.title}>
        <DemoCard
          title={t.sections.action.demoTitle}
          description={t.sections.action.demoDescription}
          code={actionCode}
          align="stretch"
        >
          <BulletList
            items={[
              {
                key: "spec",
                content: "Rédiger la spécification",
                action: (
                  <Button
                    size="small"
                    variant="secondary"
                    startIcon={<Icon name="pencil" size="xs" />}
                  >
                    Éditer
                  </Button>
                ),
              },
              {
                key: "review",
                content: "Relire la documentation",
                action: (
                  <Button
                    size="small"
                    variant="secondary"
                    startIcon={<Icon name="check" size="xs" />}
                  >
                    Valider
                  </Button>
                ),
              },
            ]}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
      <DocSection title={t.sections.item.title} description={t.sections.item.description}>
        <PropsTable rows={itemRows} />
      </DocSection>
    </DocPage>
  );
}
