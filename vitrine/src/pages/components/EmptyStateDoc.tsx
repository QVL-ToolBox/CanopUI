import { Button, EmptyState, Icon } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { EmptyState } from "@canop/ui";`;

const ambientCode = `<EmptyState
  icon={<Icon name="folder" size="xl" color="accent" />}
  title="Aucun document"
  description="Importez votre premier fichier pour le retrouver ici."
  action={<Button startIcon={<Icon name="upload" size="xs" />}>Importer</Button>}
/>`;

const plainCode = `<EmptyState
  surface="plain"
  icon={<Icon name="search" size="xl" color="secondary" />}
  title="Aucun résultat"
  description="Aucun élément ne correspond à votre recherche."
/>`;

const minimalCode = `<EmptyState title="Boîte de réception vide" description="Vous êtes à jour." />`;

const fr = {
  intro:
    "État vide illustré pour signaler l'absence de contenu et guider l'utilisateur vers l'action suivante. Titre, description, icône et action optionnels, sur un fond ambiant à formes organiques ou une surface plate.",
  sections: {
    ambient: "Surface ambiante",
    plain: "Surface plate",
    minimal: "Minimal",
    api: "API",
  },
  demos: {
    ambientTitle: "Icône, description et action",
    ambientDescription:
      "Par défaut, l'état vide s'affiche sur un arrière-plan ambiant à formes organiques et anime son apparition.",
    plainTitle: "surface plain",
    plainDescription:
      'surface="plain" retire le décor ambiant pour un fond neutre, adapté aux zones déjà denses.',
    minimalTitle: "Titre et description seuls",
    minimalDescription: "Sans icône ni action, l'état vide se réduit à son message.",
  },
  props: {
    title: "Titre principal de l'état vide.",
    description: "Texte explicatif affiché sous le titre.",
    icon: "Illustration ou icône affichée au-dessus du titre.",
    action: "Action principale, typiquement un bouton, affichée sous la description.",
    headingLevel: "Niveau sémantique du titre (h1 à h4).",
    minHeight: "Hauteur minimale de la zone (valeur CSS).",
    animated: "Active l'animation d'apparition (désactivée si mouvement réduit).",
    surface: "Type de fond : ambiant à formes organiques ou plat.",
  },
};

const en: typeof fr = {
  intro:
    "An illustrated empty state to signal the absence of content and guide the user to the next action. Optional title, description, icon and action, on an ambient organic-shaped background or a plain surface.",
  sections: {
    ambient: "Ambient surface",
    plain: "Plain surface",
    minimal: "Minimal",
    api: "API",
  },
  demos: {
    ambientTitle: "Icon, description and action",
    ambientDescription:
      "By default, the empty state renders on an ambient organic-shaped background and animates its appearance.",
    plainTitle: "plain surface",
    plainDescription:
      'surface="plain" removes the ambient decor for a neutral background, suited to already dense areas.',
    minimalTitle: "Title and description only",
    minimalDescription: "Without an icon or action, the empty state boils down to its message.",
  },
  props: {
    title: "Main title of the empty state.",
    description: "Explanatory text displayed below the title.",
    icon: "Illustration or icon displayed above the title.",
    action: "Primary action, typically a button, displayed below the description.",
    headingLevel: "Semantic level of the title (h1 to h4).",
    minHeight: "Minimum height of the area (CSS value).",
    animated: "Enables the appearance animation (disabled under reduced motion).",
    surface: "Background type: ambient organic shapes or plain.",
  },
};

const texts = { fr, en };

export default function EmptyStateDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "title", type: "string", required: true, description: t.props.title },
    { name: "description", type: "string", description: t.props.description },
    { name: "icon", type: "ReactNode", description: t.props.icon },
    { name: "action", type: "ReactNode", description: t.props.action },
    {
      name: "headingLevel",
      type: "1 | 2 | 3 | 4",
      defaultValue: "2",
      description: t.props.headingLevel,
    },
    { name: "minHeight", type: "string", defaultValue: '"22rem"', description: t.props.minHeight },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
    {
      name: "surface",
      type: '"ambient" | "plain"',
      defaultValue: '"ambient"',
      description: t.props.surface,
    },
  ];

  return (
    <DocPage title="EmptyState" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.ambient}>
        <DemoCard
          title={t.demos.ambientTitle}
          description={t.demos.ambientDescription}
          code={ambientCode}
          align="stretch"
        >
          <EmptyState
            icon={<Icon name="folder" size="xl" color="accent" />}
            title="Aucun document"
            description="Importez votre premier fichier pour le retrouver ici."
            action={<Button startIcon={<Icon name="upload" size="xs" />}>Importer</Button>}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.plain}>
        <DemoCard
          title={t.demos.plainTitle}
          description={t.demos.plainDescription}
          code={plainCode}
          align="stretch"
        >
          <EmptyState
            surface="plain"
            icon={<Icon name="search" size="xl" color="secondary" />}
            title="Aucun résultat"
            description="Aucun élément ne correspond à votre recherche."
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.minimal}>
        <DemoCard
          title={t.demos.minimalTitle}
          description={t.demos.minimalDescription}
          code={minimalCode}
          align="stretch"
        >
          <EmptyState title="Boîte de réception vide" description="Vous êtes à jour." />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
