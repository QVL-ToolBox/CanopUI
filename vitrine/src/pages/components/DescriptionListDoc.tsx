import { DescriptionList, Link, StatusChip } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { DescriptionList } from "@canop/ui";`;

const basicCode = `<DescriptionList
  items={[
    { label: "Nom", value: "Aurélie Martin" },
    { label: "Rôle", value: "Cheffe de projet" },
    { label: "Équipe", value: "Plateforme" },
  ]}
/>`;

const richValueCode = `<DescriptionList
  items={[
    { label: "Statut", value: <StatusChip tone="success" label="Actif" /> },
    { label: "Documentation", value: <Link href="#/docs/icones">Voir la galerie</Link> },
  ]}
/>`;

const emptyValueCode = `<DescriptionList
  items={[
    { label: "Adresse", value: "12 rue des Lilas" },
    { label: "Complément" },
    { label: "Téléphone", value: "" },
  ]}
/>`;

const fr = {
  intro:
    "Liste de définitions sémantique (dl / dt / dd) pour présenter des paires libellé / valeur. Chaque valeur accepte un nœud React quelconque et retombe sur un tiret lorsqu'elle est vide.",
  sections: {
    basic: {
      title: "Usage de base",
      demoTitle: "Paires libellé / valeur",
      demoDescription:
        "Fournissez un tableau d'items, chaque libellé s'affiche en gras au-dessus de sa valeur.",
    },
    rich: {
      title: "Valeurs riches",
      demoTitle: "Composants en valeur",
      demoDescription:
        "La propriété value accepte n'importe quel nœud React : chip de statut, lien, badge, etc.",
    },
    empty: {
      title: "Valeurs manquantes",
      demoTitle: "Repli automatique",
      demoDescription:
        "Une valeur absente, nulle ou vide est remplacée par un tiret pour préserver l'alignement.",
    },
    api: "API",
    item: {
      title: "CanopDescriptionItem",
      description: "Structure d'un item de la liste de définitions.",
    },
  },
  props: {
    items: "Liste des paires libellé / valeur à afficher.",
    label: "Libellé affiché en gras, sert de clé de rendu.",
    value: "Valeur associée. Un tiret (—) est affiché si elle est absente ou vide.",
  },
};

const en: typeof fr = {
  intro:
    "Semantic description list (dl / dt / dd) for presenting label / value pairs. Each value accepts any React node and falls back to a dash when empty.",
  sections: {
    basic: {
      title: "Basic usage",
      demoTitle: "Label / value pairs",
      demoDescription:
        "Provide an array of items; each label is displayed in bold above its value.",
    },
    rich: {
      title: "Rich values",
      demoTitle: "Components as values",
      demoDescription:
        "The value prop accepts any React node: status chip, link, badge, and so on.",
    },
    empty: {
      title: "Missing values",
      demoTitle: "Automatic fallback",
      demoDescription:
        "A missing, null or empty value is replaced with a dash to preserve alignment.",
    },
    api: "API",
    item: {
      title: "CanopDescriptionItem",
      description: "Shape of a description list item.",
    },
  },
  props: {
    items: "List of label / value pairs to display.",
    label: "Label displayed in bold, also used as the render key.",
    value: "Associated value. A dash (—) is shown when it is missing or empty.",
  },
};

const texts = { fr, en };

export default function DescriptionListDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "items",
      type: "CanopDescriptionItem[]",
      required: true,
      description: t.props.items,
    },
  ];

  const itemRows: PropRow[] = [
    {
      name: "label",
      type: "string",
      required: true,
      description: t.props.label,
    },
    {
      name: "value",
      type: "ReactNode",
      description: t.props.value,
    },
  ];

  return (
    <DocPage title="DescriptionList" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic.title}>
        <DemoCard
          title={t.sections.basic.demoTitle}
          description={t.sections.basic.demoDescription}
          code={basicCode}
          align="stretch"
        >
          <DescriptionList
            items={[
              { label: "Nom", value: "Aurélie Martin" },
              { label: "Rôle", value: "Cheffe de projet" },
              { label: "Équipe", value: "Plateforme" },
            ]}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.rich.title}>
        <DemoCard
          title={t.sections.rich.demoTitle}
          description={t.sections.rich.demoDescription}
          code={richValueCode}
          align="stretch"
        >
          <DescriptionList
            items={[
              { label: "Statut", value: <StatusChip tone="success" label="Actif" /> },
              { label: "Documentation", value: <Link href="#/docs/icones">Voir la galerie</Link> },
            ]}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.empty.title}>
        <DemoCard
          title={t.sections.empty.demoTitle}
          description={t.sections.empty.demoDescription}
          code={emptyValueCode}
          align="stretch"
        >
          <DescriptionList
            items={[
              { label: "Adresse", value: "12 rue des Lilas" },
              { label: "Complément" },
              { label: "Téléphone", value: "" },
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
