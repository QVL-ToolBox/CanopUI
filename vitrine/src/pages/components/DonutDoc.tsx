import { Donut, Heading, type CanopDonutSegment } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Donut } from "@canop/ui";`;

const basicCode = `const segments = [
  { label: "Logement", value: 820, color: "primary" },
  { label: "Alimentation", value: 410, color: "accent" },
  { label: "Transport", value: 180, color: "info" },
  { label: "Loisirs", value: 140, color: "success" },
];

<Donut segments={segments} showLegend ariaLabel="Répartition des dépenses" />`;

const thicknessCode = `<Donut segments={segments} thickness="thin" size="9rem" />
<Donut segments={segments} thickness="medium" size="9rem" />
<Donut segments={segments} thickness="thick" size="9rem" />`;

const centerCode = `<Donut
  segments={segments}
  centerContent={<Heading level={2} size={3} gutterBottom={false}>1 550 €</Heading>}
  formatValue={(segment, percentage) => \`\${Math.round(percentage)} %\`}
/>`;

const hookCode = `import { useDonut } from "@canop/ui";

function CustomDonut({ segments }: { segments: CanopDonutSegment[] }) {
  const { viewBox, center, radius, strokeWidth, geometries } = useDonut({
    segments,
    thickness: "medium",
    animated: true,
  });

  return (
    <svg viewBox={viewBox}>
      {geometries.map((geometry) => (
        <circle key={geometry.key} cx={center} cy={center} r={radius} stroke={geometry.color} strokeWidth={strokeWidth} />
      ))}
    </svg>
  );
}`;

const segments: CanopDonutSegment[] = [
  { label: "Logement", value: 820, color: "primary" },
  { label: "Alimentation", value: 410, color: "accent" },
  { label: "Transport", value: 180, color: "info" },
  { label: "Loisirs", value: 140, color: "success" },
];

const fr = {
  intro:
    "Graphique en anneau pour visualiser une répartition. Les segments se tracent proportionnellement à leur valeur, avec une couleur du thème, une légende optionnelle et un contenu libre au centre. L'anneau s'anime au tracé, sauf préférence de mouvement réduit.",
  sections: {
    basic: "Utilisation",
    thickness: "Épaisseur",
    center: "Contenu central et format",
    hook: "Hook useDonut",
    api: "API",
  },
  demos: {
    basicTitle: "segments et légende",
    basicDescription:
      "Chaque segment porte un label et une value ; color est optionnelle et retombe sur une palette par défaut. showLegend affiche la légende sous l'anneau.",
    thicknessTitle: "thin, medium, thick",
    thicknessDescription: "thickness règle la largeur du trait de l'anneau.",
    centerTitle: "centerContent et formatValue",
    centerDescription:
      "centerContent place un contenu libre au cœur de l'anneau (souvent un total). formatValue personnalise le texte de chaque valeur affichée.",
  },
  hookDescription:
    "Le composant s'appuie sur useDonut, qui calcule la géométrie des arcs (rotation, longueur, couleur, pourcentage) et le libellé accessible. Utilisez-le pour bâtir un anneau sur mesure.",
  props: {
    segments: "Segments à tracer, chacun avec un label, une value et une couleur optionnelle.",
    size: "Diamètre de l'anneau (valeur CSS).",
    thickness: "Épaisseur du trait de l'anneau.",
    showLegend: "Affiche une légende détaillant chaque segment sous l'anneau.",
    animated: "Active l'animation de tracé (désactivée si mouvement réduit).",
    ariaLabel: "Libellé accessible ; à défaut, il est dérivé des segments.",
    centerContent: "Contenu libre affiché au centre de l'anneau.",
    formatValue: "Fonction de formatage du texte de valeur de chaque segment.",
  },
  hookResult: {
    viewBox: "Attribut viewBox du SVG à rendre.",
    center: "Coordonnée du centre dans le repère du viewBox.",
    radius: "Rayon de l'anneau dans le repère du viewBox.",
    strokeWidth: "Largeur de trait dérivée de l'épaisseur choisie.",
    geometries:
      "Géométrie calculée de chaque segment : rotation, longueur, couleur, pourcentage, libellé.",
    total: "Somme des valeurs positives des segments.",
    shouldAnimate: "Vrai lorsque l'animation doit jouer (animée et mouvement non réduit).",
    resolvedAriaLabel: "Libellé accessible final, fourni ou dérivé des segments.",
    trackColor: "Couleur du fond de piste de l'anneau.",
  },
};

const en: typeof fr = {
  intro:
    "A donut chart to visualize a breakdown. Segments are drawn proportionally to their value, with a theme color, an optional legend and free content in the center. The ring animates on draw, unless reduced motion is preferred.",
  sections: {
    basic: "Usage",
    thickness: "Thickness",
    center: "Center content and format",
    hook: "useDonut hook",
    api: "API",
  },
  demos: {
    basicTitle: "segments and legend",
    basicDescription:
      "Each segment carries a label and a value; color is optional and falls back to a default palette. showLegend renders the legend below the ring.",
    thicknessTitle: "thin, medium, thick",
    thicknessDescription: "thickness sets the stroke width of the ring.",
    centerTitle: "centerContent and formatValue",
    centerDescription:
      "centerContent places free content at the heart of the ring (often a total). formatValue customizes the text of each displayed value.",
  },
  hookDescription:
    "The component relies on useDonut, which computes the arc geometry (rotation, length, color, percentage) and the accessible label. Use it to build a custom ring.",
  props: {
    segments: "Segments to draw, each with a label, a value and an optional color.",
    size: "Diameter of the ring (CSS value).",
    thickness: "Stroke width of the ring.",
    showLegend: "Renders a legend detailing each segment below the ring.",
    animated: "Enables the draw animation (disabled under reduced motion).",
    ariaLabel: "Accessible label; otherwise derived from the segments.",
    centerContent: "Free content displayed in the center of the ring.",
    formatValue: "Formatting function for the value text of each segment.",
  },
  hookResult: {
    viewBox: "viewBox attribute of the SVG to render.",
    center: "Center coordinate in the viewBox space.",
    radius: "Radius of the ring in the viewBox space.",
    strokeWidth: "Stroke width derived from the chosen thickness.",
    geometries: "Computed geometry of each segment: rotation, length, color, percentage, label.",
    total: "Sum of the positive values of the segments.",
    shouldAnimate: "True when the animation should play (animated and motion not reduced).",
    resolvedAriaLabel: "Final accessible label, provided or derived from the segments.",
    trackColor: "Track background color of the ring.",
  },
};

const texts = { fr, en };

export default function DonutDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "segments",
      type: "CanopDonutSegment[]",
      required: true,
      description: t.props.segments,
    },
    { name: "size", type: "string", defaultValue: '"12rem"', description: t.props.size },
    {
      name: "thickness",
      type: '"thin" | "medium" | "thick"',
      defaultValue: '"medium"',
      description: t.props.thickness,
    },
    { name: "showLegend", type: "boolean", defaultValue: "false", description: t.props.showLegend },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "centerContent", type: "ReactNode", description: t.props.centerContent },
    {
      name: "formatValue",
      type: "(segment: CanopDonutSegment, percentage: number) => string",
      description: t.props.formatValue,
    },
  ];

  const hookRows: PropRow[] = [
    { name: "viewBox", type: "string", description: t.hookResult.viewBox },
    { name: "center", type: "number", description: t.hookResult.center },
    { name: "radius", type: "number", description: t.hookResult.radius },
    { name: "strokeWidth", type: "number", description: t.hookResult.strokeWidth },
    { name: "geometries", type: "CanopDonutGeometry[]", description: t.hookResult.geometries },
    { name: "total", type: "number", description: t.hookResult.total },
    { name: "shouldAnimate", type: "boolean", description: t.hookResult.shouldAnimate },
    { name: "resolvedAriaLabel", type: "string", description: t.hookResult.resolvedAriaLabel },
    { name: "trackColor", type: "string", description: t.hookResult.trackColor },
  ];

  return (
    <DocPage title="Donut" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <Donut segments={segments} showLegend ariaLabel="Répartition des dépenses" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.thickness}>
        <DemoCard
          title={t.demos.thicknessTitle}
          description={t.demos.thicknessDescription}
          code={thicknessCode}
        >
          <Donut segments={segments} thickness="thin" size="9rem" />
          <Donut segments={segments} thickness="medium" size="9rem" />
          <Donut segments={segments} thickness="thick" size="9rem" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.center}>
        <DemoCard
          title={t.demos.centerTitle}
          description={t.demos.centerDescription}
          code={centerCode}
        >
          <Donut
            segments={segments}
            centerContent={
              <Heading level={2} size={3} gutterBottom={false}>
                1 550 €
              </Heading>
            }
            formatValue={(_segment, percentage) => `${Math.round(percentage)} %`}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.hook} description={t.hookDescription}>
        <CodeBlock code={hookCode} />
        <PropsTable rows={hookRows} />
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
