import { Spinner, Stack } from "@canop/ui";
import Typography from "@mui/material/Typography";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Spinner } from "@canop/ui";`;

const sizesCode = `<Spinner size="small" />
<Spinner size="medium" />
<Spinner size="large" />`;

const colorsCode = `<Spinner size="large" color="primary" />
<Spinner size="large" color="accent" />
<Spinner size="large" color="success" />
<Spinner size="large" color="error" />`;

const inheritCode = `<Typography component="div" color="primary">
  <Stack direction="row" gap="xs" alignItems="center">
    <Spinner size="small" color="inherit" />
    <span>Synchronisation…</span>
  </Stack>
</Typography>`;

const labelCode = `<Spinner ariaLabel="Chargement de la page" />`;

const fr = {
  intro:
    "Indicateur de chargement circulaire pour signaler une opération en cours. Trois tailles, un mode plein écran et un libellé accessible intégré. Le trait porte un dégradé des trois teintes de sa couleur et des extrémités arrondies.",
  sections: {
    sizes: "Tailles",
    colors: "Couleurs",
    accessibility: "Accessibilité",
    api: "API",
  },
  demos: {
    sizesTitle: "small, medium, large",
    sizesDescription:
      "Adaptez le diamètre au contexte : discret dans un bouton, plus visible au centre d'un panneau.",
    colorsTitle: "color",
    colorsDescription:
      "Chaque famille de palette donne un dégradé de ses trois teintes — light, main et dark. Le dégradé tourne avec la roue, donc les teintes restent fixes par rapport à l'arc : c'est la position de l'arc qui change, pas la couleur sous lui.",
    inheritTitle: 'color="inherit"',
    inheritDescription:
      "Le trait, uni, prend la couleur du texte qui l'entoure (currentColor). À utiliser dans un bouton ou un libellé : le Spinner a alors le contraste de son contenant, quels que soient la variante et le thème.",
    labelTitle: "ariaLabel",
    labelDescription:
      "ariaLabel fournit une description annoncée par les technologies d'assistance, sans changer le rendu visuel.",
  },
  props: {
    size: "Diamètre de l'indicateur circulaire. L'épaisseur du trait varie à l'inverse, sans quoi elle paraîtrait grossière en petit et famélique en grand.",
    color:
      'Couleur du dégradé du trait : ses trois teintes sont light, main et dark de la famille choisie. "inherit" donne un trait uni de la couleur du texte parent (currentColor).',
    fullPage:
      "Centre l'indicateur sur toute la hauteur de la fenêtre, utile pendant le chargement initial d'une page.",
    ariaLabel: "Libellé accessible annoncé par les lecteurs d'écran.",
  },
};

const en: typeof fr = {
  intro:
    "Circular loading indicator to signal an operation in progress. Three sizes, a full-page mode and a built-in accessible label. The stroke carries a gradient of its color's three tints and rounded caps.",
  sections: {
    sizes: "Sizes",
    colors: "Colors",
    accessibility: "Accessibility",
    api: "API",
  },
  demos: {
    sizesTitle: "small, medium, large",
    sizesDescription:
      "Match the diameter to the context: subtle inside a button, more prominent at the center of a panel.",
    colorsTitle: "color",
    colorsDescription:
      "Each palette family yields a gradient of its three tints — light, main and dark. The gradient turns with the wheel, so the tints stay fixed relative to the arc: what moves is the arc's position, not the color under it.",
    inheritTitle: 'color="inherit"',
    inheritDescription:
      "The solid stroke takes the color of the surrounding text (currentColor). Use it inside a button or a label: the Spinner then gets the contrast of its container, whatever the variant and theme.",
    labelTitle: "ariaLabel",
    labelDescription:
      "ariaLabel provides a description announced by assistive technologies, without changing the visual rendering.",
  },
  props: {
    size: "Diameter of the circular indicator. Stroke weight varies inversely, otherwise it would look coarse when small and thin when large.",
    color:
      'Color of the stroke gradient: its three stops are light, main and dark of the chosen family. "inherit" gives a solid stroke in the parent text color (currentColor).',
    fullPage:
      "Centers the indicator across the full height of the viewport, useful during the initial load of a page.",
    ariaLabel: "Accessible label announced by screen readers.",
  },
};

const texts = { fr, en };

export default function SpinnerDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "color",
      type: 'CanopPaletteColorName | "inherit"',
      defaultValue: '"accent"',
      description: t.props.color,
    },
    {
      name: "fullPage",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fullPage,
    },
    {
      name: "ariaLabel",
      type: "string",
      defaultValue: '"Chargement"',
      description: t.props.ariaLabel,
    },
  ];

  return (
    <DocPage title="Spinner" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.sizes}>
        <DemoCard
          title={t.demos.sizesTitle}
          description={t.demos.sizesDescription}
          code={sizesCode}
        >
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors}>
        <DemoCard
          title={t.demos.colorsTitle}
          description={t.demos.colorsDescription}
          code={colorsCode}
        >
          <Spinner size="large" color="primary" />
          <Spinner size="large" color="accent" />
          <Spinner size="large" color="success" />
          <Spinner size="large" color="error" />
        </DemoCard>
        <DemoCard
          title={t.demos.inheritTitle}
          description={t.demos.inheritDescription}
          code={inheritCode}
        >
          <Typography component="div" color="primary">
            <Stack direction="row" gap="xs" alignItems="center">
              <Spinner size="small" color="inherit" />
              <span>Synchronisation…</span>
            </Stack>
          </Typography>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.accessibility}>
        <DemoCard
          title={t.demos.labelTitle}
          description={t.demos.labelDescription}
          code={labelCode}
        >
          <Spinner ariaLabel="Chargement de la page" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
