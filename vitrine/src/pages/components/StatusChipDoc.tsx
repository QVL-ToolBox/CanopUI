import { StatusChip } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { StatusChip } from "@canop/ui";`;

const tonesCode = `<StatusChip tone="success" label="Actif" />
<StatusChip tone="warning" label="En attente" />
<StatusChip tone="error" label="Erreur" />
<StatusChip tone="info" label="Information" />
<StatusChip tone="neutral" label="Brouillon" />`;

const sizesCode = `<StatusChip tone="success" label="Petit" size="small" />
<StatusChip tone="success" label="Moyen" size="medium" />`;

const fr = {
  intro:
    "Pastille de statut sémantique. Cinq tonalités mappées sur les couleurs du thème pour signaler l'état d'une donnée ou d'une entité en un coup d'œil.",
  sections: {
    tones: {
      title: "Tonalités",
      demoTitle: "Cinq intentions",
      demoDescription:
        "Chaque tonalité reprend une couleur sémantique du thème : succès, avertissement, erreur, information et neutre.",
    },
    sizes: {
      title: "Tailles",
      demoTitle: "small et medium",
    },
    api: "API",
  },
  props: {
    label: "Texte affiché dans la pastille.",
    tone: "Intention sémantique qui pilote la couleur de la pastille.",
    size: "Taille de la pastille.",
  },
};

const en: typeof fr = {
  intro:
    "Semantic status chip. Five tones mapped to the theme colors to signal the state of a piece of data or an entity at a glance.",
  sections: {
    tones: {
      title: "Tones",
      demoTitle: "Five intents",
      demoDescription:
        "Each tone uses a semantic theme color: success, warning, error, info and neutral.",
    },
    sizes: {
      title: "Sizes",
      demoTitle: "small and medium",
    },
    api: "API",
  },
  props: {
    label: "Text displayed inside the chip.",
    tone: "Semantic intent that drives the color of the chip.",
    size: "Size of the chip.",
  },
};

const texts = { fr, en };

export default function StatusChipDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "label",
      type: "string",
      required: true,
      description: t.props.label,
    },
    {
      name: "tone",
      type: '"success" | "warning" | "error" | "info" | "neutral"',
      defaultValue: '"neutral"',
      description: t.props.tone,
    },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"small"',
      description: t.props.size,
    },
  ];

  return (
    <DocPage title="StatusChip" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.tones.title}>
        <DemoCard
          title={t.sections.tones.demoTitle}
          description={t.sections.tones.demoDescription}
          code={tonesCode}
        >
          <StatusChip tone="success" label="Actif" />
          <StatusChip tone="warning" label="En attente" />
          <StatusChip tone="error" label="Erreur" />
          <StatusChip tone="info" label="Information" />
          <StatusChip tone="neutral" label="Brouillon" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes.title}>
        <DemoCard title={t.sections.sizes.demoTitle} code={sizesCode}>
          <StatusChip tone="success" label="Petit" size="small" />
          <StatusChip tone="success" label="Moyen" size="medium" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
