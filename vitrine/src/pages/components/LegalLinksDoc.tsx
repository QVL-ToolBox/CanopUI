import { LegalLinks, LEGAL_NOTICE_ANCHOR, Stack, Text } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { LegalLinks, LEGAL_NOTICE_ANCHOR } from "@canop/ui";`;

const baseCode = `<LegalLinks authPortalUrl="https://auth.qvl-project.com" />`;

const colonneCode = `<LegalLinks
  authPortalUrl="https://auth.qvl-project.com"
  direction="column"
/>`;

const routeurCode = `// Le portail qui heberge lui-meme les conditions navigue en interne.
<LegalLinks
  authPortalUrl={window.location.origin}
  renderLink={(href, label) => (
    <Link href={href} size="small" color="secondary" onClick={(e) => {
      e.preventDefault();
      navigate(new URL(href).pathname + new URL(href).hash);
    }}>
      {label}
    </Link>
  )}
/>`;

const PORTAIL = "https://auth.qvl-project.com";

const fr = {
  intro:
    "Le pied de page légal : conditions d'utilisation et mentions légales. Les deux pointent la même page, les mentions légales n'étant qu'une ancre dedans. Cette ancre vivait en dur dans chaque portail, ce qui la rendait impossible à déplacer sans les visiter tous ; elle est désormais ici, et exportée sous LEGAL_NOTICE_ANCHOR pour qui en a besoin ailleurs.",
  sections: {
    base: "Utilisation",
    direction: "En colonne",
    routeur: "Portail hôte",
    api: "API",
  },
  demos: {
    base: {
      title: "Deux liens, un séparateur",
      description:
        "Les libellés viennent du dictionnaire de la librairie et suivent la langue courante. Le conteneur est un nav nommé, pour qu'un lecteur d'écran l'annonce comme la navigation légale et non comme deux liens perdus.",
    },
    direction: {
      title: "direction column",
      description:
        "Le séparateur suit : vertical entre deux liens en rangée, horizontal entre deux liens empilés. C'est la forme qui convient à un pied de page mobile.",
    },
    routeur: {
      title: "renderLink, pour le portail qui héberge les pages",
      description:
        "Par défaut chaque lien est une adresse absolue vers le portail d'authentification. Le portail qui héberge lui-même ces pages n'a pas à se recharger pour y aller : renderLink lui laisse rendre le lien comme il l'entend, et naviguer par son routeur. Sans cette porte, ce portail ne pouvait pas partager le composant et en gardait une copie à lui.",
    },
    ancre: "L'ancre exportée :",
  },
  props: {
    authPortalUrl:
      "Origine du portail qui héberge les conditions, par exemple https://auth.qvl-project.com.",
    cguPath: "Chemin des conditions sur ce portail.",
    direction: "Sens de la rangée, dont le séparateur suit l'orientation.",
    cguLabel: "Libellé du lien vers les conditions. Sans lui, le libellé traduit.",
    noticeLabel: "Libellé du lien vers les mentions légales. Sans lui, le libellé traduit.",
    ariaLabel: "Nom accessible de la navigation légale.",
    renderLink:
      "Rend un lien autrement que par une adresse absolue. Sert au portail qui héberge lui-même ces pages, pour naviguer en interne par son routeur.",
  },
};

const en: typeof fr = {
  intro:
    "The legal footer: terms of use and legal notice. Both point at the same page, the legal notice being only an anchor inside it. That anchor used to live hard-coded in every portal, which made it impossible to move without visiting them all; it now lives here, and is exported as LEGAL_NOTICE_ANCHOR for whoever needs it elsewhere.",
  sections: {
    base: "Usage",
    direction: "Stacked",
    routeur: "Host portal",
    api: "API",
  },
  demos: {
    base: {
      title: "Two links, one separator",
      description:
        "Labels come from the library dictionary and follow the current language. The container is a named nav, so a screen reader announces it as the legal navigation rather than two stray links.",
    },
    direction: {
      title: "direction column",
      description:
        "The separator follows: vertical between two links in a row, horizontal between two stacked ones. That is the shape a mobile footer wants.",
    },
    routeur: {
      title: "renderLink, for the portal that hosts the pages",
      description:
        "By default each link is an absolute address to the authentication portal. The portal that hosts these pages itself has no reason to reload to reach them: renderLink lets it render the link as it sees fit, and navigate through its own router. Without that door, this portal could not share the component and kept a copy of its own.",
    },
    ancre: "The exported anchor:",
  },
  props: {
    authPortalUrl:
      "Origin of the portal hosting the terms, for instance https://auth.qvl-project.com.",
    cguPath: "Path of the terms on that portal.",
    direction: "Direction of the row, whose separator follows the orientation.",
    cguLabel: "Label of the terms link. Without it, the translated label.",
    noticeLabel: "Label of the legal notice link. Without it, the translated label.",
    ariaLabel: "Accessible name of the legal navigation.",
    renderLink:
      "Renders a link other than as an absolute address. For the portal that hosts these pages itself, to navigate internally through its own router.",
  },
};

const texts = { fr, en };

export default function LegalLinksDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "authPortalUrl",
      type: "string",
      required: true,
      description: t.props.authPortalUrl,
    },
    { name: "cguPath", type: "string", defaultValue: '"/cgu"', description: t.props.cguPath },
    {
      name: "direction",
      type: '"row" | "column"',
      defaultValue: '"row"',
      description: t.props.direction,
    },
    { name: "cguLabel", type: "string", description: t.props.cguLabel },
    { name: "noticeLabel", type: "string", description: t.props.noticeLabel },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    {
      name: "renderLink",
      type: "(href: string, label: string) => ReactNode",
      description: t.props.renderLink,
    },
  ];

  return (
    <DocPage title="LegalLinks" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.base}>
        <DemoCard title={t.demos.base.title} description={t.demos.base.description} code={baseCode}>
          <LegalLinks authPortalUrl={PORTAIL} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.direction}>
        <DemoCard
          title={t.demos.direction.title}
          description={t.demos.direction.description}
          code={colonneCode}
        >
          <LegalLinks authPortalUrl={PORTAIL} direction="column" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.routeur}>
        <DemoCard
          title={t.demos.routeur.title}
          description={t.demos.routeur.description}
          code={routeurCode}
        >
          <Stack gap="xs" alignItems="center">
            <LegalLinks
              authPortalUrl={PORTAIL}
              renderLink={(href, label) => (
                <Text variant="body-sm" tone="muted">
                  {label} → {href}
                </Text>
              )}
            />
            <Text variant="caption" tone="muted">
              {t.demos.ancre} #{LEGAL_NOTICE_ANCHOR}
            </Text>
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
