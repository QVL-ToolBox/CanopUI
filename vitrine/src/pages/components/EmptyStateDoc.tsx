import Stack from "@mui/material/Stack";
import { Button, EmptyState, Icon } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { EmptyCardDemo } from "./emptyStateDoc/EmptyCardDemo";
import { emptyStateTexts } from "./emptyStateDoc/emptyStateTexts";
import { EmptyTableDemo } from "./emptyStateDoc/EmptyTableDemo";
import { FullPageDemo } from "./emptyStateDoc/FullPageDemo";
import { GlassBackdrop } from "./emptyStateDoc/GlassBackdrop";
import { ModeStage } from "./emptyStateDoc/ModeStage";

const importCode = `import { EmptyState } from "@canop/ui";`;

const usageCode = `<EmptyState
  icon={<Icon name="folder" size="xl" />}
  title="Aucun document"
  description="Importez votre premier fichier pour le retrouver ici."
  action={<Button startIcon={<Icon name="upload" size="xs" />}>Importer</Button>}
/>`;

const cardCode = `<Card title="Documents récents">
  <EmptyState
    size="sm"
    surface="plain"
    headingLevel={4}
    icon={<Icon name="clock" size="md" />}
    title="Rien de récent"
    description="Les documents ouverts cette semaine apparaîtront ici."
  />
</Card>`;

const tableCode = `<DataTable
  columns={columns}
  rows={[]}
  getRowKey={(row) => row.id}
  fixedLayout
  emptyMessage={
    <EmptyState
      size="sm"
      surface="plain"
      headingLevel={3}
      icon={<Icon name="wallet" size="md" />}
      title="Aucune opération"
      description="Les opérations du compte s'afficheront dès la première synchronisation."
      action={<Button variant="tonal" size="small">Synchroniser</Button>}
    />
  }
/>`;

const pageCode = `<EmptyState
  size="lg"
  icon={<Icon name="folder" size="xl" />}
  title="Votre espace est prêt"
  description="Créez un premier projet pour inviter votre équipe, partager des fichiers et suivre l'avancement."
  action={<Button startIcon={<Icon name="plus" size="xs" />}>Créer un projet</Button>}
/>`;

const modesCode = `<EmptyState
  icon={<Icon name="folder" size="xl" />}
  title="Aucun document"
  description="Importez votre premier fichier pour le retrouver ici."
/>`;

const plainCode = `<EmptyState
  surface="plain"
  icon={<Icon name="search" size="xl" />}
  title="Aucun résultat"
  description="Aucun élément ne correspond à votre recherche."
/>`;

const minimalCode = `<EmptyState title="Boîte de réception vide" description="Vous êtes à jour." />`;

export default function EmptyStateDoc() {
  const t = emptyStateTexts[useDocLocale()];
  const sample = t.samples;

  const propRows: PropRow[] = [
    { name: "title", type: "string", required: true, description: t.props.title },
    { name: "description", type: "ReactNode", description: t.props.description },
    { name: "icon", type: "ReactNode", description: t.props.icon },
    { name: "action", type: "ReactNode", description: t.props.action },
    {
      name: "headingLevel",
      type: "1 | 2 | 3 | 4",
      defaultValue: "2",
      description: t.props.headingLevel,
    },
    { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: t.props.size },
    { name: "minHeight", type: "string", description: t.props.minHeight },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
    {
      name: "surface",
      type: '"ambient" | "plain"',
      defaultValue: '"ambient"',
      description: t.props.surface,
    },
  ];

  const documents = (
    <EmptyState
      icon={<Icon name="folder" size="xl" />}
      title={sample.documentsTitle}
      description={sample.documentsDescription}
    />
  );

  return (
    <DocPage title="EmptyState" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usage.title}
          description={t.demos.usage.description}
          code={usageCode}
          align="stretch"
        >
          <GlassBackdrop height="30rem">
            <EmptyState
              icon={<Icon name="folder" size="xl" />}
              title={sample.documentsTitle}
              description={sample.documentsDescription}
              action={
                <Button startIcon={<Icon name="upload" size="xs" />}>{sample.importLabel}</Button>
              }
            />
          </GlassBackdrop>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.context}>
        <DemoCard
          title={t.demos.card.title}
          description={t.demos.card.description}
          code={cardCode}
          align="stretch"
        >
          <EmptyCardDemo t={t} />
        </DemoCard>
        <DemoCard
          title={t.demos.table.title}
          description={t.demos.table.description}
          code={tableCode}
          align="stretch"
        >
          <EmptyTableDemo t={t} />
        </DemoCard>
        <DemoCard
          title={t.demos.page.title}
          description={t.demos.page.description}
          code={pageCode}
          align="stretch"
        >
          <FullPageDemo t={t} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.modes}>
        <DemoCard
          title={t.demos.modes.title}
          description={t.demos.modes.description}
          code={modesCode}
          align="stretch"
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <ModeStage mode="light">{documents}</ModeStage>
            <ModeStage mode="dark">{documents}</ModeStage>
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.plain}>
        <DemoCard
          title={t.demos.plain.title}
          description={t.demos.plain.description}
          code={plainCode}
          align="stretch"
        >
          <EmptyState
            surface="plain"
            icon={<Icon name="search" size="xl" />}
            title={sample.searchTitle}
            description={sample.searchDescription}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.minimal}>
        <DemoCard
          title={t.demos.minimal.title}
          description={t.demos.minimal.description}
          code={minimalCode}
          align="stretch"
        >
          <GlassBackdrop height="24rem">
            <EmptyState title={sample.inboxTitle} description={sample.inboxDescription} />
          </GlassBackdrop>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
