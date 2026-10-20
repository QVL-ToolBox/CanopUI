import { DataTable, Rating, Stack, type CanopColumn } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Rating } from "@canop/ui";`;

const basicCode = `<Rating value={4.3} />
<Rating value={3.5} />
<Rating value={2.8} />
<Rating value={1.2} />`;

const valueCode = `<Rating value={4.3} showValue />
<Rating value={4.3} label="Ambiance" showValue />
<Rating value={2.5} label="Prix" showValue />`;

const sizesCode = `<Rating value={3.7} size="xs" showValue />
<Rating value={3.7} size="sm" showValue />
<Rating value={3.7} size="md" showValue />
<Rating value={3.7} size="lg" showValue />
<Rating value={3.7} size="xl" showValue />`;

const colorsCode = `<Rating value={4.2} color="primary" label="primary" showValue />
<Rating value={4.2} color="secondary" label="secondary" showValue />
<Rating value={4.2} color="accent" label="accent" showValue />
<Rating value={4.2} color="success" label="success" showValue />
<Rating value={4.2} color="warning" label="warning" showValue />`;

const boundsCode = `<Rating value={0} label="0" showValue />
<Rating value={5} label="5" showValue />
<Rating value={7} label="7 borné à 5" showValue />
<Rating value={3.5} max={10} label="max 10" showValue />`;

const tableCode = `interface Bar {
  id: string;
  name: string;
  moy: number;
}

const columns: CanopColumn<Bar>[] = [
  { key: "name", header: "Établissement", sortable: true },
  {
    key: "moy",
    header: "Note moyenne",
    sortable: true,
    sortValue: (row) => row.moy,
    render: (row) => <Rating value={row.moy} showValue />,
  },
];

<DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />`;

interface Bar {
  id: string;
  name: string;
  moy: number;
}

const bars: Bar[] = [
  { id: "1", name: "Le Comptoir", moy: 4.6 },
  { id: "2", name: "Chez Marcel", moy: 4.25 },
  { id: "3", name: "La Cave", moy: 3.1 },
  { id: "4", name: "Le Perchoir", moy: 2.4 },
];

const columns: CanopColumn<Bar>[] = [
  { key: "name", header: "Établissement", sortable: true },
  {
    key: "moy",
    header: "Note moyenne",
    sortable: true,
    sortValue: (row) => row.moy,
    render: (row) => <Rating value={row.moy} showValue />,
  },
];

const fr = {
  intro:
    "Note moyenne en lecture seule, affichée en étoiles avec remplissage fractionnaire au dixième. Compact par défaut : pensé pour une cellule de DataTable, une bulle de carte ou un en-tête de fiche. Le composant n'est jamais interactif : il n'y a pas de prop onChange.",
  sections: {
    basic: "Notes fractionnaires",
    value: "Libellé et valeur",
    sizes: "Tailles",
    colors: "Couleurs",
    bounds: "Bornes",
    table: "Dans un DataTable",
    api: "API",
  },
  demos: {
    basicTitle: "value",
    basicDescription:
      "La dernière étoile est remplie au prorata du dixième : 4.3 rend quatre étoiles pleines et une étoile remplie à 30 %.",
    valueTitle: "label et showValue",
    valueDescription:
      "label décrit la mesure à gauche des étoiles et alimente le nom accessible ; showValue affiche la note à droite, en chiffres tabulaires.",
    sizesTitle: "size",
    sizesDescription:
      "Les cinq tailles de l'échelle Icon, de xs à xl. La valeur suit la taille des étoiles.",
    colorsTitle: "color",
    colorsDescription:
      "Cinq couleurs de palette. Les étoiles vides reprennent la même teinte en version atténuée.",
    boundsTitle: "Valeurs limites",
    boundsDescription:
      "La valeur est bornée entre 0 et max : une note hors bornes est ramenée dans l'intervalle plutôt que de casser l'affichage.",
    tableTitle: "Cellule de tableau",
    tableDescription:
      "Le rendu compact tient dans une cellule ; le tri s'appuie sur la valeur brute via sortValue.",
  },
  props: {
    value: "Note à afficher. Bornée entre 0 et max, arrondie au dixième.",
    max: "Nombre d'étoiles affichées.",
    showValue: "Affiche la note en chiffres à droite des étoiles.",
    size: "Taille des étoiles, sur l'échelle du composant Icon.",
    color: "Couleur de palette des étoiles pleines.",
    label: "Libellé affiché à gauche des étoiles, repris dans le nom accessible.",
  },
};

const en: typeof fr = {
  intro:
    "Read-only average rating, displayed as stars with fractional filling down to a tenth. Compact by default: designed for a DataTable cell, a map popup or a record header. The component is never interactive: there is no onChange prop.",
  sections: {
    basic: "Fractional ratings",
    value: "Label and value",
    sizes: "Sizes",
    colors: "Colors",
    bounds: "Bounds",
    table: "Inside a DataTable",
    api: "API",
  },
  demos: {
    basicTitle: "value",
    basicDescription:
      "The last star is filled proportionally to the tenth: 4.3 renders four full stars and one star filled at 30%.",
    valueTitle: "label and showValue",
    valueDescription:
      "label describes the measure on the left of the stars and feeds the accessible name; showValue displays the score on the right, with tabular figures.",
    sizesTitle: "size",
    sizesDescription:
      "The five sizes of the Icon scale, from xs to xl. The value follows the stars.",
    colorsTitle: "color",
    colorsDescription: "Five palette colors. Empty stars reuse the same hue, toned down.",
    boundsTitle: "Boundary values",
    boundsDescription:
      "The value is clamped between 0 and max: an out-of-range score is brought back into the range instead of breaking the rendering.",
    tableTitle: "Table cell",
    tableDescription:
      "The compact rendering fits in a cell; sorting relies on the raw value through sortValue.",
  },
  props: {
    value: "Score to display. Clamped between 0 and max, rounded to the tenth.",
    max: "Number of stars displayed.",
    showValue: "Displays the score in figures on the right of the stars.",
    size: "Star size, on the Icon component scale.",
    color: "Palette color of the filled stars.",
    label: "Label displayed on the left of the stars, reused in the accessible name.",
  },
};

const texts = { fr, en };

export default function RatingDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "value", type: "number", required: true, description: t.props.value },
    { name: "max", type: "number", defaultValue: "5", description: t.props.max },
    { name: "showValue", type: "boolean", defaultValue: "false", description: t.props.showValue },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"sm"',
      description: t.props.size,
    },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "success" | "warning"',
      defaultValue: '"accent"',
      description: t.props.color,
    },
    { name: "label", type: "string", description: t.props.label },
  ];

  return (
    <DocPage title="Rating" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
          align="start"
        >
          <Stack gap="sm">
            <Rating value={4.3} />
            <Rating value={3.5} />
            <Rating value={2.8} />
            <Rating value={1.2} />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.value}>
        <DemoCard
          title={t.demos.valueTitle}
          description={t.demos.valueDescription}
          code={valueCode}
          align="start"
        >
          <Stack gap="sm">
            <Rating value={4.3} showValue />
            <Rating value={4.3} label="Ambiance" showValue />
            <Rating value={2.5} label="Prix" showValue />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard
          title={t.demos.sizesTitle}
          description={t.demos.sizesDescription}
          code={sizesCode}
          align="start"
        >
          <Stack gap="sm">
            <Rating value={3.7} size="xs" showValue />
            <Rating value={3.7} size="sm" showValue />
            <Rating value={3.7} size="md" showValue />
            <Rating value={3.7} size="lg" showValue />
            <Rating value={3.7} size="xl" showValue />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors}>
        <DemoCard
          title={t.demos.colorsTitle}
          description={t.demos.colorsDescription}
          code={colorsCode}
          align="start"
        >
          <Stack gap="sm">
            <Rating value={4.2} color="primary" label="primary" showValue />
            <Rating value={4.2} color="secondary" label="secondary" showValue />
            <Rating value={4.2} color="accent" label="accent" showValue />
            <Rating value={4.2} color="success" label="success" showValue />
            <Rating value={4.2} color="warning" label="warning" showValue />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.bounds}>
        <DemoCard
          title={t.demos.boundsTitle}
          description={t.demos.boundsDescription}
          code={boundsCode}
          align="start"
        >
          <Stack gap="sm">
            <Rating value={0} label="0" showValue />
            <Rating value={5} label="5" showValue />
            <Rating value={7} label="7 → 5" showValue />
            <Rating value={3.5} max={10} label="max 10" showValue />
          </Stack>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.table}>
        <DemoCard
          title={t.demos.tableTitle}
          description={t.demos.tableDescription}
          code={tableCode}
          align="stretch"
        >
          <DataTable columns={columns} rows={bars} getRowKey={(row) => row.id} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
