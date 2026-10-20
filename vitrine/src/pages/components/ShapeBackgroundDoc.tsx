import Box from "@mui/material/Box";
import { Card, ShapeBackground } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { ShapeBackground } from "@canop/ui";`;

const basicCode = `<Box height="24rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <ShapeBackground minHeight="100%">
    <Card title="CanopUI">Fond décoratif composé de formes organiques.</Card>
  </ShapeBackground>
</Box>`;

const colorCode = `<Box height="24rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <ShapeBackground minHeight="100%" color="secondary.main">
    <Card>Le fond adopte la teinte fournie via la prop color.</Card>
  </ShapeBackground>
</Box>`;

const contentCode = `<Box height="24rem" width="100%" borderRadius="0.75rem" overflow="hidden">
  <ShapeBackground minHeight="100%" contentSx={{ maxWidth: "18rem" }}>
    <Card title="Contenu contraint">
      contentSx limite ici la largeur de la zone de contenu centrée.
    </Card>
  </ShapeBackground>
</Box>`;

const fr = {
  intro:
    "Fond décoratif animé de formes organiques (cercles, triangles, capsules) dérivées de la palette. Il centre son contenu et sert de toile de fond aux écrans d'authentification et aux pages portail. Les formes s'adaptent automatiquement au mobile.",
  sections: {
    basic: "Usage de base",
    color: "Couleur",
    content: "Zone de contenu",
    api: "API",
  },
  demos: {
    basic: {
      title: "Fond avec contenu centré",
      description:
        "Le contenu est centré verticalement et horizontalement au-dessus des formes. minHeight vaut 100vh par défaut ; ici 100% épouse le conteneur de démonstration.",
    },
    color: {
      title: "Teinte personnalisée",
      description:
        "color accepte n'importe quelle clé de la palette du thème pour recolorer le fond.",
    },
    content: {
      title: "contentSx",
      description:
        "contentSx cible la zone de contenu centrée, par exemple pour en contraindre la largeur.",
    },
  },
  props: {
    variant:
      "Composition des formes : hero occupe le centre, ambient reste discret derrière un contenu, edge se tient aux bords.",
    density: "Nombre de formes. Sans elle, la densité suit la variante et la largeur de l'écran.",
    intensity: "Facteur d'opacité des formes.",
    animated:
      "Fait dériver lentement les formes. Sans effet quand un mouvement réduit est demandé.",
    children: "Contenu centré au-dessus des formes décoratives.",
    color: "Couleur de fond, exprimée via une clé de la palette du thème.",
    minHeight: "Hauteur minimale du conteneur ; utilisez 100% pour épouser un parent dimensionné.",
    component: "Élément HTML rendu, par exemple main pour la zone principale d'une page.",
    sx: "Styles additionnels appliqués au conteneur externe.",
    contentSx: "Styles additionnels appliqués à la zone de contenu centrée.",
  },
};

const en: typeof fr = {
  intro:
    "Decorative background animated with organic shapes (circles, triangles, capsules) derived from the palette. It centers its content and serves as a backdrop for authentication screens and portal pages. The shapes adapt automatically to mobile.",
  sections: {
    basic: "Basic usage",
    color: "Color",
    content: "Content area",
    api: "API",
  },
  demos: {
    basic: {
      title: "Background with centered content",
      description:
        "Content is centered vertically and horizontally above the shapes. minHeight defaults to 100vh; here 100% fits the demo container.",
    },
    color: {
      title: "Custom tint",
      description: "color accepts any key of the theme palette to recolor the background.",
    },
    content: {
      title: "contentSx",
      description:
        "contentSx targets the centered content area, for example to constrain its width.",
    },
  },
  props: {
    variant:
      "Shape composition: hero fills the centre, ambient stays discreet behind content, edge keeps to the borders.",
    density: "Number of shapes. Without it, density follows the variant and the screen width.",
    intensity: "Opacity factor of the shapes.",
    animated: "Makes the shapes drift slowly. No effect when reduced motion is asked for.",
    children: "Content centered above the decorative shapes.",
    color: "Background color, expressed via a key of the theme palette.",
    minHeight: "Minimum height of the container; use 100% to fit a sized parent.",
    component: "Rendered HTML element, for example main for a page's main area.",
    sx: "Additional styles applied to the outer container.",
    contentSx: "Additional styles applied to the centered content area.",
  },
};

const texts = { fr, en };

export default function ShapeBackgroundDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "children",
      type: "ReactNode",
      description: t.props.children,
    },
    {
      name: "color",
      type: "string",
      defaultValue: '"primary.main"',
      description: t.props.color,
    },
    {
      name: "minHeight",
      type: "number | string",
      defaultValue: '"100vh"',
      description: t.props.minHeight,
    },
    {
      name: "component",
      type: "ElementType",
      defaultValue: '"div"',
      description: t.props.component,
    },
    {
      name: "sx",
      type: "SxProps<Theme>",
      description: t.props.sx,
    },
    {
      name: "contentSx",
      type: "SxProps<Theme>",
      description: t.props.contentSx,
    },
    {
      name: "variant",
      type: '"hero" | "ambient" | "edge"',
      defaultValue: '"hero"',
      description: t.props.variant,
    },
    {
      name: "density",
      type: "number",
      defaultValue: "selon la variante et le palier",
      description: t.props.density,
    },
    { name: "intensity", type: "number", defaultValue: "1", description: t.props.intensity },
    { name: "animated", type: "boolean", defaultValue: "false", description: t.props.animated },
  ];

  return (
    <DocPage title="ShapeBackground" intro={t.intro} importCode={importCode}>
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
                height: "24rem",
                width: "100%",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <ShapeBackground minHeight="100%">
              <Card title="CanopUI">Fond décoratif composé de formes organiques.</Card>
            </ShapeBackground>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.color}>
        <DemoCard
          title={t.demos.color.title}
          description={t.demos.color.description}
          code={colorCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                height: "24rem",
                width: "100%",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <ShapeBackground minHeight="100%" color="secondary.main">
              <Card>Le fond adopte la teinte fournie via la prop color.</Card>
            </ShapeBackground>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.content}>
        <DemoCard
          title={t.demos.content.title}
          description={t.demos.content.description}
          code={contentCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                height: "24rem",
                width: "100%",
                overflow: "hidden",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <ShapeBackground minHeight="100%" contentSx={{ maxWidth: "18rem" }}>
              <Card title="Contenu contraint">
                contentSx limite ici la largeur de la zone de contenu centrée.
              </Card>
            </ShapeBackground>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
