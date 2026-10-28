import { useState } from "react";
import { Clock, Text, TimePicker } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { TimePicker, Clock } from "@canop/ui";`;

const pickerCode = `const [time, setTime] = useState("02:30");

<TimePicker label="Heure de la sauvegarde" value={time} onChange={setTime} />`;

const stepCode = `<TimePicker label="Redémarrage" value={time} onChange={setTime} minuteStep={15} />`;

const clockCode = `const [time, setTime] = useState("");

<Clock value={time} onChange={setTime} minuteStep={5} ariaLabel="Heure d'arrêt" />`;

function PickerDemo() {
  const [time, setTime] = useState("02:30");
  return <TimePicker label="Heure de la sauvegarde" value={time} onChange={setTime} />;
}

function StepDemo() {
  const [time, setTime] = useState("");
  return <TimePicker label="Redémarrage" value={time} onChange={setTime} minuteStep={15} />;
}

function ClockDemo() {
  const [time, setTime] = useState("");
  return (
    <>
      <Clock value={time} onChange={setTime} minuteStep={5} ariaLabel="Heure d'arrêt" />
      <Text variant="body-sm" tone="muted">
        {time === "" ? "—" : time}
      </Text>
    </>
  );
}

const fr = {
  intro:
    "Sélection d'une heure au format 24 h, à la saisie ou sur un cadran d'horloge. Le champ accepte « 9:30 », « 0930 » ou « 9h30 » et les normalise en HH:MM à la sortie du champ ou à Entrée ; Alt + flèche bas ou le bouton horloge ouvrent le cadran. Sur le cadran, on choisit les heures (cercle extérieur 1 à 12, intérieur 13 à 00) puis les minutes, au doigt, à la souris ou au clavier : flèches, Page haut et Page bas, Début et Fin, Entrée pour passer aux minutes puis valider. L'aiguille suit un ressort par le plus court chemin, coupé en mouvement réduit.",
  sections: {
    picker: "Champ TimePicker",
    step: "Pas des minutes",
    clock: "Clock seul",
    api: "API TimePicker",
    clockApi: "API Clock",
  },
  demos: {
    pickerTitle: "value, onChange",
    pickerDescription:
      "La valeur est une chaîne HH:MM, ou une chaîne vide. Une saisie invalide affiche un message d'erreur sans modifier la valeur.",
    stepTitle: "minuteStep",
    stepDescription:
      "Le cadran aimante les minutes sur ce pas (5 par défaut). La saisie clavier dans le champ reste libre.",
    clockTitle: "Cadran contrôlé",
    clockDescription:
      "Le cadran seul, pour un panneau ou une carte. onComplete est appelé après le choix des minutes.",
  },
  props: {
    label: "Libellé flottant du champ.",
    value: "Heure au format HH:MM, ou chaîne vide.",
    onChange: "Appelé avec l'heure normalisée HH:MM (chaîne vide à l'effacement).",
    minuteStep: "Pas des minutes sur le cadran, de 1 à 30.",
    placeholder: "Texte d'attente du champ.",
    helperText: "Aide affichée sous le champ.",
    error: "Message d'erreur ; prend le pas sur l'erreur de saisie.",
    required: "Champ obligatoire.",
    disabled: "Désactive le champ.",
    fullWidth: "Occupe toute la largeur disponible.",
    size: "Hauteur du champ.",
    name: "Nom du champ dans un formulaire.",
    onComplete: "Appelé quand les minutes sont choisies.",
    ariaLabel: "Nom accessible du cadran.",
    autoFocus: "Place le focus sur le cadran au montage.",
    animated: "Ressort de l'aiguille et fondu des graduations (coupés en mouvement réduit).",
  },
};

const en: typeof fr = {
  intro:
    "Pick a 24-hour time, by typing or on a clock dial. The field accepts “9:30”, “0930” or “9h30” and normalizes it to HH:MM on blur or Enter; Alt + Down Arrow or the clock button open the dial. On the dial, pick the hours (outer ring 1 to 12, inner ring 13 to 00) then the minutes, by touch, mouse or keyboard: arrows, Page Up and Page Down, Home and End, Enter to move on to minutes then confirm. The hand follows a spring along the shortest path, cut under reduced motion.",
  sections: {
    picker: "TimePicker field",
    step: "Minute step",
    clock: "Standalone Clock",
    api: "TimePicker API",
    clockApi: "Clock API",
  },
  demos: {
    pickerTitle: "value, onChange",
    pickerDescription:
      "The value is an HH:MM string, or an empty string. Invalid input shows an error message without changing the value.",
    stepTitle: "minuteStep",
    stepDescription:
      "The dial snaps minutes to this step (5 by default). Typing in the field stays free.",
    clockTitle: "Controlled dial",
    clockDescription:
      "The dial alone, for a panel or a card. onComplete is called once the minutes are picked.",
  },
  props: {
    label: "Floating label of the field.",
    value: "Time as HH:MM, or an empty string.",
    onChange: "Called with the normalized HH:MM time (empty string when cleared).",
    minuteStep: "Minute step on the dial, from 1 to 30.",
    placeholder: "Field placeholder.",
    helperText: "Help text below the field.",
    error: "Error message; takes precedence over the input error.",
    required: "Required field.",
    disabled: "Disables the field.",
    fullWidth: "Takes the full available width.",
    size: "Field height.",
    name: "Field name in a form.",
    onComplete: "Called once the minutes are picked.",
    ariaLabel: "Accessible name of the dial.",
    autoFocus: "Focuses the dial on mount.",
    animated: "Hand spring and marks fade (cut under reduced motion).",
  },
};

const texts = { fr, en };

export default function TimePickerDoc() {
  const t = texts[useDocLocale()];

  const pickerRows: PropRow[] = [
    { name: "label", type: "string", required: true, description: t.props.label },
    { name: "value", type: "string", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(value: string) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "minuteStep", type: "number", defaultValue: "5", description: t.props.minuteStep },
    {
      name: "placeholder",
      type: "string",
      defaultValue: '"HH:MM"',
      description: t.props.placeholder,
    },
    { name: "helperText", type: "string", description: t.props.helperText },
    { name: "error", type: "string | null", description: t.props.error },
    { name: "required", type: "boolean", defaultValue: "false", description: t.props.required },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "fullWidth", type: "boolean", defaultValue: "true", description: t.props.fullWidth },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    { name: "name", type: "string", description: t.props.name },
  ];

  const clockRows: PropRow[] = [
    { name: "value", type: "string", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(value: string) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "minuteStep", type: "number", defaultValue: "5", description: t.props.minuteStep },
    { name: "onComplete", type: "() => void", description: t.props.onComplete },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "autoFocus", type: "boolean", defaultValue: "false", description: t.props.autoFocus },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
  ];

  return (
    <DocPage title="TimePicker" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.picker}>
        <DemoCard
          title={t.demos.pickerTitle}
          description={t.demos.pickerDescription}
          code={pickerCode}
        >
          <PickerDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.step}>
        <DemoCard title={t.demos.stepTitle} description={t.demos.stepDescription} code={stepCode}>
          <StepDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.clock}>
        <DemoCard
          title={t.demos.clockTitle}
          description={t.demos.clockDescription}
          code={clockCode}
        >
          <ClockDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={pickerRows} />
      </DocSection>
      <DocSection title={t.sections.clockApi}>
        <PropsTable rows={clockRows} />
      </DocSection>
    </DocPage>
  );
}
