import { useDocLocale } from "../../i18n/useDocLocale";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { autoSkeletonTexts } from "./autoSkeleton/autoSkeletonTexts";
import { CardDemo } from "./autoSkeleton/CardDemo";
import { FullPageDemo } from "./autoSkeleton/FullPageDemo";
import { LoadControls } from "./autoSkeleton/LoadControls";
import { OptOutDemo } from "./autoSkeleton/OptOutDemo";
import { OverlayScopeDemo } from "./autoSkeleton/OverlayScopeDemo";
import { PageListDemo } from "./autoSkeleton/PageListDemo";
import { TableDemo } from "./autoSkeleton/TableDemo";
import { useSimulatedLoad } from "./autoSkeleton/useSimulatedLoad";

const importCode = `import { ContentSkeleton, SkeletonScope } from "@canop/ui";`;

const pageCode = `<PageContent title="Mes comptes">
  {loading ? (
    <Stack alignItems="center" padding="lg">
      <Spinner ariaLabel="Chargement des comptes" />
    </Stack>
  ) : (
    <ComptesList comptes={comptes} />
  )}
</PageContent>`;

const cardCode = `<Card title="Soldes consolidés">
  {loading ? <Spinner ariaLabel="Chargement des soldes" /> : <Soldes />}
</Card>`;

const tableCode = `<DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} loading={loading} />`;

const fullPageCode = `<PageContent>
  {loading ? <Spinner size="large" /> : <Dashboard />}
</PageContent>`;

const overlayCode = `<SkeletonScope surface={null}>
  {loading ? <Spinner ariaLabel="Chargement du panneau" /> : <Panneau />}
  <Card title="Soldes consolidés">{loading ? <Spinner /> : <Soldes />}</Card>
</SkeletonScope>`;

const optOutCode = `<PageContent skeleton={false}>…</PageContent>
<Spinner skeleton={false} />
<DataTable skeleton={false} loading={loading} … />
<PageScaffold skeleton={false} … />`;

export default function AutoSkeletonDoc() {
  const t = autoSkeletonTexts[useDocLocale()];
  const load = useSimulatedLoad("1500");

  const contentSkeletonRows: PropRow[] = [
    {
      name: "shape",
      type: '"card" | "list" | "page"',
      required: true,
      description: t.props.shape,
    },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
  ];

  const skeletonScopeRows: PropRow[] = [
    { name: "surface", type: '"page" | "card" | null', description: t.props.surface },
    { name: "enabled", type: "boolean", defaultValue: "true", description: t.props.enabled },
    { name: "children", type: "ReactNode", required: true, description: t.props.children },
  ];

  return (
    <DocPage title={t.title} intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.simulation} description={t.controls.description}>
        <LoadControls load={load} t={t.controls} />
      </DocSection>
      <DocSection title={t.sections.page}>
        <DemoCard
          title={t.demos.pageTitle}
          description={t.demos.pageDescription}
          code={pageCode}
          align="stretch"
        >
          <PageListDemo loading={load.loading} t={t.sample} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.card}>
        <DemoCard
          title={t.demos.cardTitle}
          description={t.demos.cardDescription}
          code={cardCode}
          align="stretch"
        >
          <CardDemo loading={load.loading} t={t.sample} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.table}>
        <DemoCard
          title={t.demos.tableTitle}
          description={t.demos.tableDescription}
          code={tableCode}
          align="stretch"
        >
          <TableDemo loading={load.loading} t={t.sample.columns} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fullPage}>
        <DemoCard
          title={t.demos.fullPageTitle}
          description={t.demos.fullPageDescription}
          code={fullPageCode}
          align="stretch"
        >
          <FullPageDemo loading={load.loading} t={t.sample} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.overlay}>
        <DemoCard
          title={t.demos.overlayTitle}
          description={t.demos.overlayDescription}
          code={overlayCode}
          align="stretch"
        >
          <OverlayScopeDemo loading={load.loading} t={t.sample} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.optOut}>
        <DemoCard
          title={t.demos.optOutTitle}
          description={t.demos.optOutDescription}
          code={optOutCode}
          align="stretch"
        >
          <OptOutDemo loading={load.loading} t={t.sample} />
          <TableDemo loading={load.loading} skeleton={false} t={t.sample.columns} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable title="ContentSkeleton" rows={contentSkeletonRows} />
        <PropsTable title="SkeletonScope" rows={skeletonScopeRows} />
      </DocSection>
    </DocPage>
  );
}
