import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Heading, Stack, Text, tokens } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { monoFontFamily } from "../../kit/codeStyle";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { useDocLocale } from "../../i18n/useDocLocale";
import { TypeSpecimen, TypeSpecimenList } from "./TypeSpecimen";

const fontFaceCode = `@font-face {
  font-family: "Chivo";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("./assets/fonts/chivo-variable-latin.woff2") format("woff2");
}

@font-face {
  font-family: "Titan One";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("./assets/fonts/titan-one-latin.woff2") format("woff2");
}`;

const usageCode = `import { Heading, Text } from "@canop/ui";

<Heading level={1} size={2}>Tableau de bord</Heading>
<Text variant="lead">Suivi de la flotte en temps réel.</Text>
<Text>Trente-huit véhicules sont en service ce matin.</Text>
<Text variant="caption" tone="muted">Mis à jour il y a 2 minutes</Text>`;

const headingTokens = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const appTokens = [
  "title-lg",
  "title-md",
  "title-sm",
  "lead",
  "body-lg",
  "body-md",
  "body-sm",
  "label",
  "caption",
  "overline",
  "metric",
  "code",
] as const;

const weightTokens = ["light", "regular", "medium", "semibold", "bold", "extrabold"] as const;

const lineHeightTokens = ["tight", "snug", "normal", "relaxed"] as const;

const hierarchyTones = ["default", "muted", "subtle"] as const;

const paletteTones = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
] as const;

const fr = {
  intro:
    "CanopUI compose avec deux fontes : Titan One pour les titres, Chivo — en police variable — pour tout le reste. Le réglage porte autant que le choix des fontes : une échelle modulaire de ratio 1,333, un crénage optique qui se resserre à mesure que le texte grandit, et six graisses tirées d'un fichier unique côté corps de texte.",
  font: {
    title: "Les fontes",
    description:
      "Les deux sont auto-hébergées dans le paquet, chacune en deux sous-ensembles latin et latin étendu. Chivo est variable : un seul fichier couvre tout l'axe de graisse, de 100 à 900, sans requête supplémentaire quand on change de graisse. Titan One ne publie qu'un seul poids, le 400 — les titres sont donc composés à ce poids, et non au 700 d'avant la 0.0 : demander un gras ferait fabriquer au navigateur un faux gras, plus lourd et plus sale que le dessin d'origine.",
    sample: "Titan One — titres",
    sampleBody: "Chivo — police variable",
  },
  headings: {
    title: "Titres",
    description:
      "Six échelles de titres, du plus imposant au plus discret, toutes composées en Titan One. Le composant Heading dissocie le niveau sémantique de la taille visuelle.",
  },
  app: {
    title: "Corps de texte, libellés et métriques",
    description:
      "L'échelle applicative couvre tout ce qui n'est pas un titre. Le composant Text l'expose intégralement, chaque rôle portant sa taille, sa graisse, son interligne et son crénage.",
  },
  colors: {
    title: "Couleurs de texte",
    description:
      "Par défaut le texte reste sur la couleur de texte du thème — noir sur fond clair, blanc sur fond sombre. Les sept familles de la palette sont disponibles pour faire ressortir un mot, un statut ou une valeur, jamais un paragraphe entier.",
    hierarchy: "Niveaux de hiérarchie",
    palette: "Familles de la palette",
  },
  tracking: {
    title: "Crénage optique",
    description:
      "Plus un texte est grand, plus les blancs entre les lettres paraissent larges. Le crénage se resserre donc à mesure que la taille monte, et s'ouvre au contraire sur les petites tailles et les capitales.",
    withoutLabel: "Sans réglage",
    withLabel: "Réglage CanopUI",
    ladder: "L'échelle complète",
    sample: "Flotte de véhicules",
  },
  lineHeights: {
    title: "Interlignes",
    description:
      "Quatre interlignes, du titre serré au paragraphe aéré. Ils sont portés par les rôles typographiques, rarement à régler à la main.",
    sample:
      "Trente-huit véhicules sont en service ce matin, répartis sur les quatre secteurs de la métropole. Deux immobilisations sont prévues cette semaine.",
  },
  numeric: {
    title: "Variantes numériques",
    description:
      "Les chiffres tabulaires ont tous la même chasse : une valeur qui se met à jour ne décale plus la mise en page. Le zéro barré lève l'ambiguïté avec la lettre O.",
    proportional: "Chiffres proportionnels",
    tabular: "Chiffres tabulaires",
    slashed: "Zéro barré",
  },
  specimen: {
    title: "Spécimen",
    description: "Les rôles typographiques assemblés comme sur un écran réel.",
    overline: "Flotte metropole",
    heading: "Tableau de bord",
    lead: "Suivi de la flotte en temps réel, secteur par secteur.",
    body: "Trente-huit véhicules sont en service ce matin, répartis sur les quatre secteurs de la métropole. Deux immobilisations sont prévues cette semaine, sans impact sur les tournées programmées.",
    metricLabel: "Véhicules en service",
    trend: "+4 depuis hier",
    caption: "Mis à jour il y a 2 minutes",
  },
  usage: { title: "Mise en oeuvre" },
};

const en: typeof fr = {
  intro:
    "CanopUI works with two typefaces: Titan One for headings, Chivo — in its variable form — for everything else. The tuning matters as much as the choice: a modular scale with a 1.333 ratio, optical tracking that tightens as the text grows, and six weights drawn from a single file on the body side.",
  font: {
    title: "The typefaces",
    description:
      "Both are self-hosted inside the package, each in two subsets, latin and latin extended. Chivo is variable: a single file covers the whole weight axis, from 100 to 900, with no extra request when the weight changes. Titan One publishes a single weight, 400 — headings are therefore set at that weight rather than the 700 used before 0.0: asking for bold would make the browser fake it, heavier and dirtier than the original drawing.",
    sample: "Titan One — headings",
    sampleBody: "Chivo — variable font",
  },
  headings: {
    title: "Headings",
    description:
      "Six heading scales, from the most imposing to the most discreet. The Heading component decouples the semantic level from the visual size.",
  },
  app: {
    title: "Body text, labels and metrics",
    description:
      "The application scale covers everything that is not a heading. The Text component exposes it in full, each role carrying its size, weight, line height and tracking.",
  },
  colors: {
    title: "Text colors",
    description:
      "By default the text stays on the theme text color — black on a light background, white on a dark one. The seven palette families are there to bring out a word, a status or a value, never a whole paragraph.",
    hierarchy: "Hierarchy levels",
    palette: "Palette families",
  },
  tracking: {
    title: "Optical tracking",
    description:
      "The larger a text, the wider the gaps between letters appear. Tracking therefore tightens as the size grows, and opens up instead at small sizes and on uppercase.",
    withoutLabel: "Untuned",
    withLabel: "CanopUI tuning",
    ladder: "The full scale",
    sample: "Vehicle fleet",
  },
  lineHeights: {
    title: "Line heights",
    description:
      "Four line heights, from the tight heading to the airy paragraph. They are carried by the typographic roles and rarely need manual tuning.",
    sample:
      "Thirty-eight vehicles are in service this morning, spread across the four districts of the metropolitan area. Two are scheduled off the road this week.",
  },
  numeric: {
    title: "Numeric variants",
    description:
      "Tabular figures all share the same width: an updating value no longer shifts the layout. The slashed zero removes any ambiguity with the letter O.",
    proportional: "Proportional figures",
    tabular: "Tabular figures",
    slashed: "Slashed zero",
  },
  specimen: {
    title: "Specimen",
    description: "The typographic roles assembled as on a real screen.",
    overline: "Metropolitan fleet",
    heading: "Dashboard",
    lead: "Real-time fleet monitoring, district by district.",
    body: "Thirty-eight vehicles are in service this morning, spread across the four districts of the metropolitan area. Two are scheduled off the road this week, with no impact on the planned rounds.",
    metricLabel: "Vehicles in service",
    trend: "+4 since yesterday",
    caption: "Updated 2 minutes ago",
  },
  usage: { title: "Getting it on screen" },
};

const texts = { fr, en };

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: "0.0625rem solid",
        borderColor: "divider",
        borderRadius: tokens.radius.md,
        padding: { xs: tokens.spacing.md, md: tokens.spacing.lg },
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  );
}

function MonoCaption({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="p"
      sx={{
        color: "text.disabled",
        fontSize: "0.75rem",
        fontFamily: monoFontFamily,
      }}
    >
      {children}
    </Typography>
  );
}

function Specimen({
  titre,
  famille,
  graisse,
}: {
  titre: string;
  famille: string;
  graisse: number;
}) {
  return (
    <Panel>
      <Stack gap="xs">
        <Typography
          component="p"
          sx={{
            fontFamily: famille,
            fontSize: "clamp(2rem, 7vw, 3.5rem)",
            fontWeight: graisse,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.tightest,
          }}
        >
          {titre}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: famille,
            fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
            fontWeight: graisse,
            lineHeight: tokens.typography.lineHeight.snug,
            letterSpacing: tokens.typography.letterSpacing.compact,
            overflowWrap: "anywhere",
          }}
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
        </Typography>
      </Stack>
    </Panel>
  );
}

export function TypographyPage() {
  const locale = useDocLocale();
  const t = texts[locale];

  return (
    <DocPage title={locale === "fr" ? "Typographie" : "Typography"} intro={t.intro}>
      <DocSection title={t.font.title} description={t.font.description}>
        <Stack gap="md">
          <Specimen
            titre={t.font.sample}
            famille={tokens.typography.fontFamilyHeading}
            graisse={tokens.typography.fontWeight.regular}
          />
          <Specimen
            titre={t.font.sampleBody}
            famille={tokens.typography.fontFamily}
            graisse={tokens.typography.fontWeight.extrabold}
          />
          <CodeBlock code={fontFaceCode} />
        </Stack>
      </DocSection>

      <DocSection title={t.headings.title} description={t.headings.description}>
        <TypeSpecimenList>
          {headingTokens.map((name) => (
            <TypeSpecimen
              key={name}
              token={`typography.heading.${name}`}
              style={tokens.typography.heading[name]}
              sample={locale === "fr" ? "Flotte de véhicules" : "Vehicle fleet"}
            />
          ))}
        </TypeSpecimenList>
      </DocSection>

      <DocSection title={t.app.title} description={t.app.description}>
        <TypeSpecimenList>
          {appTokens.map((name) => (
            <TypeSpecimen
              key={name}
              token={`typography.app["${name}"]`}
              style={tokens.typography.app[name]}
              uppercase={name === "overline"}
              sample={
                name === "metric"
                  ? "1 204,50"
                  : name === "code"
                    ? "npm i @canop/ui"
                    : locale === "fr"
                      ? "Flotte de véhicules"
                      : "Vehicle fleet"
              }
            />
          ))}
        </TypeSpecimenList>
      </DocSection>

      <DocSection
        title={locale === "fr" ? "Graisses" : "Weights"}
        description={
          locale === "fr"
            ? "Six graisses tirées du même fichier variable."
            : "Six weights drawn from the same variable file."
        }
      >
        <TypeSpecimenList>
          {weightTokens.map((name) => (
            <TypeSpecimen
              key={name}
              token={`typography.fontWeight.${name}`}
              style={{
                fontSize: "1.5rem",
                fontWeight: tokens.typography.fontWeight[name],
                lineHeight: tokens.typography.lineHeight.snug,
                letterSpacing: tokens.typography.letterSpacing.compact,
              }}
              sample={`Chivo ${name}`}
            />
          ))}
        </TypeSpecimenList>
      </DocSection>

      <DocSection title={t.colors.title} description={t.colors.description}>
        <Stack gap="md">
          <Panel>
            <Stack gap="xs">
              <MonoCaption>{t.colors.hierarchy}</MonoCaption>
              {hierarchyTones.map((tone) => (
                <Text key={tone} variant="body-lg" tone={tone}>
                  {`tone="${tone}" — ${t.tracking.sample}`}
                </Text>
              ))}
            </Stack>
          </Panel>
          <Panel>
            <Stack gap="xs">
              <MonoCaption>{t.colors.palette}</MonoCaption>
              {paletteTones.map((tone) => (
                <Text key={tone} variant="body-lg" weight="semibold" tone={tone}>
                  {`tone="${tone}" — ${t.tracking.sample}`}
                </Text>
              ))}
            </Stack>
          </Panel>
        </Stack>
      </DocSection>

      <DocSection title={t.tracking.title} description={t.tracking.description}>
        <Stack gap="md">
          <Panel>
            <Stack gap="md">
              <Stack gap="xs">
                <MonoCaption>{`${t.tracking.withoutLabel} — 0em`}</MonoCaption>
                <Typography
                  component="p"
                  sx={{
                    fontSize: tokens.typography.heading.h3.fontSize,
                    fontWeight: tokens.typography.fontWeight.bold,
                    lineHeight: tokens.typography.lineHeight.tight,
                    letterSpacing: tokens.typography.letterSpacing.none,
                  }}
                >
                  {t.tracking.sample}
                </Typography>
              </Stack>
              <Stack gap="xs">
                <MonoCaption>
                  {`${t.tracking.withLabel} — ${tokens.typography.heading.h3.letterSpacing}`}
                </MonoCaption>
                <Typography component="p" sx={tokens.typography.heading.h3}>
                  {t.tracking.sample}
                </Typography>
              </Stack>
            </Stack>
          </Panel>

          <Stack gap="xs">
            <Heading level={3} size={5} gutterBottom={false}>
              {t.tracking.ladder}
            </Heading>
            <TypeSpecimenList>
              {(
                Object.entries(tokens.typography.letterSpacing) as [
                  keyof typeof tokens.typography.letterSpacing,
                  string,
                ][]
              ).map(([name, value]) => (
                <TypeSpecimen
                  key={name}
                  token={`typography.letterSpacing.${name}`}
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: tokens.typography.fontWeight.medium,
                    lineHeight: tokens.typography.lineHeight.snug,
                    letterSpacing: value,
                  }}
                  sample={t.tracking.sample}
                />
              ))}
            </TypeSpecimenList>
          </Stack>
        </Stack>
      </DocSection>

      <DocSection title={t.lineHeights.title} description={t.lineHeights.description}>
        <TypeSpecimenList>
          {lineHeightTokens.map((name) => (
            <Stack key={name} gap="xs">
              <MonoCaption>
                {`typography.lineHeight.${name} — ${tokens.typography.lineHeight[name]}`}
              </MonoCaption>
              <Box
                sx={{
                  maxWidth: "32rem",
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    ...tokens.typography.app["body-md"],
                    lineHeight: tokens.typography.lineHeight[name],
                  }}
                >
                  {t.lineHeights.sample}
                </Typography>
              </Box>
            </Stack>
          ))}
        </TypeSpecimenList>
      </DocSection>

      <DocSection title={t.numeric.title} description={t.numeric.description}>
        <Panel>
          <Stack gap="md">
            <Stack gap="xs">
              <MonoCaption>{t.numeric.proportional}</MonoCaption>
              <Text variant="metric" tabularNums={false}>
                1 204,50
              </Text>
              <Text variant="metric" tabularNums={false}>
                1 999,00
              </Text>
            </Stack>
            <Stack gap="xs">
              <MonoCaption>{`${t.numeric.tabular} — tabular-nums`}</MonoCaption>
              <Text variant="metric">1 204,50</Text>
              <Text variant="metric">1 999,00</Text>
            </Stack>
            <Stack gap="xs">
              <MonoCaption>{`${t.numeric.slashed} — slashed-zero`}</MonoCaption>
              <Text variant="metric" slashedZero>
                0 807 990
              </Text>
            </Stack>
          </Stack>
        </Panel>
      </DocSection>

      <DocSection title={t.specimen.title} description={t.specimen.description}>
        <Panel>
          <Box
            sx={{
              maxWidth: "36rem",
            }}
          >
            <Stack gap="sm">
              <Text variant="overline" tone="muted">
                {t.specimen.overline}
              </Text>
              <Heading level={2} size={3} gutterBottom={false}>
                {t.specimen.heading}
              </Heading>
              <Text variant="lead" tone="muted">
                {t.specimen.lead}
              </Text>
              <Text>{t.specimen.body}</Text>
              <Stack gap="xs">
                <Text variant="metric">38</Text>
                <Text variant="label" tone="muted">
                  {t.specimen.metricLabel}
                </Text>
                <Text variant="label" tone="success">
                  {t.specimen.trend}
                </Text>
              </Stack>
              <Text variant="caption" tone="subtle">
                {t.specimen.caption}
              </Text>
            </Stack>
          </Box>
        </Panel>
      </DocSection>

      <DocSection title={t.usage.title}>
        <CodeBlock code={usageCode} />
      </DocSection>
    </DocPage>
  );
}
