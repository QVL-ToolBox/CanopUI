import { Link } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Link } from "@canop/ui";`;

const sizesCode = `<Link href="#" size="xsmall">Lien xsmall</Link>
<Link href="#" size="small">Lien small</Link>
<Link href="#" size="medium">Lien medium</Link>`;

const colorsCode = `<Link href="#" color="accent">Accent</Link>
<Link href="#" color="primary">Primaire</Link>
<Link href="#" color="secondary">Secondaire</Link>
<Link href="#" color="muted">Discret</Link>`;

const noWrapCode = `<Link href="#" noWrap>
  Un libellé long qui ne passera jamais à la ligne
</Link>`;

const externalCode = `<Link href="https://dev.azure.com/qvl-project" external>
  Ouvrir Azure DevOps
</Link>`;

const fr = {
  intro:
    "Le lien textuel CanopUI. Souligné au survol, décliné en trois tailles et quatre couleurs sémantiques, il rend un lien HTML natif ou s'appuie sur un composant de routeur.",
  sections: {
    sizes: "Tailles",
    colors: "Couleurs",
    noWrap: "Sans retour à la ligne",
    external: "Lien externe",
    api: "API",
  },
  demos: {
    externalTitle: "external",
    externalDescription:
      "Ouvre la cible dans un nouvel onglet avec rel noopener noreferrer. Les lecteurs d'écran entendent « s'ouvre dans un nouvel onglet », texte issu de l'i18n de la librairie (clé canop.link.newTab).",
    sizesTitle: "xsmall, small, medium",
    sizesDescription:
      "medium est la taille par défaut ; small et xsmall conviennent aux liens secondaires.",
    colorsTitle: "Couleurs sémantiques",
    colorsDescription:
      "accent porte les liens d'action, muted les liens discrets. Toutes les couleurs proviennent du thème.",
    noWrapTitle: "noWrap",
    noWrapDescription:
      "Maintient le libellé sur une seule ligne, quelle que soit la largeur disponible.",
  },
  props: {
    children: "Contenu du lien.",
    href: "URL cible pour un lien HTML natif.",
    component:
      "Composant de rendu, utile pour brancher un lien de routeur (par exemple le Link de React Router).",
    to: "Destination transmise au composant de routeur fourni via component.",
    size: "Taille de police du lien.",
    color: "Couleur sémantique du lien, issue du thème.",
    noWrap: "Empêche le retour à la ligne du libellé.",
    external: "Ouvre le lien dans un nouvel onglet et l'annonce aux technologies d'assistance.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI text link. Underlined on hover, available in three sizes and four semantic colors, it renders a native HTML link or relies on a router component.",
  sections: {
    sizes: "Sizes",
    colors: "Colors",
    noWrap: "No wrapping",
    external: "External link",
    api: "API",
  },
  demos: {
    externalTitle: "external",
    externalDescription:
      "Opens the target in a new tab with rel noopener noreferrer. Screen readers hear “opens in a new tab”, a text taken from the library i18n (key canop.link.newTab).",
    sizesTitle: "xsmall, small, medium",
    sizesDescription: "medium is the default size; small and xsmall suit secondary links.",
    colorsTitle: "Semantic colors",
    colorsDescription:
      "accent carries action links, muted carries subtle links. All colors come from the theme.",
    noWrapTitle: "noWrap",
    noWrapDescription: "Keeps the label on a single line, regardless of the available width.",
  },
  props: {
    children: "Link content.",
    href: "Target URL for a native HTML link.",
    component:
      "Render component, useful to wire up a router link (for example React Router's Link).",
    to: "Destination passed to the router component provided via component.",
    size: "Font size of the link.",
    color: "Semantic color of the link, taken from the theme.",
    noWrap: "Prevents the label from wrapping.",
    external: "Opens the link in a new tab and announces it to assistive technologies.",
  },
};

const texts = { fr, en };

export default function LinkDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "href",
      type: "string",
      description: t.props.href,
    },
    {
      name: "component",
      type: "ElementType",
      description: t.props.component,
    },
    {
      name: "to",
      type: "string",
      description: t.props.to,
    },
    {
      name: "size",
      type: '"xsmall" | "small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "muted"',
      defaultValue: '"accent"',
      description: t.props.color,
    },
    {
      name: "noWrap",
      type: "boolean",
      defaultValue: "false",
      description: t.props.noWrap,
    },
    {
      name: "external",
      type: "boolean",
      defaultValue: "false",
      description: t.props.external,
    },
  ];

  return (
    <DocPage title="Link" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.sizes}>
        <DemoCard
          title={t.demos.sizesTitle}
          description={t.demos.sizesDescription}
          code={sizesCode}
        >
          <Link href="#" size="xsmall">
            Lien xsmall
          </Link>
          <Link href="#" size="small">
            Lien small
          </Link>
          <Link href="#" size="medium">
            Lien medium
          </Link>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors}>
        <DemoCard
          title={t.demos.colorsTitle}
          description={t.demos.colorsDescription}
          code={colorsCode}
        >
          <Link href="#" color="accent">
            Accent
          </Link>
          <Link href="#" color="primary">
            Primaire
          </Link>
          <Link href="#" color="secondary">
            Secondaire
          </Link>
          <Link href="#" color="muted">
            Discret
          </Link>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.noWrap}>
        <DemoCard
          title={t.demos.noWrapTitle}
          description={t.demos.noWrapDescription}
          code={noWrapCode}
        >
          <Link href="#" noWrap>
            Un libellé long qui ne passera jamais à la ligne
          </Link>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.external}>
        <DemoCard
          title={t.demos.externalTitle}
          description={t.demos.externalDescription}
          code={externalCode}
        >
          <Link href="https://dev.azure.com/qvl-project" external>
            Ouvrir Azure DevOps
          </Link>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
