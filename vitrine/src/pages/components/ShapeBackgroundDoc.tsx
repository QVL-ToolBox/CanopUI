import Stack from "@mui/material/Stack";
import { DemoCard } from "../../kit/DemoCard";
import { DemoViewport } from "../../kit/DemoViewport";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { ThemeScope } from "../../kit/themeScope/ThemeScope";
import { useDocLocale } from "../../i18n/useDocLocale";
import { LavaShowcase } from "./shapeBackgroundDoc/LavaShowcase";

const importCode = `import { ShapeBackground } from "@canop/ui";`;

const basicCode = `<Box height="24rem" width="100%" overflow="hidden">
  <ShapeBackground animated minHeight="100%" contentSx={{ maxWidth: "22rem" }}>
    <Card variant="frosted" title="CanopUI">
      Trame de points traversée de masses de lave lumineuses.
    </Card>
  </ShapeBackground>
</Box>`;

const modesCode = `<ShapeBackground animated minHeight="100%">
  <Card variant="frosted" title="Thème courant">
    Le fond suit le thème clair ou sombre de l'application.
  </Card>
</ShapeBackground>`;

const colorCode = `<ShapeBackground animated minHeight="100%" color="accent">
  <Card variant="frosted" title="Accent">
    color accepte un nom de palette ou une clé comme "accent.main".
  </Card>
</ShapeBackground>

<PageScaffold background="shapes" backgroundTone="accent" items={items}>
  <PageContent>…</PageContent>
</PageScaffold>`;

const tuningCode = `<ShapeBackground animated minHeight="100%" density={4} intensity={1.3}>
  <Card variant="frosted" title="Quatre masses">
    density fixe le nombre de masses, intensity multiplie leur éclat.
  </Card>
</ShapeBackground>`;

const fr = {
  intro:
    "Fond « trame lave » : une trame de points discrète que traversent des masses lumineuses à la manière d'une lampe à lave, teintées d'une seule couleur de la palette. Il suit le thème clair ou sombre, centre son contenu et accueille volontiers une carte givrée. Animé, il ondule à 30 images par seconde et se met en pause hors écran ou onglet masqué ; sans animation ou en mouvement réduit, il reste une image fixe.",
  sections: {
    basic: "Usage de base",
    modes: "Clair et sombre",
    color: "Couleur",
    tuning: "Densité et intensité",
    api: "API",
  },
  demos: {
    basic: {
      title: "Fond avec carte givrée",
      description:
        "Le contenu est centré au-dessus de la trame. minHeight vaut 100vh par défaut ; ici 100% épouse le conteneur de démonstration.",
      cardTitle: "CanopUI",
      cardBody: "Trame de points traversée de masses de lave lumineuses.",
    },
    modes: {
      title: "Le même fond, thème clair puis sombre",
      description:
        "Aucun réglage à faire : la teinte, l'encre des points et les lueurs se lisent dans les variables du thème courant.",
      lightTitle: "Thème clair",
      darkTitle: "Thème sombre",
      cardBody: "Le fond suit le thème de l'application.",
    },
    color: {
      title: "Lave en couleur d'accent",
      description:
        "color choisit la couleur unique du fond : lueurs, points allumés et teinte du fond la suivent, en clair comme en sombre ; seule la trame au repos garde l'encre neutre du texte. Les clés héritées comme accent.main restent acceptées. Dans un gabarit, PageScaffold et Layout passent par backgroundTone, que cette vitrine règle sur accent.",
      lightTitle: "Accent, thème clair",
      darkTitle: "Accent, thème sombre",
      cardBody: "Les masses prennent la teinte accent de la palette.",
    },
    tuning: {
      title: "density et intensity",
      description:
        "density fixe le nombre de masses, de 1 à 10. intensity multiplie l'éclat des masses et des points.",
      cardTitle: "Quatre masses",
      cardBody: "Moins de masses, plus lumineuses.",
    },
  },
  props: {
    children: "Contenu centré au-dessus du fond.",
    animated:
      "Fait onduler les masses. Sans effet quand un mouvement réduit est demandé : le fond reste alors une image fixe.",
    color:
      "Couleur unique du fond : un nom de palette (primary, secondary, accent, info, success, warning, error) ou une clé comme primary.main, dont seul le nom est retenu.",
    intensity: "Multiplicateur de l'éclat des masses, des lueurs et des points. 1 rend la recette.",
    density: "Nombre de masses de lave, de 1 à 10.",
    variant:
      "Disposition du contenu : hero et ambient le centrent sur 100vh, edge le pose en haut, sans hauteur minimale. Le rendu du fond est identique.",
    minHeight: "Hauteur minimale du conteneur ; utilisez 100% pour épouser un parent dimensionné.",
    component: "Élément HTML rendu, par exemple main pour la zone principale d'une page.",
    sx: "Styles additionnels appliqués au conteneur externe.",
    contentSx: "Styles additionnels appliqués à la zone de contenu.",
  },
};

const en: typeof fr = {
  intro:
    "Lava dot grid background: a discreet grid of dots crossed by glowing masses, like a lava lamp, tinted with a single palette colour. It follows the light or dark theme, centres its content and happily hosts a frosted card. When animated, it flows at 30 frames per second and pauses off screen or in a hidden tab; without animation or with reduced motion, it stays a still image.",
  sections: {
    basic: "Basic usage",
    modes: "Light and dark",
    color: "Colour",
    tuning: "Density and intensity",
    api: "API",
  },
  demos: {
    basic: {
      title: "Background with a frosted card",
      description:
        "Content is centred above the grid. minHeight defaults to 100vh; here 100% fits the demo container.",
      cardTitle: "CanopUI",
      cardBody: "A dot grid crossed by glowing lava masses.",
    },
    modes: {
      title: "The same background, light then dark theme",
      description:
        "Nothing to set: the tint, the dot ink and the glows are read from the current theme variables.",
      lightTitle: "Light theme",
      darkTitle: "Dark theme",
      cardBody: "The background follows the application theme.",
    },
    color: {
      title: "Lava in the accent colour",
      description:
        "color picks the single colour of the background: glows, lit dots and the background tint follow it, in light as in dark; only the resting grid keeps the neutral text ink. Legacy keys such as accent.main are still accepted. In a template, PageScaffold and Layout go through backgroundTone, which this showcase sets to accent.",
      lightTitle: "Accent, light theme",
      darkTitle: "Accent, dark theme",
      cardBody: "The masses take the accent hue of the palette.",
    },
    tuning: {
      title: "density and intensity",
      description:
        "density sets the number of masses, from 1 to 10. intensity multiplies the glow of masses and dots.",
      cardTitle: "Four masses",
      cardBody: "Fewer masses, brighter ones.",
    },
  },
  props: {
    children: "Content centred above the background.",
    animated:
      "Makes the masses flow. No effect when reduced motion is asked for: the background then stays a still image.",
    color:
      "Single colour of the background: a palette name (primary, secondary, accent, info, success, warning, error) or a key such as primary.main, of which only the name is kept.",
    intensity: "Multiplier of the glow of masses, halos and dots. 1 renders the recipe.",
    density: "Number of lava masses, from 1 to 10.",
    variant:
      "Content layout: hero and ambient centre it over 100vh, edge sets it at the top with no minimum height. The background looks the same.",
    minHeight: "Minimum height of the container; use 100% to fit a sized parent.",
    component: "Rendered HTML element, for example main for a page's main area.",
    sx: "Additional styles applied to the outer container.",
    contentSx: "Additional styles applied to the content area.",
  },
};

const texts = { fr, en };

export default function ShapeBackgroundDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    { name: "children", type: "ReactNode", description: t.props.children },
    { name: "animated", type: "boolean", defaultValue: "false", description: t.props.animated },
    { name: "color", type: "string", defaultValue: '"primary.main"', description: t.props.color },
    { name: "intensity", type: "number", defaultValue: "1", description: t.props.intensity },
    { name: "density", type: "number", defaultValue: "10", description: t.props.density },
    {
      name: "variant",
      type: '"hero" | "ambient" | "edge"',
      defaultValue: '"hero"',
      description: t.props.variant,
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
    { name: "sx", type: "SxProps<Theme>", description: t.props.sx },
    { name: "contentSx", type: "SxProps<Theme>", description: t.props.contentSx },
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
          <DemoViewport>
            <LavaShowcase title={t.demos.basic.cardTitle} body={t.demos.basic.cardBody} />
          </DemoViewport>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.modes}>
        <DemoCard
          title={t.demos.modes.title}
          description={t.demos.modes.description}
          code={modesCode}
          align="stretch"
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <DemoViewport height="22rem">
              <ThemeScope mode="light">
                <LavaShowcase title={t.demos.modes.lightTitle} body={t.demos.modes.cardBody} />
              </ThemeScope>
            </DemoViewport>
            <DemoViewport height="22rem">
              <ThemeScope mode="dark">
                <LavaShowcase title={t.demos.modes.darkTitle} body={t.demos.modes.cardBody} />
              </ThemeScope>
            </DemoViewport>
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.color}>
        <DemoCard
          title={t.demos.color.title}
          description={t.demos.color.description}
          code={colorCode}
          align="stretch"
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <DemoViewport height="22rem">
              <ThemeScope mode="light">
                <LavaShowcase
                  color="accent"
                  title={t.demos.color.lightTitle}
                  body={t.demos.color.cardBody}
                />
              </ThemeScope>
            </DemoViewport>
            <DemoViewport height="22rem">
              <ThemeScope mode="dark">
                <LavaShowcase
                  color="accent"
                  title={t.demos.color.darkTitle}
                  body={t.demos.color.cardBody}
                />
              </ThemeScope>
            </DemoViewport>
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.tuning}>
        <DemoCard
          title={t.demos.tuning.title}
          description={t.demos.tuning.description}
          code={tuningCode}
          align="stretch"
        >
          <DemoViewport>
            <LavaShowcase
              density={4}
              intensity={1.3}
              title={t.demos.tuning.cardTitle}
              body={t.demos.tuning.cardBody}
            />
          </DemoViewport>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
