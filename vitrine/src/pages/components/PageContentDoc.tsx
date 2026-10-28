import { Card, PageContent } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DemoScreen } from "../../kit/DemoScreen";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { PageContent } from "@canop/ui";`;

const SCREEN_HEIGHT = "26rem";

const basicCode = `<PageContent title="Documents">
  <Card>Premier document.</Card>
  <Card>Deuxième document.</Card>
  <Card>Troisième document.</Card>
</PageContent>`;

const centerCode = `<PageContent title="Bienvenue" align="center">
  <Card>Contenu aligné au centre.</Card>
</PageContent>`;

const fillHeightCode = `<PageContent fillHeight>
  <Card fill>Contenu occupant toute la hauteur disponible.</Card>
</PageContent>`;

const fr = {
  intro:
    "Zone de contenu principale d'une page applicative. Elle gère le titre de section, le défilement vertical stylé, l'alignement et les modes plein écran, et garde son dernier élément au-dessus de la barre de navigation mobile. Utilisée conjointement avec PageScaffold.",
  sections: {
    basic: "Usage de base",
    align: "Alignement",
    fillHeight: "Pleine hauteur",
    api: "API",
  },
  demos: {
    basic: {
      title: "Contenu défilant",
      description:
        "Le contenu s'empile verticalement et défile lorsqu'il dépasse la hauteur disponible.",
    },
    align: {
      title: "align center",
      description: "Centre horizontalement le contenu de la page.",
    },
    fillHeight: {
      title: "fillHeight",
      description:
        "Le contenu occupe toute la hauteur disponible sans défilement interne, idéal pour une carte ou un tableau plein écran.",
    },
  },
  props: {
    maxWidth:
      "Largeur maximale de la zone de contenu. full la laisse occuper toute la place disponible.",
    title: "Titre de section affiché en tête de la zone de contenu.",
    footer: "Contenu affiché à la suite des enfants, en bas de la zone de contenu.",
    align: "Alignement horizontal du contenu.",
    fillHeight:
      "Fait occuper au contenu toute la hauteur disponible sans défilement interne, utile pour un tableau ou une carte plein écran.",
    hugContent: "Ajuste la zone à la hauteur de son contenu plutôt que de remplir l'espace.",
    children: "Contenu de la page, disposé dans un Stack vertical.",
    skeleton:
      "Change les Spinner et les DataTable en chargement de la page en squelettes de contenu. false garde les Spinner et le chargement d'origine pour tout ce que la page contient. Le footer n'est pas concerné.",
  },
};

const en: typeof fr = {
  intro:
    "Main content area of an application page. It handles the section title, styled vertical scrolling, alignment and full-screen modes, and keeps its last element above the mobile navigation bar. Used together with PageScaffold.",
  sections: {
    basic: "Basic usage",
    align: "Alignment",
    fillHeight: "Full height",
    api: "API",
  },
  demos: {
    basic: {
      title: "Scrollable content",
      description: "Content stacks vertically and scrolls when it exceeds the available height.",
    },
    align: {
      title: "align center",
      description: "Horizontally centers the page content.",
    },
    fillHeight: {
      title: "fillHeight",
      description:
        "Content fills the full available height without inner scrolling, ideal for a full-screen card or table.",
    },
  },
  props: {
    maxWidth: "Maximum width of the content area. full lets it take all the room available.",
    title: "Section title shown at the top of the content area.",
    footer: "Content shown after the children, at the bottom of the content area.",
    align: "Horizontal alignment of the content.",
    fillHeight:
      "Makes the content fill the full available height without inner scrolling, useful for a full-screen table or card.",
    hugContent: "Fits the area to the height of its content rather than filling the space.",
    children: "Page content, laid out in a vertical Stack.",
    skeleton:
      "Turns the page's Spinners and loading DataTables into content skeletons. false keeps the Spinners and the original loading state for everything the page contains. The footer is not affected.",
  },
};

const texts = { fr, en };

export default function PageContentDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "title",
      type: "string",
      description: t.props.title,
    },
    {
      name: "footer",
      type: "ReactNode",
      description: t.props.footer,
    },
    {
      name: "align",
      type: '"left" | "center"',
      defaultValue: '"left"',
      description: t.props.align,
    },
    {
      name: "fillHeight",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fillHeight,
    },
    {
      name: "hugContent",
      type: "boolean",
      defaultValue: "false",
      description: t.props.hugContent,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "maxWidth",
      type: '"sm" | "md" | "lg" | "full"',
      defaultValue: '"lg"',
      description: t.props.maxWidth,
    },
    {
      name: "skeleton",
      type: "boolean",
      defaultValue: "true",
      description: t.props.skeleton,
    },
  ];

  return (
    <DocPage title="PageContent" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={basicCode}
          align="stretch"
        >
          <DemoScreen height={SCREEN_HEIGHT}>
            <PageContent title="Documents">
              <Card>Premier document.</Card>
              <Card>Deuxième document.</Card>
              <Card>Troisième document.</Card>
            </PageContent>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.align}>
        <DemoCard
          title={t.demos.align.title}
          description={t.demos.align.description}
          code={centerCode}
          align="stretch"
        >
          <DemoScreen height={SCREEN_HEIGHT}>
            <PageContent title="Bienvenue" align="center">
              <Card>Contenu aligné au centre.</Card>
            </PageContent>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fillHeight}>
        <DemoCard
          title={t.demos.fillHeight.title}
          description={t.demos.fillHeight.description}
          code={fillHeightCode}
          align="stretch"
        >
          <DemoScreen height={SCREEN_HEIGHT}>
            <PageContent fillHeight>
              <Card fill>Contenu occupant toute la hauteur disponible.</Card>
            </PageContent>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
