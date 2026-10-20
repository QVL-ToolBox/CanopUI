import { Card, CardGrid } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CardGrid } from "@canop/ui";`;

const basicCode = `<CardGrid>
  <Card title="Atlas" subtitle="Cartographie">
    Visualisation des territoires.
  </Card>
  <Card title="Nimbus" subtitle="Infrastructure">
    Orchestration des services cloud.
  </Card>
  <Card title="Prisme" subtitle="Analytique">
    Tableaux de bord temps réel.
  </Card>
  <Card title="Vega" subtitle="Observabilité">
    Traces et métriques unifiées.
  </Card>
</CardGrid>`;

const minWidthCode = `<CardGrid minItemWidth="12rem">
  <Card title="Atlas">Cartographie</Card>
  <Card title="Nimbus">Infrastructure</Card>
  <Card title="Prisme">Analytique</Card>
  <Card title="Vega">Observabilité</Card>
</CardGrid>`;

const columnsCode = `// Quatre tuiles, deux rangées de deux : jamais 3 + 1.
<CardGrid columns={{ sm: 2 }}>
  <Card title="Atlas">Cartographie</Card>
  <Card title="Nimbus">Infrastructure</Card>
  <Card title="Prisme">Analytique</Card>
  <Card title="Vega">Observabilité</Card>
</CardGrid>`;

const gapCode = `<CardGrid gap="xl">
  <Card title="Atlas">Cartographie</Card>
  <Card title="Nimbus">Infrastructure</Card>
  <Card title="Prisme">Analytique</Card>
</CardGrid>`;

const fr = {
  intro:
    "Grille responsive à colonnes automatiques. CardGrid répartit ses éléments sur autant de colonnes que la largeur disponible le permet, sans configuration de breakpoints.",
  sections: {
    usage: "Utilisation",
    minWidth: "Largeur minimale",
    columns: "Nombre de colonnes",
    gap: "Espacement",
    api: "API",
  },
  demos: {
    basic: {
      title: "Grille auto-fit",
      description:
        "Les éléments s'ajustent au conteneur : redimensionnez la fenêtre pour voir les colonnes se recomposer.",
    },
    minWidth: {
      title: "minItemWidth",
      description:
        "Réduire la largeur minimale autorise davantage de colonnes sur une même largeur.",
    },
    columns: {
      title: "columns",
      description:
        "En auto-fit, le nombre de colonnes n'est connu de personne : l'appelant ne peut que le déduire d'un calcul largeur ÷ minItemWidth, faux dès qu'une gouttière ou un panneau latéral change la largeur du conteneur — d'où la rangée orpheline classique, quatre tuiles rendues en 3 + 1. columns l'impose. Les points de rupture omis héritent du palier inférieur, et xs retombe sur la grille automatique : columns={{ sm: 2 }} se lit « auto-fit en dessous de sm, deux colonnes au-delà ».",
    },
    gap: {
      title: "gap",
      description: "gap contrôle l'écart entre les éléments selon l'échelle d'espacement du thème.",
    },
  },
  props: {
    minItemWidth:
      "Largeur minimale d'un élément avant retour à la ligne. Pilote le nombre de colonnes via une grille auto-fit. Sans effet là où columns impose un nombre.",
    columns:
      "Nombre de colonnes imposé, fixe ou par point de rupture. Sans lui, la grille reste en auto-fit.",
    gap: "Espacement entre les éléments, aligné sur l'échelle de spacing du thème.",
    children: "Éléments disposés dans la grille, généralement des cartes.",
  },
};

const en: typeof fr = {
  intro:
    "A responsive grid with automatic columns. CardGrid spreads its items across as many columns as the available width allows, with no breakpoint configuration.",
  sections: {
    usage: "Usage",
    minWidth: "Minimum width",
    columns: "Column count",
    gap: "Spacing",
    api: "API",
  },
  demos: {
    basic: {
      title: "Auto-fit grid",
      description:
        "Items adjust to the container: resize the window to watch the columns rearrange.",
    },
    minWidth: {
      title: "minItemWidth",
      description: "Lowering the minimum width allows more columns within the same width.",
    },
    columns: {
      title: "columns",
      description:
        "With auto-fit, nobody knows the column count: the caller can only infer it from a width ÷ minItemWidth computation, which breaks as soon as a gutter or a side panel changes the container width — hence the classic orphan row, four tiles laid out as 3 + 1. columns states it. Omitted breakpoints inherit from the lower step, and xs falls back to the automatic grid: columns={{ sm: 2 }} reads as “auto-fit below sm, two columns above”.",
    },
    gap: {
      title: "gap",
      description: "gap controls the space between items following the theme spacing scale.",
    },
  },
  props: {
    minItemWidth:
      "Minimum width of an item before wrapping. Drives the number of columns through an auto-fit grid. Ignored where columns states a count.",
    columns: "Stated column count, fixed or per breakpoint. Without it the grid stays in auto-fit.",
    gap: "Spacing between items, aligned with the theme spacing scale.",
    children: "Items laid out in the grid, usually cards.",
  },
};

const texts = { fr, en };

export default function CardGridDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "minItemWidth",
      type: "string",
      defaultValue: '"16rem"',
      description: t.props.minItemWidth,
    },
    {
      name: "columns",
      type: 'number | Partial<Record<"xs" | "sm" | "md" | "lg", number>>',
      defaultValue: "—",
      description: t.props.columns,
    },
    {
      name: "gap",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.gap,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
  ];

  return (
    <DocPage title="CardGrid" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={basicCode}
          align="stretch"
        >
          <CardGrid>
            <Card title="Atlas" subtitle="Cartographie">
              Visualisation des territoires.
            </Card>
            <Card title="Nimbus" subtitle="Infrastructure">
              Orchestration des services cloud.
            </Card>
            <Card title="Prisme" subtitle="Analytique">
              Tableaux de bord temps réel.
            </Card>
            <Card title="Vega" subtitle="Observabilité">
              Traces et métriques unifiées.
            </Card>
          </CardGrid>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.minWidth}>
        <DemoCard
          title={t.demos.minWidth.title}
          description={t.demos.minWidth.description}
          code={minWidthCode}
          align="stretch"
        >
          <CardGrid minItemWidth="12rem">
            <Card title="Atlas">Cartographie</Card>
            <Card title="Nimbus">Infrastructure</Card>
            <Card title="Prisme">Analytique</Card>
            <Card title="Vega">Observabilité</Card>
          </CardGrid>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.columns}>
        <DemoCard
          title={t.demos.columns.title}
          description={t.demos.columns.description}
          code={columnsCode}
          align="stretch"
        >
          <CardGrid columns={{ sm: 2 }}>
            <Card title="Atlas">Cartographie</Card>
            <Card title="Nimbus">Infrastructure</Card>
            <Card title="Prisme">Analytique</Card>
            <Card title="Vega">Observabilité</Card>
          </CardGrid>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.gap}>
        <DemoCard
          title={t.demos.gap.title}
          description={t.demos.gap.description}
          code={gapCode}
          align="stretch"
        >
          <CardGrid gap="xl">
            <Card title="Atlas">Cartographie</Card>
            <Card title="Nimbus">Infrastructure</Card>
            <Card title="Prisme">Analytique</Card>
          </CardGrid>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
