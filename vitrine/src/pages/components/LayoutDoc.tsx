import { Button, Card, Heading, Layout } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DemoScreen } from "../../kit/DemoScreen";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Layout } from "@canop/ui";`;

const SCREEN_HEIGHT = "40rem";

const basicCode = `<Layout brand="MonPortail">
  <Card title="Connexion" actions={<Button fullWidth>Se connecter</Button>}>
    Accédez à votre espace en toute sécurité.
  </Card>
</Layout>`;

const brandCode = `<Layout brand="HealthServ" maxWidth="31rem">
  <Card>Portail avec un brand et une largeur de carte personnalisés.</Card>
</Layout>`;

const headerCode = `<Layout
  header={
    <Heading level={1} size={2} gutterBottom={false}>
      En-tête sur mesure
    </Heading>
  }
>
  <Card>Le header fourni remplace le bloc brand par défaut.</Card>
</Layout>`;

const fr = {
  intro:
    "Gabarit d'écran portail centré sur fond décoratif ShapeBackground. Il compose un en-tête de marque et une carte centrale, idéal pour les pages de connexion et les parcours d'authentification.",
  sections: {
    basic: "Usage de base",
    brand: "Marque et largeur",
    header: "En-tête personnalisé",
    api: "API",
  },
  demos: {
    basic: {
      title: "Écran portail",
      description:
        "Un en-tête de marque surmonte une carte centrale contenant le contenu de la page. Le gabarit occupe toute la hauteur de la fenêtre : dans ce faux écran, faites-le défiler pour atteindre la bascule de thème.",
    },
    brand: {
      title: "brand et maxWidth",
      description: "Personnalisez le nom de marque et la largeur maximale de la carte centrale.",
    },
    header: {
      title: "header",
      description:
        "Fournissez un en-tête complet pour remplacer entièrement le bloc brand par défaut.",
    },
  },
  props: {
    animatedShapes:
      "Fait onduler la trame lave derrière la carte. Sans effet quand un mouvement réduit est demandé.",
    showUtilities: "Affiche les utilitaires (langue, thème) en coin de l'écran.",
    brand: "Nom de marque affiché dans l'en-tête par défaut, à côté du logo.",
    brandLevel:
      "Niveau sémantique de la marque : un titre h1 à h4, ou « text » pour un simple paragraphe, utile quand la page porte déjà son h1. La taille affichée ne change pas.",
    logo: "Logo affiché avant le brand dans l'en-tête par défaut.",
    header: "En-tête complet sur mesure qui remplace le bloc brand par défaut.",
    maxWidth: "Largeur maximale de la carte centrale.",
    backgroundTone: "Couleur de la trame lave du fond : primary, ou accent.",
    mainElement:
      "Élément de la zone principale : main par défaut, div pour un gabarit imbriqué dans une page qui a déjà son main, comme les démos ci-dessus.",
    children: "Contenu de la carte centrale, typiquement un formulaire d'authentification.",
  },
};

const en: typeof fr = {
  intro:
    "Centered portal screen template on a decorative ShapeBackground. It composes a brand header and a central card, ideal for sign-in pages and authentication flows.",
  sections: {
    basic: "Basic usage",
    brand: "Brand and width",
    header: "Custom header",
    api: "API",
  },
  demos: {
    basic: {
      title: "Portal screen",
      description:
        "A brand header sits above a central card holding the page content. The template fills the full window height: in this mock screen, scroll it to reach the theme toggle.",
    },
    brand: {
      title: "brand and maxWidth",
      description: "Customize the brand name and the maximum width of the central card.",
    },
    header: {
      title: "header",
      description: "Provide a full header to entirely replace the default brand block.",
    },
  },
  props: {
    animatedShapes:
      "Makes the lava dot grid flow behind the card. No effect when reduced motion is asked for.",
    showUtilities: "Shows the utilities (language, theme) in the corner of the screen.",
    brand: "Brand name shown in the default header, next to the logo.",
    brandLevel:
      "Semantic level of the brand: an h1 to h4 heading, or “text” for a plain paragraph, useful when the page already has its h1. The displayed size does not change.",
    logo: "Logo shown before the brand in the default header.",
    header: "Full custom header that replaces the default brand block.",
    maxWidth: "Maximum width of the central card.",
    backgroundTone: "Colour of the lava dot grid in the background: primary, or accent.",
    mainElement:
      "Element of the main area: main by default, div for a template nested in a page that already has its main, like the demos above.",
    children: "Content of the central card, typically an authentication form.",
  },
};

const texts = { fr, en };

export default function LayoutDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "brand",
      type: "string",
      defaultValue: '"CustHome"',
      description: t.props.brand,
    },
    {
      name: "brandLevel",
      type: '1 | 2 | 3 | 4 | "text"',
      defaultValue: "1",
      description: t.props.brandLevel,
    },
    {
      name: "logo",
      type: "ReactNode",
      description: t.props.logo,
    },
    {
      name: "header",
      type: "ReactNode",
      description: t.props.header,
    },
    {
      name: "maxWidth",
      type: "string",
      defaultValue: '"23.75rem"',
      description: t.props.maxWidth,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "animatedShapes",
      type: "boolean",
      defaultValue: "false",
      description: t.props.animatedShapes,
    },
    {
      name: "backgroundTone",
      type: '"primary" | "accent"',
      defaultValue: '"primary"',
      description: t.props.backgroundTone,
    },
    {
      name: "mainElement",
      type: '"main" | "div"',
      defaultValue: '"main"',
      description: t.props.mainElement,
    },
    {
      name: "showUtilities",
      type: "boolean",
      defaultValue: "true",
      description: t.props.showUtilities,
    },
  ];

  return (
    <DocPage title="Layout" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={basicCode}
          align="stretch"
        >
          <DemoScreen height={SCREEN_HEIGHT}>
            <Layout brand="MonPortail" brandLevel="text" mainElement="div">
              <Card title="Connexion" actions={<Button fullWidth>Se connecter</Button>}>
                Accédez à votre espace en toute sécurité.
              </Card>
            </Layout>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.brand}>
        <DemoCard
          title={t.demos.brand.title}
          description={t.demos.brand.description}
          code={brandCode}
          align="stretch"
        >
          <DemoScreen height={SCREEN_HEIGHT}>
            <Layout brand="HealthServ" brandLevel="text" mainElement="div" maxWidth="31rem">
              <Card>Portail avec un brand et une largeur de carte personnalisés.</Card>
            </Layout>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.header}>
        <DemoCard
          title={t.demos.header.title}
          description={t.demos.header.description}
          code={headerCode}
          align="stretch"
        >
          <DemoScreen height={SCREEN_HEIGHT}>
            <Layout
              mainElement="div"
              header={
                <Heading level={4} size={2} gutterBottom={false}>
                  En-tête sur mesure
                </Heading>
              }
            >
              <Card>Le header fourni remplace le bloc brand par défaut.</Card>
            </Layout>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
