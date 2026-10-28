import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Feedback, Stack, Text, tokens } from "@canop/ui";
import { squircleClip } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import { CodeBlock } from "../../kit/CodeBlock";
import { monoFontFamily } from "../../kit/codeStyle";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PaletteSwatches } from "./PaletteSwatches";
import { NeonShowcase } from "./theming/NeonShowcase";

const cssVarsCode = `.mon-element {
  color: var(--canop-palette-primary-main);
  background: var(--canop-palette-background-paper);
  border-color: var(--canop-palette-divider);
}`;

const tokensCode = `import { tokens, palette, paletteDark } from "@canop/ui";

tokens.spacing.md;
tokens.typography.heading.h3.fontSize;
tokens.radius.md;
tokens.shadows.sm;`;

const seasonCode = `<CanopThemeProvider>
  <App />
</CanopThemeProvider>;`;

const forcedSeasonCode = `<CanopThemeProvider season="halloween">
  <App />
</CanopThemeProvider>;

<CanopThemeProvider season={null}>
  <App />
</CanopThemeProvider>;

const { season } = useCanopTheme();`;

const neonTuningCode = `:root {
  --canop-glow-intensity: 1;
  --canop-glow-core: 0.375rem;
  --canop-glow-aura: 1.5rem;
  --canop-glow-alpha: 60%;
  --canop-glow-flicker: none;
}`;

const headingSizes = Object.entries(tokens.typography.heading);

function TypographyScale() {
  return (
    <Stack gap="sm">
      {headingSizes.map(([name, style]) => (
        <Stack key={name} direction="row" alignItems="baseline" gap="md">
          <Typography
            sx={{
              width: "3rem",
              fontSize: "0.8rem",
              color: "text.secondary",
              fontFamily: monoFontFamily,
            }}
          >
            {name}
          </Typography>
          <Typography sx={style} noWrap>
            Canopée
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.disabled",
              fontFamily: monoFontFamily,
            }}
          >
            {`${style.fontSize}  ·  ${style.letterSpacing}`}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

const spacingEntries = Object.entries(tokens.spacing).filter(([name]) => name !== "unit");

function SpacingScale() {
  return (
    <Stack gap="sm">
      {spacingEntries.map(([name, value]) => (
        <Stack key={name} direction="row" alignItems="center" gap="md">
          <Typography
            sx={{
              width: "3rem",
              fontSize: "0.8rem",
              color: "text.secondary",
              fontFamily: monoFontFamily,
            }}
          >
            {name}
          </Typography>
          <Box
            sx={[
              {
                height: "1rem",
                width: value,
                bgcolor: "primary.main",
              },
              squircleClip(tokens.radius.xs),
            ]}
          />
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.disabled",
              fontFamily: monoFontFamily,
            }}
          >
            {value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

const fr = {
  title: "Theming",
  intro:
    "Les design tokens CanopUI (palette, typographie, espacements, rayons, ombres) sont injectés dans le thème MUI et exposés en CSS variables préfixées --canop-. Deux palettes complètes couvrent les modes light et dark.",
  lightTitle: "Palette light",
  lightDescription:
    "Sept familles de couleurs, chacune déclinée en main, light et dark avec un contrastText garanti accessible.",
  darkTitle: "Palette dark",
  darkDescription:
    "La palette sombre inverse les rapports de luminosité tout en conservant l'identité de chaque famille. Son primary a été choisi au contraste : il passe le seuil de 4,5:1 du petit texte sur toutes les surfaces sombres sauf la plus élevée, où il vaut 4,36:1. Sur un fond overlay — menus, popovers — préférer light, qui y vaut 6,77:1.",
  neonTitle: "Néon en thème sombre",
  neonDescription:
    "En thème sombre, la librairie s'illumine : chaque composant porte un halo dans la couleur de sa palette, un cœur serré et lumineux sous une aura large et diffuse, discret au repos et plus intense au survol ou au focus clavier. Les titres affichés en taille h1 à h3 portent un vrai néon, qui grésille brièvement à leur apparition, sauf en mouvement réduit. Le thème clair ne change pas ; la scène ci-dessous est forcée en sombre.",
  neonTuning:
    "Le halo se règle par cinq variables CSS, sur :root ou sur un conteneur : intensité globale, rayon du cœur, rayon de l'aura, opacité, et animation des titres, que none coupe. Voici leurs valeurs par défaut ; leurs noms sont exportés dans NEON_GLOW_VAR.",
  neonScene: {
    heading: "Bonsoir Martin",
    confirm: "Valider",
    compare: "Comparer",
    highlight: "Mettre en avant",
    remove: "Supprimer",
    paid: "Payée",
    pending: "En attente",
    refused: "Refusée",
    notifications: "Notifications",
    remember: "Se souvenir de moi",
    upload: "Import des fichiers",
  },
  typographyTitle: "Typographie",
  typographyDescription:
    "Titan One pour les titres, Chivo pour le reste, échelle modulaire dans les deux cas. Le détail complet — corps de texte, graisses, crénage optique et variantes numériques — vit sur la page Typographie.",
  spacingTitle: "Espacements",
  cssVarsTitle: "CSS variables",
  cssVarsDescription:
    "Toutes les couleurs du thème sont disponibles en CSS variables, utilisables dans n'importe quel style.",
  cssVarsFeedback:
    "Les CSS variables changent automatiquement de valeur quand le mode light/dark bascule : aucun style conditionnel à écrire.",
  tokensTitle: "Tokens en TypeScript",
  tokensDescription: "Les mêmes tokens sont importables pour les rares styles calculés côté JS.",
  seasonTitle: "Thème saisonnier",
  seasonDescription:
    "Le CanopThemeProvider applique seul la saison en cours, en clair comme en sombre, avec son décor : halloween du 15 octobre au 1er novembre inclus, chaque année, sans aucun code dans le portail. La date est lue au montage, un onglet ouvert ne change de saison qu'au rechargement.",
  seasonForcedDescription:
    'Pour forcer la saison, passer season="halloween" ; pour la couper, palette et décor, passer season={null} ; seasonalDecor={false} garde la palette sans le décor. useCanopTheme().season lit la saison effective, sans setter ni persistance.',
  halloweenLightTitle: "Halloween light, parchemin de grimoire",
  halloweenLightDescription:
    "Fond parchemin, citrouille brûlée en primary, violet de sorcière en secondary et maïs bonbon en accent. Le texte tient au moins 6,78:1 sur toutes les surfaces, le primary 5,04:1.",
  halloweenDarkTitle: "Halloween dark, Nuit de la Canopée",
  halloweenDarkDescription:
    "Nuit violine, citrouille lumineuse, violet de sorcière et accent ectoplasme. Le texte secondaire tient au moins 7,71:1, le primary au moins 6,2:1 sur toutes les surfaces, et les titres prennent une lueur douce.",
};

const en: typeof fr = {
  title: "Theming",
  intro:
    "CanopUI design tokens (palette, typography, spacing, radii, shadows) are injected into the MUI theme and exposed as CSS variables prefixed with --canop-. Two complete palettes cover the light and dark modes.",
  lightTitle: "Light palette",
  lightDescription:
    "Seven color families, each declined in main, light and dark with an accessible contrastText guaranteed.",
  darkTitle: "Dark palette",
  darkDescription:
    "The dark palette inverts the luminosity ratios while preserving each family's identity. Its primary was picked on contrast: it clears the 4.5:1 small-text threshold on every dark surface but the highest, where it sits at 4.36:1. On an overlay background — menus, popovers — prefer light, which reaches 6.77:1 there.",
  neonTitle: "Neon in dark theme",
  neonDescription:
    "In dark theme the library lights up: every component carries a halo in its palette colour, a tight bright core under a wide diffuse aura, quiet at rest and stronger on hover or keyboard focus. Headings displayed at h1 to h3 size carry a real neon that flickers briefly as they appear, except under reduced motion. The light theme does not change; the scene below is forced to dark.",
  neonTuning:
    "The halo is tuned through five CSS variables, on :root or on a container: overall intensity, core radius, aura radius, opacity, and the heading animation, which none turns off. Here are their default values; their names are exported in NEON_GLOW_VAR.",
  neonScene: {
    heading: "Good evening Martin",
    confirm: "Confirm",
    compare: "Compare",
    highlight: "Highlight",
    remove: "Delete",
    paid: "Paid",
    pending: "Pending",
    refused: "Refused",
    notifications: "Notifications",
    remember: "Remember me",
    upload: "File import",
  },
  typographyTitle: "Typography",
  typographyDescription:
    "Titan One for headings, Chivo for everything else, a modular scale in both cases. The full detail — body text, weights, optical tracking and numeric variants — lives on the Typography page.",
  spacingTitle: "Spacing",
  cssVarsTitle: "CSS variables",
  cssVarsDescription: "Every theme color is available as a CSS variable, usable in any style.",
  cssVarsFeedback:
    "CSS variables update their value automatically when the light/dark mode switches: no conditional styling to write.",
  tokensTitle: "Tokens in TypeScript",
  tokensDescription: "The same tokens can be imported for the rare styles computed on the JS side.",
  seasonTitle: "Seasonal theme",
  seasonDescription:
    "CanopThemeProvider applies the current season on its own, in light as in dark, with its decor: halloween from 15 October to 1 November inclusive, every year, with no code in the portal. The date is read on mount, an open tab only changes season on reload.",
  seasonForcedDescription:
    'To force the season, pass season="halloween"; to turn off palette and decor, pass season={null}; seasonalDecor={false} keeps the palette without the decor. useCanopTheme().season reads the effective season, with no setter and no persistence.',
  halloweenLightTitle: "Halloween light, grimoire parchment",
  halloweenLightDescription:
    "Parchment background, burnt pumpkin primary, witch violet secondary and candy corn accent. Text reaches at least 6.78:1 on every surface, the primary 5.04:1.",
  halloweenDarkTitle: "Halloween dark, Canopy Night",
  halloweenDarkDescription:
    "Violet night, glowing pumpkin, witch violet and an ectoplasm accent. Secondary text reaches at least 7.71:1, the primary at least 6.2:1 on every surface, and headings take a soft glow.",
};

const texts = { fr, en };

export function ThemingPage() {
  const t = texts[useDocLocale()];
  return (
    <DocPage title={t.title} intro={t.intro}>
      <DocSection title={t.lightTitle} description={t.lightDescription}>
        <PaletteSwatches source="light" />
      </DocSection>
      <DocSection title={t.darkTitle} description={t.darkDescription}>
        <PaletteSwatches source="dark" />
      </DocSection>
      <DocSection title={t.neonTitle} description={t.neonDescription}>
        <NeonShowcase texts={t.neonScene} />
        <Stack gap="sm">
          <Text tone="muted">{t.neonTuning}</Text>
          <CodeBlock code={neonTuningCode} />
        </Stack>
      </DocSection>
      <DocSection title={t.seasonTitle} description={t.seasonDescription}>
        <CodeBlock code={seasonCode} />
        <Feedback severity="info">{t.seasonForcedDescription}</Feedback>
        <CodeBlock code={forcedSeasonCode} />
      </DocSection>
      <DocSection title={t.halloweenLightTitle} description={t.halloweenLightDescription}>
        <PaletteSwatches source="halloween" />
      </DocSection>
      <DocSection title={t.halloweenDarkTitle} description={t.halloweenDarkDescription}>
        <PaletteSwatches source="halloweenDark" />
      </DocSection>
      <DocSection title={t.typographyTitle} description={t.typographyDescription}>
        <TypographyScale />
      </DocSection>
      <DocSection title={t.spacingTitle}>
        <SpacingScale />
      </DocSection>
      <DocSection title={t.cssVarsTitle} description={t.cssVarsDescription}>
        <CodeBlock code={cssVarsCode} />
        <Feedback severity="info">{t.cssVarsFeedback}</Feedback>
      </DocSection>
      <DocSection title={t.tokensTitle} description={t.tokensDescription}>
        <CodeBlock code={tokensCode} />
      </DocSection>
    </DocPage>
  );
}
