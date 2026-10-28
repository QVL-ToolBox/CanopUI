import { useRef } from "react";
import { Button, Heading, Stack } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Heading } from "@canop/ui";`;

const sizesCode = `<Heading size={1}>Titre taille 1</Heading>
<Heading size={2}>Titre taille 2</Heading>
<Heading size={3}>Titre taille 3</Heading>
<Heading size={4}>Titre taille 4</Heading>
<Heading size={5}>Titre taille 5</Heading>
<Heading size={6}>Titre taille 6</Heading>`;

const levelSizeCode = `<Heading level={2} size={4}>
  Titre h2 avec la taille visuelle 4
</Heading>`;

const responsiveCode = `<Heading level={2} size={{ xs: 5, md: 3 }}>
  Entraînement
</Heading>`;

const alignCode = `<Heading align="left">Aligné à gauche</Heading>
<Heading align="center">Centré</Heading>`;

const tonesCode = `<Heading size={4} tone="primary">Titre primary</Heading>
<Heading size={4} tone="accent">Titre accent</Heading>
<Heading size={4} tone="error">Titre error</Heading>
<Heading size={4} tone="muted">Titre secondaire</Heading>`;

const focusCode = `function Results() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <>
      <Heading ref={headingRef} tabIndex={-1} level={3} size={5}>
        Résultats de la recherche
      </Heading>
      <Button onClick={() => headingRef.current?.focus()}>Aller aux résultats</Button>
    </>
  );
}`;

interface FocusableHeadingDemoProps {
  title: string;
  action: string;
}

function FocusableHeadingDemo({ title, action }: FocusableHeadingDemoProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <Stack gap="sm" alignItems="start">
      <Heading ref={headingRef} tabIndex={-1} level={3} size={5} gutterBottom={false}>
        {title}
      </Heading>
      <Button variant="secondary" size="small" onClick={() => headingRef.current?.focus()}>
        {action}
      </Button>
    </Stack>
  );
}

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
    "Titre de section basé sur Typography. Le niveau sémantique (balise h1 à h4) et la taille visuelle sont dissociés, ce qui préserve la hiérarchie du document sans figer l'apparence.",
  sections: {
    sizes: {
      title: "Tailles",
      demoTitle: "Six échelles visuelles",
      demoDescription:
        "La propriété size choisit l'échelle typographique, de la plus grande (1) à la plus discrète (6). Le palier 6 tombe à la taille du corps de texte : c'est le seul qui laisse un titre tenir à côté d'un logo sur un écran de 320 px.",
    },
    levelSize: {
      title: "Niveau et taille dissociés",
      demoTitle: "Sémantique indépendante de l'apparence",
      demoDescription:
        "Conservez une balise h2 pour le référencement tout en appliquant une taille visuelle plus modeste.",
    },
    responsive: {
      title: "Taille par point de rupture",
      demoTitle: "size={{ xs: 5, md: 3 }}",
      demoDescription:
        "Les six échelles sont des rem fixes : un level={2} sans size vaut 3,158 rem, et en Titan One le seul mot « Entraînement » y fait une vingtaine de rem — il déborde de n'importe quelle carte sur mobile. size accepte donc une taille par point de rupture, dans la forme que MUI emploie déjà partout ailleurs. Les paliers non renseignés retombent sur level, jamais sur la taille du corps de texte. Réduisez la fenêtre pour voir le titre changer d'échelle.",
    },
    align: {
      title: "Alignement",
      demoTitle: "left et center",
    },
    tones: {
      title: "Tonalités",
      demoTitle: "Hiérarchie et familles de la palette",
      demoDescription:
        "Sans tonalité, le titre reste sur la couleur de texte du thème — noir sur fond clair, blanc sur fond sombre. Les sept familles de la palette sont disponibles pour les titres qui portent un statut.",
    },
    focus: {
      title: "Focus programmatique",
      demoTitle: "tabIndex={-1} et ref",
      demoDescription:
        "Après une navigation ou une recherche, déplacez le focus sur le titre pour que les lecteurs d'écran annoncent le nouveau contenu. tabIndex={-1} le rend focalisable sans l'ajouter à l'ordre de tabulation, ref donne accès à l'élément h.",
      headingSample: "Résultats de la recherche",
      action: "Aller aux résultats",
    },
    api: "API",
  },
  props: {
    children: "Contenu textuel du titre.",
    level: "Niveau sémantique du titre, rendu en balise h1 à h4.",
    size: "Taille visuelle du titre, indépendante du niveau. Une échelle unique, ou une échelle par point de rupture ({ xs, sm, md, lg }). Reprend level par défaut, y compris pour les paliers non renseignés.",
    align: "Alignement horizontal du titre.",
    gutterBottom: "Ajoute une marge basse sous le titre.",
    tone: "Couleur du titre : niveau de hiérarchie ou famille de la palette.",
    color: "Couleur explicite, prioritaire sur tone.",
    component:
      "Balise non titre (p, span, div) qui remplace h{level} : l'apparence d'un titre sans sa sémantique.",
    tabIndex:
      "Ordre de tabulation ; -1 rend le titre focalisable par programme sans l'ajouter à la tabulation.",
    ref: "Référence vers l'élément rendu, pour lui donner le focus.",
  },
};

const en: typeof fr = {
  intro:
    "Section heading based on Typography. The semantic level (h1 to h4 tag) and the visual size are decoupled, which preserves the document hierarchy without locking the appearance.",
  sections: {
    sizes: {
      title: "Sizes",
      demoTitle: "Six visual scales",
      demoDescription:
        "The size prop selects the typographic scale, from the largest (1) to the most subtle (6). Step 6 lands on the body text size: it is the only one that keeps a heading next to a logo on a 320px screen.",
    },
    levelSize: {
      title: "Decoupled level and size",
      demoTitle: "Semantics independent from appearance",
      demoDescription: "Keep an h2 tag for SEO while applying a more modest visual size.",
    },
    responsive: {
      title: "Size per breakpoint",
      demoTitle: "size={{ xs: 5, md: 3 }}",
      demoDescription:
        "The six scales are fixed rem values: a level={2} with no size is 3.158rem, and in Titan One the single word « Entraînement » runs about twenty rem wide — it overflows any card on a phone. So size also accepts a value per breakpoint, in the shape MUI already uses everywhere else. Unlisted steps fall back to level, never to the body text size. Narrow the window to watch the heading change scale.",
    },
    align: {
      title: "Alignment",
      demoTitle: "left and center",
    },
    tones: {
      title: "Tones",
      demoTitle: "Hierarchy and palette families",
      demoDescription:
        "With no tone, the heading stays on the theme text color — black on a light background, white on a dark one. The seven palette families are available for headings that carry a status.",
    },
    focus: {
      title: "Programmatic focus",
      demoTitle: "tabIndex={-1} and ref",
      demoDescription:
        "After a navigation or a search, move focus to the heading so screen readers announce the new content. tabIndex={-1} makes it focusable without adding it to the tab order, ref gives access to the h element.",
      headingSample: "Search results",
      action: "Go to results",
    },
    api: "API",
  },
  props: {
    children: "Text content of the heading.",
    level: "Semantic level of the heading, rendered as an h1 to h4 tag.",
    size: "Visual size of the heading, independent from the level. A single scale, or one scale per breakpoint ({ xs, sm, md, lg }). Defaults to level, including for unlisted steps.",
    align: "Horizontal alignment of the heading.",
    gutterBottom: "Adds a bottom margin below the heading.",
    tone: "Color of the heading: hierarchy level or palette family.",
    color: "Explicit color, taking precedence over tone.",
    component:
      "Non-heading tag (p, span, div) replacing h{level}: the look of a heading without its semantics.",
    tabIndex: "Tab order; -1 makes the heading focusable by script, outside the tab sequence.",
    ref: "Reference to the rendered element, to move focus to it.",
  },
};

const texts = { fr, en };

export default function HeadingDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "level",
      type: "1 | 2 | 3 | 4",
      defaultValue: "2",
      description: t.props.level,
    },
    {
      name: "size",
      type: '1 | 2 | 3 | 4 | 5 | 6 | Partial<Record<"xs" | "sm" | "md" | "lg", 1 | 2 | 3 | 4 | 5 | 6>>',
      defaultValue: "level",
      description: t.props.size,
    },
    {
      name: "align",
      type: '"left" | "center"',
      defaultValue: '"left"',
      description: t.props.align,
    },
    {
      name: "tone",
      type: '"default" | "muted" | "subtle" | "inherit" | "primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success"',
      defaultValue: '"default"',
      description: t.props.tone,
    },
    {
      name: "gutterBottom",
      type: "boolean",
      defaultValue: "true",
      description: t.props.gutterBottom,
    },
    {
      name: "color",
      type: "string",
      defaultValue: "tone",
      description: t.props.color,
    },
    {
      name: "component",
      type: '"p" | "span" | "div"',
      description: t.props.component,
    },
    { name: "tabIndex", type: "number", description: t.props.tabIndex },
    { name: "ref", type: "Ref<HTMLHeadingElement>", description: t.props.ref },
  ];

  return (
    <DocPage title="Heading" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.sizes.title}>
        <DemoCard
          title={t.sections.sizes.demoTitle}
          description={t.sections.sizes.demoDescription}
          code={sizesCode}
          align="stretch"
        >
          <Stack gap="sm">
            <Heading size={1} gutterBottom={false}>
              Titre taille 1
            </Heading>
            <Heading size={2} gutterBottom={false}>
              Titre taille 2
            </Heading>
            <Heading size={3} gutterBottom={false}>
              Titre taille 3
            </Heading>
            <Heading size={4} gutterBottom={false}>
              Titre taille 4
            </Heading>
            <Heading size={5} gutterBottom={false}>
              Titre taille 5
            </Heading>
            <Heading size={6} gutterBottom={false}>
              Titre taille 6
            </Heading>
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.levelSize.title}>
        <DemoCard
          title={t.sections.levelSize.demoTitle}
          description={t.sections.levelSize.demoDescription}
          code={levelSizeCode}
          align="stretch"
        >
          <Heading level={2} size={4} gutterBottom={false}>
            Titre h2 avec la taille visuelle 4
          </Heading>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.responsive.title}>
        <DemoCard
          title={t.sections.responsive.demoTitle}
          description={t.sections.responsive.demoDescription}
          code={responsiveCode}
          align="stretch"
        >
          <Heading level={2} size={{ xs: 5, md: 3 }} gutterBottom={false}>
            Entraînement
          </Heading>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.align.title}>
        <DemoCard title={t.sections.align.demoTitle} code={alignCode} align="stretch">
          <Heading align="left" gutterBottom={false}>
            Aligné à gauche
          </Heading>
          <Heading align="center" gutterBottom={false}>
            Centré
          </Heading>
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
            <Heading size={4} gutterBottom={false}>
              tone=&quot;default&quot;
            </Heading>
            <Heading size={4} tone="muted" gutterBottom={false}>
              tone=&quot;muted&quot;
            </Heading>
            {paletteTones.map((tone) => (
              <Heading key={tone} size={4} tone={tone} gutterBottom={false}>
                {`tone="${tone}"`}
              </Heading>
            ))}
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.focus.title}>
        <DemoCard
          title={t.sections.focus.demoTitle}
          description={t.sections.focus.demoDescription}
          code={focusCode}
          align="stretch"
        >
          <FocusableHeadingDemo
            title={t.sections.focus.headingSample}
            action={t.sections.focus.action}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
