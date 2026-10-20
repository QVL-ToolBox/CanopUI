import Box from "@mui/material/Box";
import { Stack } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Stack } from "@canop/ui";`;

const directionCode = `<Stack direction="row" gap="sm">
  <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  <Box bgcolor="secondary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="3rem" />
</Stack>`;

const gapCode = `<Stack gap="xl">
  <Stack direction="row" gap="xs">
    <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  </Stack>
  <Stack direction="row" gap="md">
    <Box bgcolor="secondary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="secondary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="secondary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  </Stack>
  <Stack direction="row" gap="xl">
    <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  </Stack>
</Stack>`;

const alignCode = `<Stack direction="row" gap="sm" alignItems="end">
  <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="2rem" />
  <Box bgcolor="secondary.main" borderRadius="0.5rem" width="3rem" height="4rem" />
  <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="5.5rem" />
</Stack>`;

const justifyCode = `<Stack direction="row" gap="sm" justifyContent="space-between">
  <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  <Box bgcolor="secondary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="3rem" />
</Stack>`;

const wrapCode = `<Stack direction="row" gap="sm" wrap>
  <Box bgcolor="primary.main" borderRadius="0.5rem" width="6rem" height="3rem" />
  <Box bgcolor="secondary.main" borderRadius="0.5rem" width="6rem" height="3rem" />
  <Box bgcolor="accent.main" borderRadius="0.5rem" width="6rem" height="3rem" />
  <Box bgcolor="primary.main" borderRadius="0.5rem" width="6rem" height="3rem" />
  <Box bgcolor="secondary.main" borderRadius="0.5rem" width="6rem" height="3rem" />
</Stack>`;

const paddingCode = `<Box bgcolor="secondary.light" borderRadius="0.75rem" display="inline-block">
  <Stack direction="row" padding="lg" gap="sm">
    <Box bgcolor="primary.main" borderRadius="0.5rem" width="3rem" height="3rem" />
    <Box bgcolor="accent.main" borderRadius="0.5rem" width="3rem" height="3rem" />
  </Stack>
</Box>`;

const fillCode = `<Box height="14rem" width="100%">
  <Stack fill gap="sm" justifyContent="space-between">
    <Box bgcolor="primary.main" borderRadius="0.5rem" height="3rem" />
    <Box bgcolor="accent.main" borderRadius="0.5rem" height="3rem" />
  </Stack>
</Box>`;

const fr = {
  intro:
    "Le composant de layout central de CanopUI. Il dispose ses enfants en ligne ou en colonne avec un espacement issu du thème, et pilote l'alignement, la justification, le retour à la ligne et le remplissage via des props dédiées.",
  sections: {
    direction: "Direction",
    gap: "Espacement",
    align: "Alignement",
    justify: "Justification",
    wrap: "Retour à la ligne",
    padding: "Padding",
    fill: "Remplir l'espace",
    api: "API",
  },
  demos: {
    direction: {
      title: "Ligne ou colonne",
      description: "direction contrôle l'axe principal. La valeur par défaut est column.",
    },
    gap: {
      title: "Échelle de gap",
      description:
        "gap accepte cinq paliers cohérents avec l'échelle d'espacement du thème, de xs à xl.",
    },
    align: {
      title: "alignItems",
      description:
        "Aligne les enfants sur l'axe transversal. Ici les blocs de hauteurs différentes sont alignés sur leur base.",
    },
    justify: {
      title: "justifyContent",
      description:
        "Répartit les enfants sur l'axe principal lorsque l'espace disponible est plus large que leur contenu.",
    },
    wrap: {
      title: "wrap",
      description:
        "Autorise les enfants à passer à la ligne quand la largeur devient insuffisante.",
    },
    padding: {
      title: "Marge intérieure",
      description: "padding applique une marge interne issue de la même échelle que gap.",
    },
    fill: {
      title: "fill",
      description:
        "fill étire le Stack pour occuper toute la hauteur de son parent flex, idéal pour répartir un contenu vertical.",
    },
  },
  props: {
    direction: "Axe principal de disposition des enfants.",
    gap: "Espacement entre les enfants, dérivé de l'échelle d'espacement du thème.",
    alignItems: "Alignement des enfants sur l'axe transversal.",
    justifyContent: "Répartition des enfants sur l'axe principal.",
    wrap: "Autorise le passage des enfants à la ligne lorsqu'ils dépassent la largeur.",
    padding: "Marge intérieure appliquée sur les quatre côtés.",
    fill: "Étire le Stack pour occuper l'espace disponible de son parent flex.",
    weight:
      "Part de l'espace prise parmi ses frères, relative à la leur : deux colonnes en 2 et 1 occupent deux tiers et un tiers. fill seul ne sait faire que des parts égales, puisqu'il vaut la même chose pour tout le monde. La base reste à zéro, comme pour fill : les largeurs sont un pur rapport, insensible au contenu — une colonne laissée à sa largeur naturelle se redimensionnerait à chaque changement de son texte, et déplacerait ce qui l'entoure. Poser weight suffit, inutile d'ajouter fill.",
    sticky:
      "Colle le bloc au haut ou au bas de la zone défilante qui le contient, dès que le défilement l'y amène. Cette zone est PageContent, qui porte l'overflowY : dans un PageContent en fillHeight, en overflow: hidden, rien ne défile et rien ne colle. Le bloc collé passe au-dessus de ce qui glisse sous lui, sans quoi toute Card — qui ouvre son propre contexte d'empilement avec son backdrop-filter — lui passerait par-dessus. sticky ne se combine ni avec fill ni avec weight, qui font occuper toute la hauteur du parent : il ne reste alors aucune course à parcourir.",
    stickyOffset:
      "Distance entre le bloc collé et le bord, sur l'échelle d'espacement. Sans effet hors sticky.",
    as: "Élément HTML rendu, utile pour la sémantique (formulaire, navigation, section).",
    ariaLabel: "Libellé accessible (aria-label) appliqué à l'élément.",
    ariaBusy:
      "Pose aria-busy sur l'élément : le conteneur d'un chargement (Skeleton) s'annonce occupé tant que son contenu n'est pas prêt.",
    ref: "Référence vers l'élément rendu.",
    dataAttributes: "Attributs data-* transmis à l'élément rendu.",
    onSubmit: 'Handler de soumission, pertinent lorsque as vaut "form".',
    children: "Éléments disposés dans le Stack.",
  },
};

const en: typeof fr = {
  intro:
    "CanopUI's core layout primitive. It lays out its children in a row or column with theme-derived spacing, and controls alignment, justification, wrapping and filling through dedicated props.",
  sections: {
    direction: "Direction",
    gap: "Spacing",
    align: "Alignment",
    justify: "Justification",
    wrap: "Wrapping",
    padding: "Padding",
    fill: "Filling space",
    api: "API",
  },
  demos: {
    direction: {
      title: "Row or column",
      description: "direction sets the main axis. The default value is column.",
    },
    gap: {
      title: "Gap scale",
      description: "gap accepts five steps aligned with the theme spacing scale, from xs to xl.",
    },
    align: {
      title: "alignItems",
      description:
        "Aligns children along the cross axis. Here blocks of different heights are aligned to their base.",
    },
    justify: {
      title: "justifyContent",
      description:
        "Distributes children along the main axis when the available space is wider than their content.",
    },
    wrap: {
      title: "wrap",
      description: "Lets children wrap to the next line when the width becomes too small.",
    },
    padding: {
      title: "Inner padding",
      description: "padding applies inner spacing drawn from the same scale as gap.",
    },
    fill: {
      title: "fill",
      description:
        "fill stretches the Stack to fill the full height of its flex parent, ideal for spreading vertical content.",
    },
  },
  props: {
    direction: "Main axis along which children are laid out.",
    gap: "Spacing between children, derived from the theme spacing scale.",
    alignItems: "Alignment of children along the cross axis.",
    justifyContent: "Distribution of children along the main axis.",
    wrap: "Allows children to wrap to the next line when they exceed the width.",
    padding: "Inner spacing applied on all four sides.",
    fill: "Stretches the Stack to fill the available space of its flex parent.",
    weight:
      "Share of the space taken among its siblings, relative to theirs: two columns at 2 and 1 take two thirds and one third. fill alone can only produce equal shares, since it means the same thing for everyone. The basis stays at zero, as with fill: widths are a pure ratio, immune to the content — a column left at its natural width would resize on every text change and shift everything around it. Setting weight is enough, no need to add fill.",
    sticky:
      "Pins the block to the top or the bottom of the scrolling area that contains it, as soon as scrolling brings it there. That area is PageContent, which carries the overflowY: inside a fillHeight PageContent, in overflow: hidden, nothing scrolls and nothing pins. The pinned block sits above whatever slides under it, otherwise any Card — which opens its own stacking context through its backdrop-filter — would pass over it. sticky combines with neither fill nor weight, which make the block fill its parent's height: no travel is left to cover.",
    stickyOffset:
      "Distance between the pinned block and the edge, on the spacing scale. Ignored without sticky.",
    as: "Rendered HTML element, useful for semantics (form, navigation, section).",
    ariaLabel: "Accessible label (aria-label) applied to the element.",
    ariaBusy:
      "Sets aria-busy on the element: the container of a loading state (Skeleton) announces itself busy until its content is ready.",
    ref: "Reference to the rendered element.",
    dataAttributes: "data-* attributes forwarded to the rendered element.",
    onSubmit: 'Submit handler, relevant when as is "form".',
    children: "Elements laid out within the Stack.",
  },
};

const texts = { fr, en };

export default function StackDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "direction",
      type: '"row" | "column"',
      defaultValue: '"column"',
      description: t.props.direction,
    },
    {
      name: "gap",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.gap,
    },
    {
      name: "alignItems",
      type: '"start" | "center" | "end" | "stretch" | "baseline"',
      description: t.props.alignItems,
    },
    {
      name: "justifyContent",
      type: '"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"',
      description: t.props.justifyContent,
    },
    {
      name: "wrap",
      type: "boolean",
      defaultValue: "false",
      description: t.props.wrap,
    },
    {
      name: "padding",
      type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"none"',
      description: t.props.padding,
    },
    {
      name: "fill",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fill,
    },
    {
      name: "weight",
      type: "number",
      defaultValue: "—",
      description: t.props.weight,
    },
    {
      name: "sticky",
      type: '"top" | "bottom"',
      defaultValue: "—",
      description: t.props.sticky,
    },
    {
      name: "stickyOffset",
      type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"none"',
      description: t.props.stickyOffset,
    },
    {
      name: "as",
      type: '"div" | "form" | "nav" | "section"',
      defaultValue: '"div"',
      description: t.props.as,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.props.ariaLabel,
    },
    {
      name: "ariaBusy",
      type: "boolean",
      description: t.props.ariaBusy,
    },
    {
      name: "ref",
      type: "Ref<HTMLElement>",
      description: t.props.ref,
    },
    {
      name: "data-*",
      type: "string | number | boolean",
      description: t.props.dataAttributes,
    },
    {
      name: "onSubmit",
      type: "FormEventHandler<HTMLFormElement>",
      description: t.props.onSubmit,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
  ];

  return (
    <DocPage title="Stack" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.direction}>
        <DemoCard
          title={t.demos.direction.title}
          description={t.demos.direction.description}
          code={directionCode}
        >
          <Stack direction="row" gap="sm">
            <Box
              sx={[
                {
                  bgcolor: "primary.main",
                  width: "3rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "secondary.main",
                  width: "3rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "accent.main",
                  width: "3rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.gap}>
        <DemoCard title={t.demos.gap.title} description={t.demos.gap.description} code={gapCode}>
          <Stack gap="xl">
            <Stack direction="row" gap="xs">
              <Box
                sx={[
                  {
                    bgcolor: "primary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "primary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "primary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
            </Stack>
            <Stack direction="row" gap="md">
              <Box
                sx={[
                  {
                    bgcolor: "secondary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "secondary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "secondary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
            </Stack>
            <Stack direction="row" gap="xl">
              <Box
                sx={[
                  {
                    bgcolor: "accent.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "accent.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "accent.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
            </Stack>
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.align}>
        <DemoCard
          title={t.demos.align.title}
          description={t.demos.align.description}
          code={alignCode}
        >
          <Stack direction="row" gap="sm" alignItems="end">
            <Box
              sx={[
                {
                  bgcolor: "primary.main",
                  width: "3rem",
                  height: "2rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "secondary.main",
                  width: "3rem",
                  height: "4rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "accent.main",
                  width: "3rem",
                  height: "5.5rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.justify}>
        <DemoCard
          title={t.demos.justify.title}
          description={t.demos.justify.description}
          code={justifyCode}
          align="stretch"
        >
          <Stack direction="row" gap="sm" justifyContent="space-between">
            <Box
              sx={[
                {
                  bgcolor: "primary.main",
                  width: "3rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "secondary.main",
                  width: "3rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "accent.main",
                  width: "3rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.wrap}>
        <DemoCard
          title={t.demos.wrap.title}
          description={t.demos.wrap.description}
          code={wrapCode}
          align="stretch"
        >
          <Stack direction="row" gap="sm" wrap>
            <Box
              sx={[
                {
                  bgcolor: "primary.main",
                  width: "6rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "secondary.main",
                  width: "6rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "accent.main",
                  width: "6rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "primary.main",
                  width: "6rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
            <Box
              sx={[
                {
                  bgcolor: "secondary.main",
                  width: "6rem",
                  height: "3rem",
                },
                squircleClip(tokens.radius.xs),
              ]}
            />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.padding}>
        <DemoCard
          title={t.demos.padding.title}
          description={t.demos.padding.description}
          code={paddingCode}
        >
          <Box
            sx={[
              {
                bgcolor: "secondary.light",
                display: "inline-block",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <Stack direction="row" padding="lg" gap="sm">
              <Box
                sx={[
                  {
                    bgcolor: "primary.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "accent.main",
                    width: "3rem",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
            </Stack>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fill}>
        <DemoCard
          title={t.demos.fill.title}
          description={t.demos.fill.description}
          code={fillCode}
          align="stretch"
        >
          <Box
            sx={{
              height: "14rem",
              width: "100%",
            }}
          >
            <Stack fill gap="sm" justifyContent="space-between">
              <Box
                sx={[
                  {
                    bgcolor: "primary.main",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
              <Box
                sx={[
                  {
                    bgcolor: "accent.main",
                    height: "3rem",
                  },
                  squircleClip(tokens.radius.xs),
                ]}
              />
            </Stack>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
