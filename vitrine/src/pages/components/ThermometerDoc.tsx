import { useState } from "react";
import { Slider, Stack, Thermometer } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Thermometer } from "@canop/ui";`;

const basicCode = `<Thermometer label="CPU" value={temperature} />`;

const levelsCode = `<Thermometer label="Disque" value={38} size="sm" />
<Thermometer label="CPU" value={74} size="sm" />
<Thermometer label="GPU" value={91} size="sm" />`;

const customCode = `<Thermometer
  label="Salle serveur"
  value={27.5}
  min={10}
  max={40}
  high={26}
  critical={32}
/>`;

function BasicDemo() {
  const [temperature, setTemperature] = useState(52);
  return (
    <Stack gap="lg" alignItems="center">
      <Thermometer label="CPU" value={temperature} />
      <Slider label="Température" value={temperature} onChange={setTemperature} min={0} max={100} />
    </Stack>
  );
}

const fr = {
  intro:
    "Jauge thermomètre : une barre verticale épurée, comme une jauge de chargement, posée sur son réservoir et remplie selon la valeur entre min et max. Les couleurs d'alerte suivent les seuils : vert (success) sous high, orange (warning) dès high, rouge (error) dès critical, réservoir compris. Trois graduations discrètes marquent min, high et critical ; au seuil critique, le réservoir pulse doucement. Le remplissage monte sur un ressort au montage et à chaque changement, coupé en mouvement réduit. Le composant est un role meter, annoncé avec sa valeur et son niveau.",
  sections: {
    basic: "Utilisation",
    levels: "Niveaux et taille",
    custom: "Échelle et seuils sur mesure",
    api: "API",
  },
  demos: {
    basicTitle: "value et label",
    basicDescription:
      "Déplacez le curseur : la colonne monte et change de couleur aux seuils 70 et 85.",
    levelsTitle: "normal, high, critical en size sm",
    levelsDescription: "La taille sm convient aux listes et aux cartes compactes.",
    customTitle: "min, max, high, critical",
    customDescription:
      "Chaque borne et chaque seuil se règle ; unit et formatValue changent l'affichage.",
  },
  props: {
    value: "Valeur mesurée, ou null quand elle est inconnue.",
    label: "Libellé affiché et nom accessible par défaut.",
    min: "Bas de l'échelle.",
    max: "Haut de l'échelle.",
    high: "Seuil à partir duquel la jauge passe en warning.",
    critical: "Seuil à partir duquel la jauge passe en error.",
    unit: "Unité ajoutée à la valeur.",
    size: "Taille de la jauge et du texte.",
    showValue: "Affiche la valeur à côté de la jauge.",
    formatValue: "Remplace le format de la valeur affichée et annoncée.",
    ariaLabel: "Nom accessible explicite.",
    animated: "Remplissage sur ressort et pulsation critique (coupés en mouvement réduit).",
  },
};

const en: typeof fr = {
  intro:
    "Thermometer gauge: a clean vertical bar, like a loading gauge, standing on its bulb and filled according to the value between min and max. Alert colors follow the thresholds: green (success) below high, orange (warning) from high, red (error) from critical, bulb included. Three discreet graduations mark min, high and critical; at the critical threshold, the bulb pulses softly. The fill rises on a spring on mount and on every change, cut under reduced motion. The component is a meter role, announced with its value and level.",
  sections: {
    basic: "Usage",
    levels: "Levels and size",
    custom: "Custom scale and thresholds",
    api: "API",
  },
  demos: {
    basicTitle: "value and label",
    basicDescription:
      "Move the slider: the column rises and changes color at the 70 and 85 thresholds.",
    levelsTitle: "normal, high, critical at size sm",
    levelsDescription: "The sm size fits lists and compact cards.",
    customTitle: "min, max, high, critical",
    customDescription:
      "Every bound and threshold can be set; unit and formatValue change the display.",
  },
  props: {
    value: "Measured value, or null when unknown.",
    label: "Displayed label and default accessible name.",
    min: "Bottom of the scale.",
    max: "Top of the scale.",
    high: "Threshold from which the gauge turns warning.",
    critical: "Threshold from which the gauge turns error.",
    unit: "Unit appended to the value.",
    size: "Size of the gauge and text.",
    showValue: "Shows the value next to the gauge.",
    formatValue: "Replaces the format of the displayed and announced value.",
    ariaLabel: "Explicit accessible name.",
    animated: "Spring fill and critical pulse (cut under reduced motion).",
  },
};

const texts = { fr, en };

export default function ThermometerDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "value", type: "number | null", required: true, description: t.props.value },
    { name: "label", type: "string", description: t.props.label },
    { name: "min", type: "number", defaultValue: "0", description: t.props.min },
    { name: "max", type: "number", defaultValue: "100", description: t.props.max },
    { name: "high", type: "number", defaultValue: "70", description: t.props.high },
    { name: "critical", type: "number", defaultValue: "85", description: t.props.critical },
    { name: "unit", type: "string", defaultValue: '"°C"', description: t.props.unit },
    { name: "size", type: '"sm" | "md"', defaultValue: '"md"', description: t.props.size },
    { name: "showValue", type: "boolean", defaultValue: "true", description: t.props.showValue },
    { name: "formatValue", type: "(value: number) => string", description: t.props.formatValue },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
  ];

  return (
    <DocPage title="Thermometer" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <BasicDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.levels}>
        <DemoCard
          title={t.demos.levelsTitle}
          description={t.demos.levelsDescription}
          code={levelsCode}
        >
          <Thermometer label="Disque" value={38} size="sm" />
          <Thermometer label="CPU" value={74} size="sm" />
          <Thermometer label="GPU" value={91} size="sm" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.custom}>
        <DemoCard
          title={t.demos.customTitle}
          description={t.demos.customDescription}
          code={customCode}
        >
          <Thermometer
            label="Salle serveur"
            value={27.5}
            min={10}
            max={40}
            high={26}
            critical={32}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
