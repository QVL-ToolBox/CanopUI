import Box from "@mui/material/Box";
import { useState } from "react";
import { Card, Heading, Navbar, Stack, type CanopNavbarItem } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

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

<Box
  position="relative"
  height="24rem"
  border="0.0625rem solid"
  borderColor="divider"
  borderRadius="0.75rem"
  overflow="hidden"
>
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
  </Navbar>
</Box>`;

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
    <Box
      position="relative"
      height="24rem"
      border="0.0625rem solid"
      borderColor="divider"
      borderRadius="0.75rem"
      overflow="hidden"
    >
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
    </Box>
  );
}`;

const titleLevelCode = `<Navbar items={items} title="Mon portail" titleLevel={2} activeHref="/users">
  <Stack padding="lg" gap="md">
    <Heading level={1} size={3}>
      Utilisateurs
    </Heading>
    <Card>Le titre de page porte le h1, celui de la barre passe en h2.</Card>
  </Stack>
</Navbar>`;

const fr = {
  intro:
    "La navigation principale CanopUI. En desktop, une barre latérale titrée liste les entrées avec icônes, pied utilisateur et déconnexion ; en mobile, elle bascule en barre de navigation basse complétée par le menu Paramètres. Les entrées peuvent porter des sous-items dépliables.",
  sections: {
    sidebar: "Navigation latérale",
    collapsible: "Sections dépliables",
    titleLevel: "Niveau du titre",
    navbarApi: "API Navbar",
    itemApi: "CanopNavbarItem",
  },
  demos: {
    sidebarTitle: "Barre latérale complète",
    sidebarDescription:
      "La Navbar occupe toute la hauteur ; elle est ici encadrée dans un conteneur de hauteur fixe pour la démonstration. Le pied affiche le nom de l'utilisateur et le bouton de déconnexion.",
    subItemsTitle: "Sous-items",
    subItemsDescription:
      "Une entrée dotée de children devient une section dépliable. La section active s'ouvre par défaut et reste refermable ; le parent et le sous-item actif sont mis en évidence.",
    titleLevelTitle: "titleLevel",
    titleLevelDescription:
      "Le titre de la barre est un h1 par défaut. Quand la page porte déjà son propre h1, passez-le en h2 ou en texte simple avec titleLevel « text » : l'apparence ne change pas, seule la balise change.",
  },
  navbarProps: {
    height:
      "Hauteur de l'ossature de navigation. À réduire quand la barre est posée dans un cadre plutôt que dans la fenêtre.",
    items: "Liste des entrées de navigation, avec sous-items optionnels.",
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
    sidebarWidget: "Widget libre inséré au-dessus du pied de la barre latérale.",
    actions:
      "Actions rendues en pile flottante : sous le bouton des réglages en mobile, sous le sélecteur de langue en tablette et bureau. Prévu pour des boutons à la taille d'une icône.",
    infoHref: "Lien vers les informations légales, transmis au menu Paramètres en mobile.",
    supportHref: "Lien vers la page de signalement de bug, transmis au menu Paramètres en mobile.",
    mobileFooterPlacement:
      "Emplacement du footer en mobile : boîte flottante au-dessus de la barre basse, ou intégré au menu Paramètres.",
  },
  itemProps: {
    label: "Libellé affiché de l'entrée.",
    href: "Identifiant de route de l'entrée, comparé à activeHref.",
    icon: "Nom de l'icône associée à l'entrée.",
    children: "Sous-items dépliables regroupés sous l'entrée.",
  },
};

const en: typeof fr = {
  intro:
    "The main CanopUI navigation. On desktop, a titled sidebar lists the entries with icons, a user footer and logout; on mobile, it switches to a bottom navigation bar completed by the Settings menu. Entries can carry collapsible sub-items.",
  sections: {
    sidebar: "Sidebar navigation",
    collapsible: "Collapsible sections",
    titleLevel: "Title level",
    navbarApi: "Navbar API",
    itemApi: "CanopNavbarItem",
  },
  demos: {
    sidebarTitle: "Full sidebar",
    sidebarDescription:
      "The Navbar spans the full height; here it is framed in a fixed-height container for the demo. The footer shows the user name and the logout button.",
    subItemsTitle: "Sub-items",
    subItemsDescription:
      "An entry with children becomes a collapsible section. The active section opens by default and stays collapsible; the parent and the active sub-item are highlighted.",
    titleLevelTitle: "titleLevel",
    titleLevelDescription:
      "The bar title is an h1 by default. When the page already carries its own h1, switch it to h2 or to plain text with titleLevel “text”: the look stays the same, only the tag changes.",
  },
  navbarProps: {
    height:
      "Height of the navigation frame. Lower it when the bar sits inside a container rather than the viewport.",
    items: "List of navigation entries, with optional sub-items.",
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
    sidebarWidget: "Free widget inserted above the sidebar footer.",
    actions:
      "Actions rendered as a floating stack: under the settings button on mobile, under the language selector on tablet and desktop. Meant for icon-sized buttons.",
    infoHref: "Link to the legal information, passed to the Settings menu on mobile.",
    supportHref: "Link to the bug report page, passed to the Settings menu on mobile.",
    mobileFooterPlacement:
      "Footer placement on mobile: floating box above the bottom bar, or embedded in the Settings menu.",
  },
  itemProps: {
    label: "Displayed label of the entry.",
    href: "Route identifier of the entry, compared to activeHref.",
    icon: "Name of the icon associated with the entry.",
    children: "Collapsible sub-items grouped under the entry.",
  },
};

const texts = { fr, en };

function NavbarSubItemsDemo() {
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
    <Box
      sx={[
        {
          position: "relative",
          height: "24rem",
          border: "0.0625rem solid",
          borderColor: "divider",
          overflow: "hidden",
        },
        squircleClip(tokens.radius.sm),
      ]}
    >
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
            Cliquez sur une section pour la déplier ou la replier. La section active s&apos;ouvre
            par défaut.
          </Card>
        </Stack>
      </Navbar>
    </Box>
  );
}

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
          <Box
            sx={[
              {
                position: "relative",
                height: "24rem",
                border: "0.0625rem solid",
                borderColor: "divider",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <Navbar
              height="100%"
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
            </Navbar>
          </Box>
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
      <DocSection title={t.sections.titleLevel}>
        <DemoCard
          title={t.demos.titleLevelTitle}
          description={t.demos.titleLevelDescription}
          code={titleLevelCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                position: "relative",
                height: "24rem",
                border: "0.0625rem solid",
                borderColor: "divider",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <Navbar
              height="100%"
              items={items}
              title="Mon portail"
              titleLevel={2}
              activeHref="/users"
            >
              <Stack padding="lg" gap="md">
                <Heading level={1} size={3}>
                  Utilisateurs
                </Heading>
                <Card>Le titre de page porte le h1, celui de la barre passe en h2.</Card>
              </Stack>
            </Navbar>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.navbarApi}>
        <PropsTable rows={navbarPropRows} />
      </DocSection>
      <DocSection title={t.sections.itemApi}>
        <PropsTable rows={navbarItemPropRows} />
      </DocSection>
    </DocPage>
  );
}
