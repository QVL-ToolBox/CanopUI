import { useState } from "react";
import { Button, ProgressBar, Stack } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { ProgressBar } from "@canop/ui";`;

const basicCode = `<ProgressBar value={60} />`;

const labelCode = `<ProgressBar value={72} label="Téléversement" showValue />`;

const sweepCode = `<ProgressBar value={45} label="Analyse en cours" showValue />
<ProgressBar value={45} label="Analyse figee" showValue animated={false} />`;

const segmentsCode = `<ProgressBar
  label="Occupation du coffre"
  segments={[
    { value: 42, color: "primary", label: "Documents" },
    { value: 18, color: "accent", label: "Photos" },
    { value: 9, color: "warning", label: "Archives" },
  ]}
  max={100}
/>`;

const colorsCode = `<ProgressBar value={65} color="primary" label="primary" />
<ProgressBar value={65} color="accent" label="accent" />
<ProgressBar value={65} color="success" label="success" />
<ProgressBar value={65} color="warning" label="warning" />
<ProgressBar value={65} color="error" label="error" />`;

const animatedCode = `function ProgressBarDemo() {
  const [value, setValue] = useState(20);

  return (
    <Stack gap="md">
      <ProgressBar value={value} label="Téléversement" showValue />
      <Button onClick={() => setValue((current) => Math.min(100, current + 20))}>
        Progresser
      </Button>
    </Stack>
  );
}`;

function ProgressBarDemo() {
  const [value, setValue] = useState(20);

  return (
    <Stack gap="md">
      <ProgressBar value={value} label="Téléversement" showValue />
      <Button onClick={() => setValue((current) => Math.min(100, current + 20))}>Progresser</Button>
    </Stack>
  );
}

const fr = {
  intro:
    "Barre de progression déterminée pour visualiser l'avancement d'une opération. Libellé et pourcentage optionnels, sept couleurs sémantiques, une valeur bornée entre 0 et 100, et un découpage en segments quand plusieurs parts se partagent la même barre. La portion remplie porte un dégradé, une tête arrondie, et un reflet qui la balaie pendant l'attente.",
  sections: {
    basic: "Progression simple",
    label: "Libellé et valeur",
    sweep: "Reflet de balayage",
    colors: "Couleurs",
    segments: "Segments",
    animated: "Progression animée",
    api: "API",
  },
  demos: {
    basicTitle: "value",
    basicDescription: "La valeur exprime un pourcentage compris entre 0 et 100.",
    labelTitle: "label et showValue",
    labelDescription: "label décrit l'opération ; showValue affiche le pourcentage arrondi.",
    sweepTitle: "animated",
    sweepDescription:
      "Au repos la portion remplie porte un dégradé simple — light, main et dark de sa couleur, l'extrémité claire éclaircie vers le blanc pour creuser l'écart. Quand animated est vrai, un unique reflet blanc la traverse de gauche à droite, le sens d'un avancement. Un seul reflet, et non un motif répété : deux points clairs à la fois se lisent comme un défaut d'affichage. Le balayage s'arrête en mouvement réduit — ici c'est la largeur qui porte l'information, le reflet n'est que du décor.",
    colorsTitle: "color",
    colorsDescription:
      "Choisissez la couleur en fonction de l'intention : neutre, accent ou statut.",
    segmentsTitle: "segments et max",
    segmentsDescription:
      "Plusieurs parts se partagent la même barre, chacune avec sa couleur et son libellé. Sans max, le total des segments fait le tout ; avec max, la barre garde de la place libre à droite — c'est ce qui distingue une part de cent d'une somme répartie. max n'a de sens qu'ici : la barre simple le refuse au niveau du type, parce qu'elle ne l'a jamais lu et qu'un value={acquis} max={total} s'y affichait faux sans rien signaler.",
    animatedTitle: "Valeur pilotée par l'état",
    animatedDescription:
      "Mettez à jour value dans le temps pour refléter l'avancement réel d'un traitement.",
  },
  props: {
    value:
      "Barre simple. Progression en pourcentage, bornée automatiquement entre 0 et 100 : ce n'est jamais une part d'un total, et max est refusé à côté d'elle.",
    label: "Libellé affiché au-dessus de la barre et utilisé comme description accessible.",
    color: "Couleur de remplissage de la barre.",
    showValue: "Barre simple. Affiche le pourcentage arrondi à droite du libellé.",
    animated:
      "Fait balayer le reflet pendant l'attente. Sans effet en mouvement réduit, où le balayage ne démarre pas.",
    segments:
      "Barre segmentée. Découpe la barre en parts, chacune avec sa valeur, sa couleur et son libellé. Exclut value et showValue.",
    max: "Barre segmentée uniquement. Total de référence des segments, leur somme par défaut, ce qui remplit toute la barre.",
    ariaLabel: "Nom accessible de la barre segmentée, quand le libellé visible ne suffit pas.",
  },
};

const en: typeof fr = {
  intro:
    "Determinate progress bar to visualize the advancement of an operation. Optional label and percentage, seven semantic colors, a value clamped between 0 and 100, and a split into segments when several shares divide the same bar. The filled portion carries a gradient, a rounded head, and a sheen sweeping across it while the wait lasts.",
  sections: {
    basic: "Simple progress",
    label: "Label and value",
    sweep: "Sweeping sheen",
    colors: "Colors",
    segments: "Segments",
    animated: "Animated progress",
    api: "API",
  },
  demos: {
    basicTitle: "value",
    basicDescription: "The value expresses a percentage between 0 and 100.",
    labelTitle: "label and showValue",
    labelDescription: "label describes the operation; showValue displays the rounded percentage.",
    sweepTitle: "animated",
    sweepDescription:
      "At rest the filled portion carries a simple gradient — light, main and dark of its color, the light end lifted toward white to widen the spread. When animated is true, a single white sheen crosses it left to right, the direction of progress. One sheen, not a repeated pattern: two bright points at once read as a display glitch. The sweep stops under reduced motion — here it is the width that carries the information, the sheen is only decoration.",
    colorsTitle: "color",
    colorsDescription: "Pick the color based on intent: neutral, accent or status.",
    segmentsTitle: "segments and max",
    segmentsDescription:
      "Several shares divide the same bar, each with its own color and label. Without max, the segment total is the whole; with max, the bar keeps free room on the right — that is what tells a share of a hundred from a split total. max only makes sense here: the simple bar rejects it at the type level, because it never read it and a value={done} max={total} rendered wrong there without a word.",
    animatedTitle: "Value driven by state",
    animatedDescription: "Update value over time to reflect the real advancement of a process.",
  },
  props: {
    value:
      "Simple bar. Progress as a percentage, automatically clamped between 0 and 100: it is never a share of a total, and max is rejected alongside it.",
    label: "Label displayed above the bar and used as the accessible description.",
    color: "Fill color of the bar.",
    showValue: "Simple bar. Displays the rounded percentage to the right of the label.",
    animated:
      "Sweeps the sheen while the wait lasts. No effect under reduced motion, where the sweep does not start.",
    segments:
      "Segmented bar. Splits the bar into shares, each with its value, color and label. Excludes value and showValue.",
    max: "Segmented bar only. Reference total of the segments, their sum by default, which fills the whole bar.",
    ariaLabel: "Accessible name of the segmented bar, when the visible label is not enough.",
  },
};

const texts = { fr, en };

export default function ProgressBarDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "value",
      type: "number",
      defaultValue: "0",
      description: t.props.value,
    },
    {
      name: "label",
      type: "string",
      description: t.props.label,
    },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success"',
      defaultValue: '"primary"',
      description: t.props.color,
    },
    {
      name: "showValue",
      type: "boolean",
      defaultValue: "false",
      description: t.props.showValue,
    },
    {
      name: "animated",
      type: "boolean",
      defaultValue: "true",
      description: t.props.animated,
    },
    {
      name: "segments",
      type: "CanopProgressSegment[]",
      description: t.props.segments,
    },
    {
      name: "max",
      type: "number",
      description: t.props.max,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.props.ariaLabel,
    },
  ];

  return (
    <DocPage title="ProgressBar" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
          align="stretch"
        >
          <ProgressBar value={60} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.label}>
        <DemoCard
          title={t.demos.labelTitle}
          description={t.demos.labelDescription}
          code={labelCode}
          align="stretch"
        >
          <ProgressBar value={72} label="Téléversement" showValue />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sweep}>
        <DemoCard
          title={t.demos.sweepTitle}
          description={t.demos.sweepDescription}
          code={sweepCode}
          align="stretch"
        >
          <ProgressBar value={45} label="Analyse en cours" showValue />
          <ProgressBar value={45} label="Analyse figée" showValue animated={false} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors}>
        <DemoCard
          title={t.demos.colorsTitle}
          description={t.demos.colorsDescription}
          code={colorsCode}
          align="stretch"
        >
          <ProgressBar value={65} color="primary" label="primary" />
          <ProgressBar value={65} color="accent" label="accent" />
          <ProgressBar value={65} color="success" label="success" />
          <ProgressBar value={65} color="warning" label="warning" />
          <ProgressBar value={65} color="error" label="error" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.segments}>
        <DemoCard
          title={t.demos.segmentsTitle}
          description={t.demos.segmentsDescription}
          code={segmentsCode}
          align="stretch"
        >
          <ProgressBar
            label="Occupation du coffre"
            segments={[
              { value: 42, color: "primary", label: "Documents" },
              { value: 18, color: "accent", label: "Photos" },
              { value: 9, color: "warning", label: "Archives" },
            ]}
            max={100}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.animated}>
        <DemoCard
          title={t.demos.animatedTitle}
          description={t.demos.animatedDescription}
          code={animatedCode}
          align="stretch"
        >
          <ProgressBarDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
