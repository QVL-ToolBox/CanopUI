import Box from "@mui/material/Box";
import { Card, Link, PageContent, PageScaffold } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { useHiddenSeasonalDecor } from "../../season/useHiddenSeasonalDecor";

const importCode = `import { PageScaffold } from "@canop/ui";`;

const basicCode = `<Box height="40rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <PageScaffold
    navbarTitle="MonPortail"
    activeHref="/tableau-de-bord"
    items={[
      { label: "Tableau de bord", icon: "home", href: "/tableau-de-bord" },
      { label: "Documents", icon: "file", href: "/documents" },
      { label: "Paramètres", icon: "settings", href: "/parametres" },
    ]}
    userName="Aurélie Martin"
  >
    <PageContent>
      <Card title="Bienvenue">Contenu principal de la page courante.</Card>
    </PageContent>
  </PageScaffold>
</Box>`;

const titleFooterCode = `<Box height="40rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <PageScaffold
    title="Espace client"
    activeHref="/documents"
    items={[
      { label: "Tableau de bord", icon: "home", href: "/tableau-de-bord" },
      { label: "Documents", icon: "file", href: "/documents" },
      { label: "Paramètres", icon: "settings", href: "/parametres" },
    ]}
    userName="Aurélie Martin"
    supportHref="/signaler-un-bug"
    footer={
      <>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/cgu">Conditions d’utilisation</Link>
      </>
    }
  >
    <PageContent>
      <Card>Consultez et déposez vos documents.</Card>
    </PageContent>
  </PageScaffold>
</Box>`;

const fr = {
  intro:
    "Gabarit d'application complet : barre de navigation responsive, en-tête de page, zone de contenu défilante et pied de page. Il orchestre le Navbar et accueille un PageContent pour construire un écran applicatif en quelques props.",
  sections: {
    basic: "Usage de base",
    titleFooter: "Titre et pied de page",
    api: "API",
  },
  demos: {
    basic: {
      title: "Écran applicatif",
      description:
        "Fournissez les items de navigation et un PageContent ; l'élément actif est déduit d'activeHref.",
    },
    titleFooter: {
      title: "title et footer",
      description:
        "title alimente l'en-tête de la zone de contenu, footer un pied de page centré en bas d'écran.",
    },
  },
  props: {
    subtitle: "Ligne de précision sous le titre de page.",
    headerActions: "Actions de l'en-tête de page, dont actionsPlacement décide de la place.",
    height:
      "Hauteur de l'ossature, transmise à la Navbar. À réduire quand la page est posée dans un cadre plutôt que dans la fenêtre.",
    items: "Éléments de navigation affichés dans la barre latérale ou la barre mobile.",
    title: "Titre principal de la page, affiché dans l'en-tête de la zone de contenu.",
    navbarTitle: "Titre affiché en haut de la barre de navigation.",
    navbarTitleLevel:
      "Niveau sémantique du titre de la barre, transmis à Navbar en titleLevel. Le titre de page étant déjà un h1, préférez 2 ou « text ».",
    activeHref:
      "Route active, utilisée pour surligner l'élément courant et en déduire le sous-titre de page.",
    onNavigate: "Handler appelé lors de la sélection d'un élément de navigation.",
    userName: "Nom de l'utilisateur affiché dans la navigation.",
    onLogout: "Handler appelé lors de la déconnexion.",
    footer: "Pied de page affiché en bas de l'écran (et dans la barre latérale sur mobile).",
    settingsFooter: "Contenu additionnel affiché dans le menu des paramètres sur mobile.",
    sidebarWidget: "Widget libre inséré dans la barre latérale de navigation.",
    infoHref: "Lien d'information exposé dans la navigation.",
    supportHref:
      "Lien vers la page de signalement de bug. Ajouté à la suite du footer sur grand écran, basculé dans la barre de réglages en mobile.",
    mobileFooterPlacement:
      "Emplacement du pied de page sur mobile : flottant au-dessus du contenu ou intégré aux paramètres.",
    actionsPlacement:
      "Emplacement des headerActions : dans l'en-tête, ou empilées dans le coin haut droit de la coquille — sous le bouton des réglages en mobile, sous le sélecteur de langue en tablette et bureau. Réservé à des actions à la taille d'une icône.",
    background:
      "Fond de la zone de contenu : la canopée animée par défaut, ou l'ancien fond de formes organiques. En saison, le décor saisonnier du CanopThemeProvider se pose par-dessus ce fond, sous le contenu ; il est masqué sur cette page pour garder les démos lisibles.",
    children: "Contenu principal de la page, typiquement un PageContent.",
  },
};

const en: typeof fr = {
  intro:
    "Complete application template: responsive navigation bar, page header, scrollable content area and footer. It orchestrates the Navbar and hosts a PageContent to build an application screen in a few props.",
  sections: {
    basic: "Basic usage",
    titleFooter: "Title and footer",
    api: "API",
  },
  demos: {
    basic: {
      title: "Application screen",
      description:
        "Provide the navigation items and a PageContent; the active item is inferred from activeHref.",
    },
    titleFooter: {
      title: "title and footer",
      description:
        "title feeds the content area header, footer a centered footer at the bottom of the screen.",
    },
  },
  props: {
    subtitle: "Clarifying line below the page title.",
    headerActions: "Page header actions, whose position actionsPlacement decides.",
    height:
      "Height of the frame, passed on to the Navbar. Lower it when the page sits inside a container rather than the viewport.",
    items: "Navigation items shown in the sidebar or the mobile bar.",
    title: "Main page title, shown in the content area header.",
    navbarTitle: "Title shown at the top of the navigation bar.",
    navbarTitleLevel:
      "Semantic level of the bar title, passed to Navbar as titleLevel. The page title already being an h1, prefer 2 or “text”.",
    activeHref:
      "Active route, used to highlight the current item and derive the page subtitle from it.",
    onNavigate: "Handler called when a navigation item is selected.",
    userName: "User name shown in the navigation.",
    onLogout: "Handler called on logout.",
    footer: "Footer shown at the bottom of the screen (and in the sidebar on mobile).",
    settingsFooter: "Additional content shown in the settings menu on mobile.",
    sidebarWidget: "Free-form widget inserted into the navigation sidebar.",
    infoHref: "Information link exposed in the navigation.",
    supportHref:
      "Link to the bug report page. Appended after the footer on wide screens, moved into the settings bar on mobile.",
    mobileFooterPlacement:
      "Footer placement on mobile: floating above the content or embedded in the settings.",
    actionsPlacement:
      "headerActions placement: inside the header, or stacked in the shell's top-right corner — under the settings button on mobile, under the language selector on tablet and desktop. Meant for icon-sized actions.",
    background:
      "Background of the content area: the animated canopy by default, or the former organic-shape background. In season, the CanopThemeProvider seasonal decor sits on top of this background, under the content; it is hidden on this page to keep the demos readable.",
    children: "Main page content, typically a PageContent.",
  },
};

const texts = { fr, en };

export default function PageScaffoldDoc() {
  const t = texts[useDocLocale()];
  useHiddenSeasonalDecor();
  const propRows: PropRow[] = [
    {
      name: "items",
      type: "CanopNavbarItem[]",
      required: true,
      description: t.props.items,
    },
    {
      name: "title",
      type: "string",
      description: t.props.title,
    },
    {
      name: "navbarTitle",
      type: "string",
      description: t.props.navbarTitle,
    },
    {
      name: "navbarTitleLevel",
      type: '1 | 2 | 3 | 4 | "text"',
      defaultValue: "1",
      description: t.props.navbarTitleLevel,
    },
    {
      name: "activeHref",
      type: "string",
      description: t.props.activeHref,
    },
    {
      name: "onNavigate",
      type: "(href: string) => void",
      description: t.props.onNavigate,
    },
    {
      name: "userName",
      type: "string",
      description: t.props.userName,
    },
    {
      name: "onLogout",
      type: "() => void",
      description: t.props.onLogout,
    },
    {
      name: "footer",
      type: "ReactNode",
      description: t.props.footer,
    },
    {
      name: "settingsFooter",
      type: "ReactNode",
      description: t.props.settingsFooter,
    },
    {
      name: "sidebarWidget",
      type: "ReactNode",
      description: t.props.sidebarWidget,
    },
    {
      name: "supportHref",
      type: "string",
      description: t.props.supportHref,
    },
    {
      name: "infoHref",
      type: "string",
      description: t.props.infoHref,
    },
    {
      name: "mobileFooterPlacement",
      type: '"floating" | "settings"',
      defaultValue: '"floating"',
      description: t.props.mobileFooterPlacement,
    },
    {
      name: "actionsPlacement",
      type: '"header" | "floating"',
      defaultValue: '"header"',
      description: t.props.actionsPlacement,
    },
    {
      name: "background",
      type: '"canopy" | "shapes"',
      defaultValue: '"canopy"',
      description: t.props.background,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    { name: "subtitle", type: "string", description: t.props.subtitle },
    { name: "headerActions", type: "ReactNode", description: t.props.headerActions },
    { name: "height", type: "string", defaultValue: '"100dvh"', description: t.props.height },
  ];

  return (
    <DocPage title="PageScaffold" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={basicCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                height: "40rem",
                width: "100%",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <PageScaffold
              height="100%"
              navbarTitle="MonPortail"
              activeHref="/tableau-de-bord"
              items={[
                { label: "Tableau de bord", icon: "home", href: "/tableau-de-bord" },
                { label: "Documents", icon: "file", href: "/documents" },
                { label: "Paramètres", icon: "settings", href: "/parametres" },
              ]}
              userName="Aurélie Martin"
            >
              <PageContent>
                <Card title="Bienvenue">Contenu principal de la page courante.</Card>
              </PageContent>
            </PageScaffold>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.titleFooter}>
        <DemoCard
          title={t.demos.titleFooter.title}
          description={t.demos.titleFooter.description}
          code={titleFooterCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                height: "40rem",
                width: "100%",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <PageScaffold
              height="100%"
              title="Espace client"
              activeHref="/documents"
              items={[
                { label: "Tableau de bord", icon: "home", href: "/tableau-de-bord" },
                { label: "Documents", icon: "file", href: "/documents" },
                { label: "Paramètres", icon: "settings", href: "/parametres" },
              ]}
              userName="Aurélie Martin"
              supportHref="#"
              footer={
                <>
                  <Link href="#" size="small" color="muted">
                    Mentions légales
                  </Link>
                  <Link href="#" size="small" color="muted">
                    Conditions d’utilisation
                  </Link>
                </>
              }
            >
              <PageContent>
                <Card>Consultez et déposez vos documents.</Card>
              </PageContent>
            </PageScaffold>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
