import { Feedback, Stack, Text } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Text } from "@canop/ui";`;

const variantsCode = `<Text variant="lead">Accroche d'introduction</Text>
<Text variant="body-lg">Corps de texte large</Text>
<Text variant="body-md">Corps de texte courant</Text>
<Text variant="body-sm">Corps de texte dense</Text>
<Text variant="label">Libellé de champ</Text>
<Text variant="caption">Légende d'illustration</Text>
<Text variant="overline">Catégorie</Text>
<Text variant="metric">1 204</Text>
<Text variant="display">42</Text>
<Text variant="code">npm i @canop/ui</Text>`;

const weightsCode = `<Text weight="light">Chivo light</Text>
<Text weight="regular">Chivo regular</Text>
<Text weight="medium">Chivo medium</Text>
<Text weight="semibold">Chivo semibold</Text>
<Text weight="bold">Chivo bold</Text>
<Text weight="extrabold">Chivo extrabold</Text>`;

const tonesCode = `<Text tone="default">Ton par défaut</Text>
<Text tone="muted">Ton secondaire</Text>
<Text tone="subtle">Ton discret</Text>`;

const paletteTonesCode = `<Text tone="primary">Primary</Text>
<Text tone="secondary">Secondary</Text>
<Text tone="accent">Accent</Text>
<Text tone="success">Success</Text>
<Text tone="warning">Warning</Text>
<Text tone="error">Error</Text>
<Text tone="info">Info</Text>`;

const numericCode = `<Text variant="metric">1 204,50</Text>
<Text variant="metric" tabularNums={false}>1 204,50</Text>
<Text variant="metric" slashedZero>0 807 990</Text>`;

const asCode = `<Text as="strong" weight="bold">Mise en avant</Text>
<Text as="span" variant="body-sm" tone="muted">Complément inline</Text>`;

const truncationCode = `<Text noWrap>{longText}</Text>
<Text lines={2}>{longText}</Text>`;

const truncationSample = {
  fr: "La canopée filtre la lumière du jour en mille éclats mouvants, et chaque feuille, chaque branche, chaque souffle de vent redessine sans cesse le motif posé sur le sol de la forêt, bien au-delà de ce qu'une seule ligne peut contenir.",
  en: "The canopy filters daylight into a thousand moving flecks, and every leaf, every branch, every gust of wind keeps redrawing the pattern laid on the forest floor, far beyond what a single line can hold.",
};

const fr = {
  intro:
    "Composant de texte courant. Il expose l'échelle typographique applicative — corps, libellés, légendes, surtitres, métriques et code — que seuls les tokens rendaient accessible jusqu'ici. Chaque variante embarque sa taille, sa graisse, son interligne et son resserrement optique.",
  sections: {
    variants: {
      title: "Variantes",
      demoTitle: "Neuf rôles typographiques",
      demoDescription:
        "La variante choisit un rôle complet, pas seulement une taille : le resserrement se resserre à mesure que le texte grandit et s'ouvre sur les petites tailles.",
    },
    weights: {
      title: "Graisses",
      demoTitle: "De light à extrabold",
      demoDescription:
        "Chivo est une police variable : les six graisses proviennent du même fichier, sans requête supplémentaire.",
    },
    tones: {
      title: "Tonalités",
      demoTitle: "Trois niveaux de hiérarchie",
      demoDescription:
        "Les tonalités par défaut s'appuient sur les couleurs de texte du thème : noir sur fond clair, blanc sur fond sombre, sans rien à régler.",
      paletteDemoTitle: "Les sept familles de la palette",
      paletteDemoDescription:
        "La même prop tone accepte les sept familles de couleurs. Elles passent par les CSS variables du thème et changent donc de valeur avec le mode clair / sombre.",
      contrast:
        "Une couleur de palette sur du texte long réduit le contraste : réservez-la aux mots que vous voulez faire ressortir, et gardez le ton par défaut pour les paragraphes.",
    },
    numeric: {
      title: "Variantes numériques",
      demoTitle: "Chiffres tabulaires et zéro barré",
      demoDescription:
        "La variante metric passe les chiffres en tabulaire par défaut, pour qu'une valeur qui change ne fasse pas sauter la mise en page.",
    },
    as: {
      title: "Balise de rendu",
      demoTitle: "Sémantique choisie",
      demoDescription:
        "Chaque variante a sa balise par défaut (p, span, code). La prop as permet d'en choisir une autre sans toucher au style.",
    },
    truncation: {
      title: "Troncature",
      demoTitle: "noWrap et lines",
      demoDescription:
        "noWrap tient le texte sur une ligne et coupe le surplus d'une ellipse ; lines le coupe au-delà de n lignes. Le texte ne déborde jamais de son conteneur.",
    },
    api: "API",
  },
  props: {
    children: "Contenu textuel.",
    variant: "Rôle typographique : taille, graisse, interligne et resserrement.",
    weight: "Graisse, en remplacement de celle portée par la variante.",
    tone: "Couleur de texte : niveau de hiérarchie ou famille de la palette.",
    align: "Alignement horizontal.",
    as: "Balise de rendu, en remplacement de celle de la variante.",
    tabularNums: "Force la chasse fixe des chiffres. Actif par défaut sur metric et display.",
    slashedZero: "Barre le zéro pour le distinguer de la lettre O.",
    gutterBottom: "Ajoute une marge basse.",
    color: "Couleur explicite, prioritaire sur tone.",
    noWrap: "Tient le texte sur une ligne et coupe le surplus d'une ellipse.",
    lines: "Coupe le texte d'une ellipse au-delà de ce nombre de lignes ; prioritaire sur noWrap.",
  },
};

const en: typeof fr = {
  intro:
    "Body text component. It exposes the application typographic scale — body, labels, captions, overlines, metrics and code — which until now only the tokens made reachable. Each variant carries its own size, weight, line height and optical tracking.",
  sections: {
    variants: {
      title: "Variants",
      demoTitle: "Nine typographic roles",
      demoDescription:
        "The variant picks a complete role, not just a size: tracking tightens as the text grows and opens up at small sizes.",
    },
    weights: {
      title: "Weights",
      demoTitle: "From light to extrabold",
      demoDescription:
        "Chivo is a variable font: all six weights come from the same file, with no extra request.",
    },
    tones: {
      title: "Tones",
      demoTitle: "Three hierarchy levels",
      demoDescription:
        "The default tones rely on the theme text colors: black on a light background, white on a dark one, with nothing to configure.",
      paletteDemoTitle: "The seven palette families",
      paletteDemoDescription:
        "The same tone prop accepts the seven color families. They go through the theme CSS variables and therefore change value with the light / dark mode.",
      contrast:
        "A palette color on long text lowers the contrast: keep it for the words you want to stand out, and leave paragraphs on the default tone.",
    },
    numeric: {
      title: "Numeric variants",
      demoTitle: "Tabular figures and slashed zero",
      demoDescription:
        "The metric variant switches figures to tabular by default, so a changing value never shifts the layout.",
    },
    as: {
      title: "Rendered tag",
      demoTitle: "Chosen semantics",
      demoDescription:
        "Each variant has its default tag (p, span, code). The as prop picks another one without touching the style.",
    },
    truncation: {
      title: "Truncation",
      demoTitle: "noWrap and lines",
      demoDescription:
        "noWrap keeps the text on one line and cuts the excess with an ellipsis; lines cuts it beyond n lines. The text never overflows its container.",
    },
    api: "API",
  },
  props: {
    children: "Text content.",
    variant: "Typographic role: size, weight, line height and tracking.",
    weight: "Weight, replacing the one carried by the variant.",
    tone: "Text color: hierarchy level or palette family.",
    align: "Horizontal alignment.",
    as: "Rendered tag, replacing the variant default.",
    tabularNums: "Forces fixed-width figures. Enabled by default on metric and display.",
    slashedZero: "Slashes the zero to tell it apart from the letter O.",
    gutterBottom: "Adds a bottom margin.",
    color: "Explicit color, taking precedence over tone.",
    noWrap: "Keeps the text on one line and cuts the excess with an ellipsis.",
    lines:
      "Cuts the text with an ellipsis beyond this number of lines; takes precedence over noWrap.",
  },
};

const texts = { fr, en };

const variantSamples = [
  { variant: "lead", fr: "Accroche d'introduction", en: "Introduction lead" },
  { variant: "body-lg", fr: "Corps de texte large", en: "Large body text" },
  { variant: "body-md", fr: "Corps de texte courant", en: "Regular body text" },
  { variant: "body-sm", fr: "Corps de texte dense", en: "Dense body text" },
  { variant: "label", fr: "Libellé de champ", en: "Field label" },
  { variant: "caption", fr: "Légende d'illustration", en: "Illustration caption" },
  { variant: "overline", fr: "Catégorie", en: "Category" },
  { variant: "metric", fr: "1 204", en: "1 204" },
  { variant: "display", fr: "42", en: "42" },
  { variant: "code", fr: "npm i @canop/ui", en: "npm i @canop/ui" },
] as const;

const weightSamples = ["light", "regular", "medium", "semibold", "bold", "extrabold"] as const;

const paletteTones = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
] as const;

export default function TextDoc() {
  const locale = useDocLocale();
  const t = texts[locale];

  const propRows: PropRow[] = [
    { name: "children", type: "ReactNode", required: true, description: t.props.children },
    {
      name: "variant",
      type: '"lead" | "body-lg" | "body-md" | "body-sm" | "label" | "caption" | "overline" | "metric" | "display" | "code"',
      defaultValue: '"body-md"',
      description: t.props.variant,
    },
    {
      name: "weight",
      type: '"light" | "regular" | "medium" | "semibold" | "bold" | "extrabold"',
      defaultValue: "variant",
      description: t.props.weight,
    },
    {
      name: "tone",
      type: '"default" | "muted" | "subtle" | "inherit" | "primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success"',
      defaultValue: '"default"',
      description: t.props.tone,
    },
    {
      name: "align",
      type: '"left" | "center" | "right"',
      defaultValue: '"left"',
      description: t.props.align,
    },
    { name: "as", type: "ElementType", defaultValue: "variant", description: t.props.as },
    {
      name: "tabularNums",
      type: "boolean",
      defaultValue: 'variant === "metric" || variant === "display"',
      description: t.props.tabularNums,
    },
    {
      name: "slashedZero",
      type: "boolean",
      defaultValue: "false",
      description: t.props.slashedZero,
    },
    {
      name: "gutterBottom",
      type: "boolean",
      defaultValue: "false",
      description: t.props.gutterBottom,
    },
    { name: "color", type: "string", defaultValue: "tone", description: t.props.color },
    { name: "noWrap", type: "boolean", defaultValue: "false", description: t.props.noWrap },
    { name: "lines", type: "number", description: t.props.lines },
  ];

  return (
    <DocPage title="Text" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.variants.title}>
        <DemoCard
          title={t.sections.variants.demoTitle}
          description={t.sections.variants.demoDescription}
          code={variantsCode}
          align="stretch"
        >
          <Stack gap="sm">
            {variantSamples.map((sample) => (
              <Text key={sample.variant} variant={sample.variant}>
                {sample[locale]}
              </Text>
            ))}
          </Stack>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.weights.title}>
        <DemoCard
          title={t.sections.weights.demoTitle}
          description={t.sections.weights.demoDescription}
          code={weightsCode}
          align="stretch"
        >
          <Stack gap="xs">
            {weightSamples.map((weight) => (
              <Text key={weight} variant="body-lg" weight={weight}>
                {`Chivo ${weight}`}
              </Text>
            ))}
          </Stack>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.tones.title}>
        <DemoCard
          title={t.sections.tones.demoTitle}
          description={t.sections.tones.demoDescription}
          code={tonesCode}
          align="stretch"
        >
          <Stack gap="xs">
            <Text tone="default">{locale === "fr" ? "Ton par défaut" : "Default tone"}</Text>
            <Text tone="muted">{locale === "fr" ? "Ton secondaire" : "Muted tone"}</Text>
            <Text tone="subtle">{locale === "fr" ? "Ton discret" : "Subtle tone"}</Text>
          </Stack>
        </DemoCard>
        <DemoCard
          title={t.sections.tones.paletteDemoTitle}
          description={t.sections.tones.paletteDemoDescription}
          code={paletteTonesCode}
          align="stretch"
        >
          <Stack gap="xs">
            {paletteTones.map((tone) => (
              <Text key={tone} variant="body-lg" weight="semibold" tone={tone}>
                {`${tone} — ${locale === "fr" ? "Flotte de véhicules" : "Vehicle fleet"}`}
              </Text>
            ))}
          </Stack>
        </DemoCard>
        <Feedback severity="info">{t.sections.tones.contrast}</Feedback>
      </DocSection>

      <DocSection title={t.sections.numeric.title}>
        <DemoCard
          title={t.sections.numeric.demoTitle}
          description={t.sections.numeric.demoDescription}
          code={numericCode}
          align="stretch"
        >
          <Stack gap="sm">
            <Stack gap="xs">
              <Text variant="overline" tone="muted">
                tabular-nums
              </Text>
              <Text variant="metric">1 204,50</Text>
              <Text variant="metric">1 999,00</Text>
            </Stack>
            <Stack gap="xs">
              <Text variant="overline" tone="muted">
                {locale === "fr" ? "chiffres proportionnels" : "proportional figures"}
              </Text>
              <Text variant="metric" tabularNums={false}>
                1 204,50
              </Text>
              <Text variant="metric" tabularNums={false}>
                1 999,00
              </Text>
            </Stack>
            <Stack gap="xs">
              <Text variant="overline" tone="muted">
                slashed-zero
              </Text>
              <Text variant="metric" slashedZero>
                0 807 990
              </Text>
            </Stack>
          </Stack>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.as.title}>
        <DemoCard
          title={t.sections.as.demoTitle}
          description={t.sections.as.demoDescription}
          code={asCode}
          align="stretch"
        >
          <Stack gap="xs">
            <Text as="strong" weight="bold">
              {locale === "fr" ? "Mise en avant" : "Emphasis"}
            </Text>
            <Text as="span" variant="body-sm" tone="muted">
              {locale === "fr" ? "Complément inline" : "Inline complement"}
            </Text>
          </Stack>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.truncation.title}>
        <DemoCard
          title={t.sections.truncation.demoTitle}
          description={t.sections.truncation.demoDescription}
          code={truncationCode}
          align="stretch"
        >
          <Stack gap="sm">
            <Text noWrap>{truncationSample[locale]}</Text>
            <Text lines={2}>{truncationSample[locale]}</Text>
          </Stack>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
