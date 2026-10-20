import Box from "@mui/material/Box";
import { Button, Card, Heading, Layout } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Layout } from "@canop/ui";`;

const basicCode = `<Box height="40rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <Layout brand="MonPortail">
    <Card title="Connexion" actions={<Button fullWidth>Se connecter</Button>}>
      Accédez à votre espace en toute sécurité.
    </Card>
  </Layout>
</Box>`;

const brandCode = `<Box height="40rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <Layout brand="HealthServ" maxWidth="31rem">
    <Card>Portail avec un brand et une largeur de carte personnalisés.</Card>
  </Layout>
</Box>`;

const headerCode = `<Box height="40rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <Layout
    header={
      <Heading level={1} size={2} gutterBottom={false} color="primary.contrastText">
        En-tête sur mesure
      </Heading>
    }
  >
    <Card>Le header fourni remplace le bloc brand par défaut.</Card>
  </Layout>
</Box>`;

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
        "Un en-tête de marque surmonte une carte centrale contenant le contenu de la page.",
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
    animatedShapes: "Anime le fond de formes derrière la carte.",
    showUtilities: "Affiche les utilitaires (langue, thème) en coin de l'écran.",
    brand: "Nom de marque affiché dans l'en-tête par défaut, à côté du logo.",
    logo: "Logo affiché avant le brand dans l'en-tête par défaut.",
    header: "En-tête complet sur mesure qui remplace le bloc brand par défaut.",
    maxWidth: "Largeur maximale de la carte centrale.",
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
      description: "A brand header sits above a central card holding the page content.",
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
    animatedShapes: "Animates the shape background behind the card.",
    showUtilities: "Shows the utilities (language, theme) in the corner of the screen.",
    brand: "Brand name shown in the default header, next to the logo.",
    logo: "Logo shown before the brand in the default header.",
    header: "Full custom header that replaces the default brand block.",
    maxWidth: "Maximum width of the central card.",
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
      type: "number | string",
      defaultValue: "380",
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
            <Layout brand="MonPortail">
              <Card title="Connexion" actions={<Button fullWidth>Se connecter</Button>}>
                Accédez à votre espace en toute sécurité.
              </Card>
            </Layout>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.brand}>
        <DemoCard
          title={t.demos.brand.title}
          description={t.demos.brand.description}
          code={brandCode}
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
            <Layout brand="HealthServ" maxWidth="31rem">
              <Card>Portail avec un brand et une largeur de carte personnalisés.</Card>
            </Layout>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.header}>
        <DemoCard
          title={t.demos.header.title}
          description={t.demos.header.description}
          code={headerCode}
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
            <Layout
              header={
                <Heading level={1} size={2} gutterBottom={false} color="primary.contrastText">
                  En-tête sur mesure
                </Heading>
              }
            >
              <Card>Le header fourni remplace le bloc brand par défaut.</Card>
            </Layout>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
