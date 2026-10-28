import Box from "@mui/material/Box";
import { useState } from "react";
import { Avatar, Button, Skeleton, Stack, Text } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Skeleton } from "@canop/ui";`;

const blockCode = `<Skeleton />
<Skeleton width="12rem" height="8rem" />`;

const linesCode = `<Skeleton variant="lines" />
<Skeleton variant="lines" lines={5} width="20rem" />`;

const busyCode = `<section aria-busy={loading}>
  {loading ? <Skeleton variant="lines" /> : <Profile />}
</section>`;

const staticCode = `<Skeleton variant="lines" animated={false} />`;
const fr = {
  intro:
    "Gabarit de contenu à venir, en bloc ou en lignes. Il pulse doucement le temps du chargement, se fige quand l'utilisateur demande un mouvement réduit, et reste invisible aux technologies d'assistance : il est aria-hidden.",
  sections: {
    block: "Bloc",
    lines: "Lignes",
    accessibility: "Accessibilité",
    motion: "Mouvement",
    api: "API",
  },
  demos: {
    blockTitle: 'variant="block"',
    blockDescription:
      "Un rectangle aux coins squircle, pour une image, une carte ou un graphique. width et height acceptent toute longueur CSS en unités relatives.",
    linesTitle: 'variant="lines"',
    linesDescription:
      "Des lignes de texte, la dernière plus courte pour suggérer la fin d'un paragraphe. La pulsation se propage d'une ligne à l'autre en cascade.",
    busyTitle: "aria-busy sur le conteneur",
    busyDescription:
      "Le Skeleton n'annonce rien : c'est son conteneur qui porte aria-busy tant que le contenu charge, puis le retire quand le vrai contenu prend sa place. Le consommateur pose donc aria-busy sur l'élément qui accueillera le contenu, jamais sur le Skeleton. Pour dire la fin d'un chargement long, ajouter un LiveRegion.",
    staticTitle: "animated={false}",
    staticDescription:
      "La pulsation est coupée d'office en mouvement réduit. animated={false} la coupe pour tout le monde, par exemple quand plusieurs dizaines de gabarits s'affichent à la fois.",
    toggleLoaded: "Afficher le contenu",
    toggleLoading: "Recharger",
    loadedName: "Camille Roux",
    loadedText: "Responsable produit, équipe Canopée.",
  },
  props: {
    variant: "Forme du gabarit : un bloc ou des lignes de texte.",
    width: "Largeur du gabarit, plafonnée à celle de son conteneur.",
    height: "Hauteur du bloc. Refusée par le typage en variante lines.",
    lines: "Nombre de lignes, au moins une. Refusé par le typage en variante block.",
    animated: "Active la pulsation. Elle reste coupée en mouvement réduit.",
  },
};

const en: typeof fr = {
  intro:
    "A placeholder for upcoming content, as a block or as lines. It pulses gently while loading, freezes when the user asks for reduced motion, and stays invisible to assistive technologies: it is aria-hidden.",
  sections: {
    block: "Block",
    lines: "Lines",
    accessibility: "Accessibility",
    motion: "Motion",
    api: "API",
  },
  demos: {
    blockTitle: 'variant="block"',
    blockDescription:
      "A rectangle with squircle corners, for an image, a card or a chart. width and height accept any CSS length in relative units.",
    linesTitle: 'variant="lines"',
    linesDescription:
      "Lines of text, the last one shorter to suggest the end of a paragraph. The pulse ripples from one line to the next.",
    busyTitle: "aria-busy on the container",
    busyDescription:
      "The Skeleton announces nothing: its container carries aria-busy while the content loads, then drops it when the real content takes its place. The consumer therefore sets aria-busy on the element that will host the content, never on the Skeleton. To announce the end of a long load, add a LiveRegion.",
    staticTitle: "animated={false}",
    staticDescription:
      "The pulse is switched off automatically under reduced motion. animated={false} switches it off for everyone, for instance when dozens of placeholders are shown at once.",
    toggleLoaded: "Show content",
    toggleLoading: "Reload",
    loadedName: "Camille Roux",
    loadedText: "Product lead, Canopy team.",
  },
  props: {
    variant: "Shape of the placeholder: a block or lines of text.",
    width: "Width of the placeholder, capped at its container's width.",
    height: "Height of the block. Rejected by the types in the lines variant.",
    lines: "Number of lines, at least one. Rejected by the types in the block variant.",
    animated: "Enables the pulse. It stays off under reduced motion.",
  },
};

const texts = { fr, en };

type SkeletonDocTexts = typeof fr;

function BusyDemo({ t }: { t: SkeletonDocTexts }) {
  const [loading, setLoading] = useState(true);

  return (
    <Stack gap="md" alignItems="start">
      <Box component="section" aria-busy={loading} sx={{ width: "min(20rem, 100%)" }}>
        {loading ? (
          <Skeleton variant="lines" lines={2} />
        ) : (
          <Stack direction="row" gap="sm" alignItems="center">
            <Avatar name={t.demos.loadedName} />
            <Stack gap="xs">
              <Text variant="label">{t.demos.loadedName}</Text>
              <Text variant="body-sm" tone="muted">
                {t.demos.loadedText}
              </Text>
            </Stack>
          </Stack>
        )}
      </Box>
      <Button variant="tonal" size="small" onClick={() => setLoading((value) => !value)}>
        {loading ? t.demos.toggleLoaded : t.demos.toggleLoading}
      </Button>
    </Stack>
  );
}

export default function SkeletonDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "variant",
      type: '"block" | "lines"',
      defaultValue: '"block"',
      description: t.props.variant,
    },
    { name: "width", type: "string", defaultValue: '"100%"', description: t.props.width },
    { name: "height", type: "string", defaultValue: '"4rem"', description: t.props.height },
    { name: "lines", type: "number", defaultValue: "3", description: t.props.lines },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
  ];

  return (
    <DocPage title="Skeleton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.block}>
        <DemoCard
          title={t.demos.blockTitle}
          description={t.demos.blockDescription}
          code={blockCode}
          align="stretch"
        >
          <Skeleton />
          <Skeleton width="12rem" height="8rem" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.lines}>
        <DemoCard
          title={t.demos.linesTitle}
          description={t.demos.linesDescription}
          code={linesCode}
          align="stretch"
        >
          <Skeleton variant="lines" />
          <Skeleton variant="lines" lines={5} width="20rem" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.accessibility}>
        <DemoCard
          title={t.demos.busyTitle}
          description={t.demos.busyDescription}
          code={busyCode}
          align="start"
        >
          <BusyDemo t={t} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.motion}>
        <DemoCard
          title={t.demos.staticTitle}
          description={t.demos.staticDescription}
          code={staticCode}
          align="stretch"
        >
          <Skeleton variant="lines" animated={false} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
