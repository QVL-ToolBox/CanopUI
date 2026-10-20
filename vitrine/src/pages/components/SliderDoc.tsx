import { useState } from "react";
import { Slider, Stack } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Slider } from "@canop/ui";`;

const basicCode = `function VolumeDemo() {
  const [value, setValue] = useState(40);

  return <Slider value={value} onChange={setValue} />;
}`;

const labelCode = `function BudgetDemo() {
  const [value, setValue] = useState(65);

  return <Slider value={value} onChange={setValue} label="Budget" showValue />;
}`;

const stepCode = `function RatingDemo() {
  const [value, setValue] = useState(3);

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={5}
      step={0.5}
      marks
      label="Boissons"
      showValue
    />
  );
}`;

const colorsCode = `<Slider value={60} onChange={setValue} color="primary" label="primary" showValue />
<Slider value={60} onChange={setValue} color="secondary" label="secondary" showValue />
<Slider value={60} onChange={setValue} color="accent" label="accent" showValue />
<Slider value={60} onChange={setValue} color="success" label="success" showValue />`;

const disabledCode = `<Slider value={30} onChange={setValue} label="Verrouillé" showValue disabled />`;

const ratingCode = `const CRITERIA = ["Boissons", "Prix", "Ambiance", "Décoration"];

function RatingGroup() {
  const [notes, setNotes] = useState<Record<string, number>>({
    Boissons: 2.5,
    Prix: 2.5,
    Ambiance: 2.5,
    "Décoration": 2.5,
  });

  return (
    <Stack gap="md">
      {CRITERIA.map((criterion) => (
        <Slider
          key={criterion}
          value={notes[criterion]}
          onChange={(value) => setNotes((current) => ({ ...current, [criterion]: value }))}
          min={0}
          max={5}
          step={0.5}
          marks
          label={criterion}
          showValue
        />
      ))}
    </Stack>
  );
}`;

const CRITERIA = ["Boissons", "Prix", "Ambiance", "Décoration"];

function BasicDemo() {
  const [value, setValue] = useState(40);

  return <Slider value={value} onChange={setValue} />;
}

function LabelDemo() {
  const [value, setValue] = useState(65);

  return <Slider value={value} onChange={setValue} label="Budget" showValue />;
}

function StepDemo() {
  const [value, setValue] = useState(3);

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={5}
      step={0.5}
      marks
      label="Boissons"
      showValue
    />
  );
}

function ColorsDemo() {
  const [values, setValues] = useState({
    primary: 60,
    secondary: 60,
    accent: 60,
    success: 60,
  });

  return (
    <Stack gap="md">
      <Slider
        value={values.primary}
        onChange={(value) => setValues((current) => ({ ...current, primary: value }))}
        color="primary"
        label="primary"
        showValue
      />
      <Slider
        value={values.secondary}
        onChange={(value) => setValues((current) => ({ ...current, secondary: value }))}
        color="secondary"
        label="secondary"
        showValue
      />
      <Slider
        value={values.accent}
        onChange={(value) => setValues((current) => ({ ...current, accent: value }))}
        color="accent"
        label="accent"
        showValue
      />
      <Slider
        value={values.success}
        onChange={(value) => setValues((current) => ({ ...current, success: value }))}
        color="success"
        label="success"
        showValue
      />
    </Stack>
  );
}

function RatingGroupDemo() {
  const [notes, setNotes] = useState<Record<string, number>>({
    Boissons: 2.5,
    Prix: 2.5,
    Ambiance: 2.5,
    Décoration: 2.5,
  });

  return (
    <Stack gap="md">
      {CRITERIA.map((criterion) => (
        <Slider
          key={criterion}
          value={notes[criterion]}
          onChange={(value) => setNotes((current) => ({ ...current, [criterion]: value }))}
          min={0}
          max={5}
          step={0.5}
          marks
          label={criterion}
          showValue
        />
      ))}
    </Stack>
  );
}

const fr = {
  intro:
    "Curseur strictement contrôlé pour choisir une valeur numérique sur un intervalle. Libellé à gauche, valeur à droite, graduations optionnelles. Le nombre de décimales affichées est déduit de step. La piste active porte un dégradé des trois teintes de sa couleur, et la pastille est une pilule couchée en squircle.",
  sections: {
    basic: "Curseur simple",
    label: "Libellé et valeur",
    step: "Pas et graduations",
    colors: "Couleurs",
    disabled: "Désactivé",
    rating: "Notation multi-critères",
    api: "API",
  },
  demos: {
    basicTitle: "value et onChange",
    basicDescription:
      "Le composant est toujours contrôlé : la valeur vient du parent, onChange la met à jour. La pastille est une pilule couchée : large dans le sens du glissement pour s'attraper, basse dans l'autre pour désigner une position sans la masquer. La zone saisissable est le rail plus son rembourrage vertical, et non le gabarit de la pastille — elle atteint 2,75 rem au doigt, les 44 px de référence.",
    labelTitle: "label et showValue",
    labelDescription:
      "label décrit la mesure à gauche ; showValue affiche la valeur courante à droite.",
    stepTitle: "min, max, step et marks",
    stepDescription:
      "Avec step à 0.5, la valeur est formatée avec une décimale. marks matérialise chaque cran.",
    colorsTitle: "color",
    colorsDescription:
      "Quatre couleurs de palette : primary, secondary, accent et success. Chacune donne un dégradé de ses trois teintes — light, main et dark — comme le pouce de la barre de défilement et le Spinner. La rampe est étirée sur tout le rail et non sur la seule portion remplie : sinon elle se comprimerait avec la valeur, et la teinte sous la pastille changerait selon la position au lieu de la désigner.",
    disabledTitle: "disabled",
    disabledDescription:
      "Le curseur reste lisible mais n'est plus manipulable. C'est là que les bouts arrondis du rail et de la piste se remarquent le plus : la pastille ne recouvre plus la coupe.",
    ratingTitle: "Plusieurs curseurs dans un Stack",
    ratingDescription:
      "Une notation multi-critères se compose côté consommateur : un Slider par critère dans un Stack.",
  },
  props: {
    value: "Valeur courante. Le composant est strictement contrôlé.",
    onChange: "Appelé avec la nouvelle valeur à chaque déplacement du curseur.",
    min: "Borne basse de l'intervalle.",
    max: "Borne haute de l'intervalle.",
    step: "Incrément du curseur. Détermine aussi le nombre de décimales affichées.",
    label: "Libellé affiché à gauche au-dessus du curseur, et nom accessible par défaut.",
    ariaLabel: "Nom accessible explicite. Prend le pas sur label.",
    showValue: "Affiche la valeur courante à droite du libellé.",
    format:
      "Met la valeur en forme partout où elle est lue : en-tête et texte annoncé aux lecteurs d'écran. Permet une unité, un symbole ou un séparateur de milliers.",
    size: "Gabarit du curseur. Au doigt, la zone saisissable atteint 2,75 rem dans les deux cas.",
    marks: "Affiche une graduation par cran de step.",
    disabled: "Désactive l'interaction.",
    color:
      "Famille de palette du dégradé de la piste active et de la pastille : ses trois arrêts sont light, main et dark.",
  },
};

const en: typeof fr = {
  intro:
    "Strictly controlled slider to pick a numeric value in a range. Label on the left, value on the right, optional marks. The number of displayed decimals is derived from step. The active track carries a gradient of its color's three tints, and the thumb is a lying squircle pill.",
  sections: {
    basic: "Simple slider",
    label: "Label and value",
    step: "Step and marks",
    colors: "Colors",
    disabled: "Disabled",
    rating: "Multi-criteria rating",
    api: "API",
  },
  demos: {
    basicTitle: "value and onChange",
    basicDescription:
      "The component is always controlled: the value comes from the parent, onChange updates it. The thumb is a lying pill: wide along the sliding axis so it can be grabbed, low across it so it points at a position without hiding it. The grab area is the rail plus its vertical padding, not the thumb's own size — it reaches 2.75 rem on touch, the 44 px reference.",
    labelTitle: "label and showValue",
    labelDescription:
      "label describes the measure on the left; showValue displays the current value on the right.",
    stepTitle: "min, max, step and marks",
    stepDescription:
      "With step set to 0.5, the value is formatted with one decimal. marks renders every notch.",
    colorsTitle: "color",
    colorsDescription:
      "Four palette colors: primary, secondary, accent and success. Each yields a gradient of its three tints — light, main and dark — like the scrollbar thumb and the Spinner. The ramp is stretched over the whole rail rather than over the filled portion alone: otherwise it would compress with the value, and the tint under the thumb would change with position instead of marking it.",
    disabledTitle: "disabled",
    disabledDescription:
      "The slider stays readable but is no longer interactive. This is where the rounded ends of the rail and the track show the most: the thumb no longer covers the cut.",
    ratingTitle: "Several sliders in a Stack",
    ratingDescription:
      "A multi-criteria rating is composed on the consumer side: one Slider per criterion in a Stack.",
  },
  props: {
    value: "Current value. The component is strictly controlled.",
    onChange: "Called with the new value on every slider move.",
    min: "Lower bound of the range.",
    max: "Upper bound of the range.",
    step: "Slider increment. Also drives the number of displayed decimals.",
    label: "Label displayed on the left above the slider, and default accessible name.",
    ariaLabel: "Explicit accessible name. Takes precedence over label.",
    showValue: "Displays the current value to the right of the label.",
    format:
      "Formats the value everywhere it is read: header and the text announced to screen readers. Allows a unit, a symbol or a thousands separator.",
    size: "Slider gauge. On touch, the grab area reaches 2.75 rem in both cases.",
    marks: "Renders one mark per step notch.",
    disabled: "Disables interaction.",
    color:
      "Palette family of the active track and thumb gradient: its three stops are light, main and dark.",
  },
};

const texts = { fr, en };

export default function SliderDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    { name: "value", type: "number", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(value: number) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "min", type: "number", defaultValue: "0", description: t.props.min },
    { name: "max", type: "number", defaultValue: "100", description: t.props.max },
    { name: "step", type: "number", defaultValue: "1", description: t.props.step },
    { name: "label", type: "string", description: t.props.label },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "showValue", type: "boolean", defaultValue: "false", description: t.props.showValue },
    { name: "format", type: "(value: number) => string", description: t.props.format },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    { name: "marks", type: "boolean", defaultValue: "false", description: t.props.marks },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "success"',
      defaultValue: '"primary"',
      description: t.props.color,
    },
  ];

  return (
    <DocPage title="Slider" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
          align="stretch"
        >
          <BasicDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.label}>
        <DemoCard
          title={t.demos.labelTitle}
          description={t.demos.labelDescription}
          code={labelCode}
          align="stretch"
        >
          <LabelDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.step}>
        <DemoCard
          title={t.demos.stepTitle}
          description={t.demos.stepDescription}
          code={stepCode}
          align="stretch"
        >
          <StepDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors}>
        <DemoCard
          title={t.demos.colorsTitle}
          description={t.demos.colorsDescription}
          code={colorsCode}
          align="stretch"
        >
          <ColorsDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard
          title={t.demos.disabledTitle}
          description={t.demos.disabledDescription}
          code={disabledCode}
          align="stretch"
        >
          <Slider value={30} onChange={() => {}} label="Verrouillé" showValue disabled />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.rating}>
        <DemoCard
          title={t.demos.ratingTitle}
          description={t.demos.ratingDescription}
          code={ratingCode}
          align="stretch"
        >
          <RatingGroupDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
