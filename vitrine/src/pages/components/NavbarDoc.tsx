import { Card, Heading, Navbar, Stack, type CanopNavbarItem } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DemoScreen } from "../../kit/DemoScreen";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { NavbarGroupsDemo } from "./navbar/NavbarGroupsDemo";
import { NavbarMoreDemo } from "./navbar/NavbarMoreDemo";
import { NavbarSubItemsDemo } from "./navbar/NavbarSubItemsDemo";

const importCode = `import { Navbar, type CanopNavbarItem } from "@canop/ui";`;

const items: CanopNavbarItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
  { label: "Rôles", href: "/roles", icon: "shield" },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

const basicCode = `const items: CanopNavbarItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
  { label: "Rôles", href: "/roles", icon: "shield" },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

<Navbar
  items={items}
  title="Mon portail"
  activeHref="/dashboard"
  userName="Martin Queval"
  onLogout={() => {}}
>
  <Stack padding="lg" gap="md">
    <Heading level={2} size={3}>
      Tableau de bord
    </Heading>
    <Card>Contenu de la page principale.</Card>
  </Stack>
</Navbar>`;

const subItemsCode = `function NavbarSubItemsDemo() {
  const subItems: CanopNavbarItem[] = [
    { label: "Tableau de bord", href: "/dashboard", icon: "apps" },
    {
      label: "QVL-Studio",
      href: "/studio",
      icon: "apps",
      children: [
        { label: "CanopUI", href: "/studio/canopui", icon: "folder" },
        { label: "PipeBoard", href: "/studio/pipeboard", icon: "folder" },
      ],
    },
    { label: "Paramètres", href: "/settings", icon: "settings" },
  ];
  const [active, setActive] = useState("/studio/canopui");
  return (
    <Navbar
      items={subItems}
      title="Mon portail"
      activeHref={active}
      onNavigate={setActive}
      userName="Martin Queval"
    >
      <Stack padding="lg" gap="md">
        <Heading level={2} size={3}>
          {active}
        </Heading>
        <Card>
          Cliquez sur une section pour la déplier ou la replier. La section active s'ouvre par
          défaut.
        </Card>
      </Stack>
    </Navbar>
  );
}`;

const groupsCode = `const groupedItems: CanopNavbarItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: "apps" },
  {
    label: "Catalogue",
    href: "/catalog",
    icon: "layout",
    children: [{ label: "Nouveautés", href: "/catalog/new" }],
    groups: [
      {
        label: "Saisie",
        items: [
          { label: "Button", href: "/catalog/button" },
          { label: "Input", href: "/catalog/input" },
        ],
      },
      {
        label: "Affichage",
        items: [
          { label: "Card", href: "/catalog/card" },
          { label: "DataTable", href: "/catalog/data-table" },
        ],
      },
    ],
  },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

<Navbar items={groupedItems} title="Mon portail" activeHref={active} onNavigate={setActive}>
  {page}
</Navbar>`;

const moreCode = `const manyItems: CanopNavbarItem[] = [
  { label: "Accueil", href: "/home", icon: "home" },
  { label: "Agenda", href: "/agenda", icon: "calendar" },
  { label: "Messages", href: "/messages", icon: "chat" },
  { label: "Fichiers", href: "/files", icon: "folder" },
  {
    label: "Équipe",
    href: "/team",
    icon: "contacts",
    children: [
      { label: "Membres", href: "/team/members" },
      { label: "Invitations", href: "/team/invitations" },
    ],
  },
  { label: "Rapports", href: "/reports", icon: "barChart" },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

<Navbar items={manyItems} title="Mon portail" activeHref={active} onNavigate={setActive}>
  {page}
</Navbar>`;

const titleLevelCode = `<Navbar items={items} title="Mon portail" titleLevel="text" activeHref="/users">
  <Stack padding="lg" gap="md">
    <Heading level={1} size={3}>
      Utilisateurs
    </Heading>
    <Card>Le titre de page porte le h1, celui de la barre passe en texte simple.</Card>
  </Stack>
</Navbar>`;

const fr = {
  intro:
    "La navigation principale CanopUI. En desktop, une barre latérale titrée liste les entrées avec icônes, pied utilisateur et déconnexion ; en tablette, elle se resserre en rail d'icônes ; en mobile, elle bascule en barre de navigation basse complétée par le menu Paramètres. Les entrées peuvent porter des sous-items dépliables, rangés si besoin sous des intertitres.",
  sections: {
    sidebar: "Navigation latérale",
    collapsible: "Sections dépliables",
    groups: "Intertitres",
    mobileMore: "Barre mobile chargée",
    titleLevel: "Niveau du titre",
    navbarApi: "API Navbar",
    itemApi: "CanopNavbarItem",
    groupApi: "CanopNavbarGroup",
  },
  demos: {
    sidebarTitle: "Barre latérale complète",
    sidebarDescription:
      "La Navbar occupe toute la hauteur de la fenêtre ; ici, un faux écran de hauteur fixe l'accueille et retient ses éléments fixes. Sa disposition suit la taille de la fenêtre : élargissez-la ou réduisez-la pour passer de la barre latérale au rail, puis à la barre basse. En clair, la barre est un dégradé de la couleur primaire vers sa variante foncée ; en sombre, sa teinte profonde dérive de la couleur primaire assombrie. Dans les deux thèmes, les entrées s'écrivent en blanc et l'entrée active repose sur une pastille blanche nimbée d'un halo doux, qui glisse d'une entrée à l'autre ; son texte et son icône passent en foncé. L'apparence passe par les variables --canop-navbar-* posées par le thème, surchargeables sur un conteneur, et suit la palette saisonnière ; réglages et sous-menus partagent cette teinte. Le pied affiche le nom de l'utilisateur et une déconnexion discrète.",
    subItemsTitle: "Sous-items",
    subItemsDescription:
      "Une entrée dotée de children devient une section dépliable. La section active s'ouvre par défaut et reste refermable ; le sous-item actif porte la pastille et le parent passe en gras.",
    groupsTitle: "Sous-items sous intertitres",
    groupsDescription:
      "groups range les sous-items d'une entrée sous des intertitres, après ses children éventuels. Chaque groupe est annoncé par son intertitre (role « group » et aria-labelledby) ; l'intertitre n'est pas focalisable. Le rendu est le même dans la barre latérale, dans le sous-menu du rail et dans celui de la barre mobile. Un groupe vide n'est pas affiché.",
    moreTitle: "Bouton Plus",
    moreDescription:
      "Réduisez la fenêtre sous 37,5rem (600 px par défaut) pour voir la barre basse. Elle affiche au plus cinq tuiles et, selon la place mesurée, moins quand l'écran est étroit ou la police agrandie : les entrées en trop passent sous un bouton Plus, dont le sous-menu reprend la teinte de la barre. Quand l'entrée active est rangée sous Plus, c'est lui qui porte la pastille. La barre ne déborde jamais, même à 280 px. Comme dans le rail, chaque tuile n'affiche que son icône : son libellé apparaît en légende au survol et au focus clavier, au-dessus de la barre basse et à droite du rail, mais jamais au toucher.",
    titleLevelTitle: "titleLevel",
    titleLevelDescription:
      "Le titre de la barre est un h1 par défaut. Quand la page porte déjà son propre h1, passez-le en h2 ou en texte simple avec titleLevel « text » : l'apparence ne change pas, seule la balise change.",
  },
  navbarProps: {
    height:
      "Hauteur de l'ossature de navigation. À réduire quand la barre est posée dans un cadre plutôt que dans la fenêtre.",
    items:
      "Liste des entrées de navigation, avec sous-items et intertitres optionnels. En mobile, celles qui ne tiennent pas dans la barre basse passent sous le bouton Plus.",
    children: "Contenu principal affiché dans la zone de page.",
    title: "Titre affiché en tête de la barre latérale.",
    titleLevel:
      "Niveau sémantique du titre : h1 à h4, ou paragraphe avec « text ». Le rendu visuel est identique.",
    activeHref: "href de l'entrée active, mise en évidence dans la navigation.",
    onNavigate: "Handler appelé au clic sur une entrée de navigation.",
    userName: "Nom de l'utilisateur affiché en pied de barre latérale.",
    onLogout: "Handler de déconnexion ; sa présence affiche le bouton de déconnexion.",
    footer:
      "Contenu de pied de barre latérale. En mobile, boîte flottante ou menu Paramètres selon mobileFooterPlacement.",
    settingsFooter:
      "Contenu de pied dédié au menu Paramètres en mobile, indépendant de footer (par exemple les liens légaux).",
    sidebarWidget:
      "Widget libre inséré au-dessus du pied de la barre latérale. En tablette, il s'ouvre dans le panneau des réglages du rail (13,5rem de large) ; en mobile, il flotte au-dessus de la barre basse.",
    actions:
      "Actions rendues en pile flottante : sous le bouton des réglages en mobile, sous le sélecteur de langue en tablette et bureau. Prévu pour des boutons à la taille d'une icône.",
    infoHref: "Lien vers les informations légales, transmis au menu Paramètres en mobile.",
    supportHref: "Lien vers la page de signalement de bug, transmis au menu Paramètres en mobile.",
    mobileFooterPlacement:
      "Emplacement du footer en mobile : boîte flottante au-dessus de la barre basse, ou intégré au menu Paramètres.",
    mainElement:
      "Balise de la zone de contenu. « div » quand la Navbar est posée dans une page qui a déjà son repère main.",
  },
  itemProps: {
    label: "Libellé affiché de l'entrée.",
    href: "Identifiant de route de l'entrée, comparé à activeHref.",
    icon: "Nom de l'icône associée à l'entrée.",
    children: "Sous-items dépliables regroupés sous l'entrée, sans intertitre.",
    groups: "Groupes de sous-items affichés sous des intertitres, après children.",
  },
  groupProps: {
    label: "Intertitre du groupe, qui nomme aussi le groupe pour les technologies d'assistance.",
    items: "Sous-items du groupe. Un groupe vide n'est pas affiché.",
  },
};

const en: typeof fr = {
  intro:
    "The main CanopUI navigation. On desktop, a titled sidebar lists the entries with icons, a user footer and logout; on tablet, it narrows into an icon rail; on mobile, it switches to a bottom navigation bar completed by the Settings menu. Entries can carry collapsible sub-items, sorted under group headings when needed.",
  sections: {
    sidebar: "Sidebar navigation",
    collapsible: "Collapsible sections",
    groups: "Group headings",
    mobileMore: "Crowded mobile bar",
    titleLevel: "Title level",
    navbarApi: "Navbar API",
    itemApi: "CanopNavbarItem",
    groupApi: "CanopNavbarGroup",
  },
  demos: {
    sidebarTitle: "Full sidebar",
    sidebarDescription:
      "The Navbar spans the full height of the window; here, a fixed-height mock screen hosts it and holds its fixed elements. Its layout follows the window size: widen or narrow the window to go from the sidebar to the rail, then to the bottom bar. In light mode, the bar is a gradient from the primary color to its dark variant; in dark mode, its deep tint derives from the darkened primary color. In both themes, entries are written in white and the active entry rests on a white pill wrapped in a soft halo, which slides from one entry to the next; its text and icon turn dark. The look goes through the --canop-navbar-* variables set by the theme, which a container can override, and follows the seasonal palette; settings and submenus share this tint. The footer shows the user name and a quiet logout.",
    subItemsTitle: "Sub-items",
    subItemsDescription:
      "An entry with children becomes a collapsible section. The active section opens by default and stays collapsible; the active sub-item carries the pill and the parent turns bold.",
    groupsTitle: "Sub-items under group headings",
    groupsDescription:
      "groups sorts the sub-items of an entry under headings, after its children if any. Each group is announced by its heading (role “group” and aria-labelledby); the heading is not focusable. The rendering is the same in the sidebar, in the rail submenu and in the mobile bar submenu. An empty group is not displayed.",
    moreTitle: "More button",
    moreDescription:
      "Narrow the window below 37.5rem (600 px by default) to see the bottom bar. It shows five tiles at most and, depending on the measured room, fewer on a narrow screen or with an enlarged font: the extra entries move under a More button, whose submenu takes the tint of the bar. When the active entry sits under More, More carries the pill. The bar never overflows, even at 280 px. As in the rail, each tile only shows its icon: its label appears as a tooltip on hover and keyboard focus, above the bottom bar and to the right of the rail, but never on touch.",
    titleLevelTitle: "titleLevel",
    titleLevelDescription:
      "The bar title is an h1 by default. When the page already carries its own h1, switch it to h2 or to plain text with titleLevel “text”: the look stays the same, only the tag changes.",
  },
  navbarProps: {
    height:
      "Height of the navigation frame. Lower it when the bar sits inside a container rather than the viewport.",
    items:
      "List of navigation entries, with optional sub-items and group headings. On mobile, those that do not fit in the bottom bar move under the More button.",
    children: "Main content displayed in the page area.",
    title: "Title displayed at the top of the sidebar.",
    titleLevel:
      "Semantic level of the title: h1 to h4, or a paragraph with “text”. The visual rendering is identical.",
    activeHref: "href of the active entry, highlighted in the navigation.",
    onNavigate: "Handler called when a navigation entry is clicked.",
    userName: "User name displayed in the sidebar footer.",
    onLogout: "Logout handler; its presence displays the logout button.",
    footer:
      "Sidebar footer content. On mobile, a floating box or the Settings menu depending on mobileFooterPlacement.",
    settingsFooter:
      "Footer content dedicated to the Settings menu on mobile, independent from footer (for example legal links).",
    sidebarWidget:
      "Free widget inserted above the sidebar footer. On tablet, it opens in the rail settings panel (13.5rem wide); on mobile, it floats above the bottom bar.",
    actions:
      "Actions rendered as a floating stack: under the settings button on mobile, under the language selector on tablet and desktop. Meant for icon-sized buttons.",
    infoHref: "Link to the legal information, passed to the Settings menu on mobile.",
    supportHref: "Link to the bug report page, passed to the Settings menu on mobile.",
    mobileFooterPlacement:
      "Footer placement on mobile: floating box above the bottom bar, or embedded in the Settings menu.",
    mainElement:
      "Tag of the content area. Use “div” when the Navbar sits in a page that already has its main landmark.",
  },
  itemProps: {
    label: "Displayed label of the entry.",
    href: "Route identifier of the entry, compared to activeHref.",
    icon: "Name of the icon associated with the entry.",
    children: "Collapsible sub-items grouped under the entry, without a heading.",
    groups: "Groups of sub-items displayed under headings, after children.",
  },
  groupProps: {
    label: "Group heading, which also names the group for assistive technologies.",
    items: "Sub-items of the group. An empty group is not displayed.",
  },
};

const texts = { fr, en };

export default function NavbarDoc() {
  const t = texts[useDocLocale()];

  const navbarPropRows: PropRow[] = [
    {
      name: "items",
      type: "CanopNavbarItem[]",
      required: true,
      description: t.navbarProps.items,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.navbarProps.children,
    },
    {
      name: "title",
      type: "string",
      description: t.navbarProps.title,
    },
    {
      name: "titleLevel",
      type: '1 | 2 | 3 | 4 | "text"',
      defaultValue: "1",
      description: t.navbarProps.titleLevel,
    },
    {
      name: "activeHref",
      type: "string",
      description: t.navbarProps.activeHref,
    },
    {
      name: "onNavigate",
      type: "(href: string) => void",
      description: t.navbarProps.onNavigate,
    },
    {
      name: "userName",
      type: "string",
      description: t.navbarProps.userName,
    },
    {
      name: "onLogout",
      type: "() => void",
      description: t.navbarProps.onLogout,
    },
    {
      name: "footer",
      type: "ReactNode",
      description: t.navbarProps.footer,
    },
    {
      name: "settingsFooter",
      type: "ReactNode",
      description: t.navbarProps.settingsFooter,
    },
    {
      name: "sidebarWidget",
      type: "ReactNode",
      description: t.navbarProps.sidebarWidget,
    },
    {
      name: "actions",
      type: "ReactNode",
      description: t.navbarProps.actions,
    },
    {
      name: "supportHref",
      type: "string",
      description: t.navbarProps.supportHref,
    },
    {
      name: "infoHref",
      type: "string",
      description: t.navbarProps.infoHref,
    },
    {
      name: "mobileFooterPlacement",
      type: '"floating" | "settings"',
      defaultValue: '"floating"',
      description: t.navbarProps.mobileFooterPlacement,
    },
    {
      name: "mainElement",
      type: '"main" | "div"',
      defaultValue: '"main"',
      description: t.navbarProps.mainElement,
    },
    { name: "height", type: "string", defaultValue: '"100dvh"', description: t.navbarProps.height },
  ];

  const navbarItemPropRows: PropRow[] = [
    {
      name: "label",
      type: "string",
      required: true,
      description: t.itemProps.label,
    },
    {
      name: "href",
      type: "string",
      required: true,
      description: t.itemProps.href,
    },
    {
      name: "icon",
      type: "CanopIconName",
      description: t.itemProps.icon,
    },
    {
      name: "children",
      type: "CanopNavbarItem[]",
      description: t.itemProps.children,
    },
    {
      name: "groups",
      type: "CanopNavbarGroup[]",
      description: t.itemProps.groups,
    },
  ];

  const navbarGroupPropRows: PropRow[] = [
    {
      name: "label",
      type: "string",
      required: true,
      description: t.groupProps.label,
    },
    {
      name: "items",
      type: "CanopNavbarItem[]",
      required: true,
      description: t.groupProps.items,
    },
  ];

  return (
    <DocPage title="Navbar" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.sidebar}>
        <DemoCard
          title={t.demos.sidebarTitle}
          description={t.demos.sidebarDescription}
          code={basicCode}
          align="stretch"
        >
          <DemoScreen>
            <Navbar
              height="100%"
              mainElement="div"
              items={items}
              title="Mon portail"
              titleLevel="text"
              activeHref="/dashboard"
              userName="Martin Queval"
              onLogout={() => {}}
            >
              <Stack padding="lg" gap="md">
                <Heading level={4} size={3}>
                  Tableau de bord
                </Heading>
                <Card>Contenu de la page principale.</Card>
              </Stack>
            </Navbar>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.collapsible}>
        <DemoCard
          title={t.demos.subItemsTitle}
          description={t.demos.subItemsDescription}
          code={subItemsCode}
          align="stretch"
        >
          <NavbarSubItemsDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.groups}>
        <DemoCard
          title={t.demos.groupsTitle}
          description={t.demos.groupsDescription}
          code={groupsCode}
          align="stretch"
        >
          <NavbarGroupsDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.mobileMore}>
        <DemoCard
          title={t.demos.moreTitle}
          description={t.demos.moreDescription}
          code={moreCode}
          align="stretch"
        >
          <NavbarMoreDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.titleLevel}>
        <DemoCard
          title={t.demos.titleLevelTitle}
          description={t.demos.titleLevelDescription}
          code={titleLevelCode}
          align="stretch"
        >
          <DemoScreen>
            <Navbar
              height="100%"
              mainElement="div"
              items={items}
              title="Mon portail"
              titleLevel="text"
              activeHref="/users"
            >
              <Stack padding="lg" gap="md">
                <Heading level={4} size={3}>
                  Utilisateurs
                </Heading>
                <Card>Le titre de page porte le h1, celui de la barre passe en texte simple.</Card>
              </Stack>
            </Navbar>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.navbarApi}>
        <PropsTable rows={navbarPropRows} />
      </DocSection>
      <DocSection title={t.sections.itemApi}>
        <PropsTable rows={navbarItemPropRows} />
      </DocSection>
      <DocSection title={t.sections.groupApi}>
        <PropsTable rows={navbarGroupPropRows} />
      </DocSection>
    </DocPage>
  );
}
