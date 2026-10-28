import { useState } from "react";
import { Calendar, DatePicker, Stack, WeekdayPicker, type CanopWeekday } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { DatePicker, Calendar, WeekdayPicker } from "@canop/ui";`;

const pickerCode = `const [date, setDate] = useState<Date | null>(null);

<DatePicker
  label="Date de maintenance"
  value={date}
  onChange={setDate}
  min={new Date()}
  clearable
/>`;

const calendarCode = `const [date, setDate] = useState<Date | null>(new Date());

<Calendar value={date} onChange={setDate} ariaLabel="Date de la sauvegarde" />`;

const rangeCode = `<Calendar
  value={date}
  onChange={setDate}
  min={startOfMonth}
  max={endOfNextMonth}
  isDateDisabled={(day) => day.getDay() === 0}
/>`;

const weekdaysCode = `const [days, setDays] = useState<CanopWeekday[]>([1, 3, 5]);

<WeekdayPicker label="Jours de sauvegarde" value={days} onChange={setDays} />`;

function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function PickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <Stack gap="md">
      <DatePicker
        label="Date de maintenance"
        value={date}
        onChange={setDate}
        min={today()}
        clearable
      />
    </Stack>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(today);
  return <Calendar value={date} onChange={setDate} ariaLabel="Date de la sauvegarde" />;
}

function RangeDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const now = today();
  return (
    <Calendar
      value={date}
      onChange={setDate}
      min={new Date(now.getFullYear(), now.getMonth(), 1)}
      max={new Date(now.getFullYear(), now.getMonth() + 2, 0)}
      isDateDisabled={(day) => day.getDay() === 0}
    />
  );
}

function WeekdaysDemo() {
  const [days, setDays] = useState<CanopWeekday[]>([1, 3, 5]);
  return <WeekdayPicker label="Jours de sauvegarde" value={days} onChange={setDays} />;
}

const fr = {
  intro:
    "Sélection d'une date dans un calendrier mensuel, lundi en premier, aujourd'hui marqué d'un point. Le champ s'ouvre au clic, à Entrée, Espace ou flèche bas ; dans la grille, les flèches parcourent les jours, Page haut et Page bas les mois (avec Maj, les années), Début et Fin la semaine. Le mois glisse dans le sens de la navigation et la date choisie éclot d'un ressort, le tout coupé en mouvement réduit. Pour une récurrence hebdomadaire, WeekdayPicker sélectionne des jours de la semaine.",
  sections: {
    picker: "Champ DatePicker",
    calendar: "Calendar seul",
    range: "Dates min, max et jours exclus",
    weekdays: "Jours récurrents : WeekdayPicker",
    api: "API DatePicker",
    calendarApi: "API Calendar",
    weekdaysApi: "API WeekdayPicker",
  },
  demos: {
    pickerTitle: "value, onChange, min, clearable",
    pickerDescription:
      "Champ en lecture seule au label flottant : la saisie se fait dans le calendrier, qui s'ouvre sous le champ et rend le focus au champ à la fermeture. clearable ajoute un bouton d'effacement, Retour arrière et Suppr effacent aussi.",
    calendarTitle: "Calendrier contrôlé",
    calendarDescription:
      "Le calendrier seul, à poser dans une carte ou un panneau. La date du jour porte un point, la date choisie une pastille primary.",
    rangeTitle: "min, max, isDateDisabled",
    rangeDescription:
      "Les jours hors bornes ou exclus restent atteignables au clavier, annoncés comme indisponibles, mais ne se sélectionnent pas. Ici, les dimanches sont exclus.",
    weekdaysTitle: "Sélection de jours de la semaine",
    weekdaysDescription:
      "Valeur triée en jours ISO (1 = lundi, 7 = dimanche), pratique pour une planification hebdomadaire.",
  },
  props: {
    label: "Libellé flottant du champ.",
    value: "Date sélectionnée, ou null.",
    onChange: "Appelé avec la date choisie (null à l'effacement pour DatePicker).",
    min: "Premier jour sélectionnable.",
    max: "Dernier jour sélectionnable.",
    isDateDisabled: "Exclut des jours précis (week-ends, jours fériés…).",
    placeholder: "Texte d'attente affiché quand le champ a le focus sans valeur.",
    helperText: "Aide affichée sous le champ.",
    error: "Message d'erreur ; passe le champ en erreur.",
    required: "Champ obligatoire.",
    disabled: "Désactive le champ.",
    clearable: "Affiche un bouton pour effacer la date.",
    fullWidth: "Occupe toute la largeur disponible.",
    size: "Hauteur du champ.",
    name: "Nom du champ dans un formulaire.",
    ariaLabel: "Nom accessible du calendrier.",
    autoFocus: "Place le focus sur le jour actif au montage.",
    animated: "Glissement des mois et ressort de la sélection (coupés en mouvement réduit).",
    weekdaysValue: "Jours sélectionnés, en jours ISO (1 = lundi).",
    weekdaysOnChange: "Appelé avec la nouvelle liste triée.",
    weekdaysLabel: "Libellé visible au-dessus des jours.",
    weekdaysAriaLabel: "Nom accessible du groupe sans libellé visible.",
    weekdaysDisabled: "Désactive tous les jours.",
  },
};

const en: typeof fr = {
  intro:
    "Pick a date in a monthly calendar, Monday first, today marked with a dot. The field opens on click, Enter, Space or Down Arrow; in the grid, arrows move by day, Page Up and Page Down by month (with Shift, by year), Home and End to the week bounds. The month slides in the direction of travel and the chosen date pops in on a spring, all cut under reduced motion. For a weekly recurrence, WeekdayPicker selects days of the week.",
  sections: {
    picker: "DatePicker field",
    calendar: "Standalone Calendar",
    range: "Min, max and excluded days",
    weekdays: "Recurring days: WeekdayPicker",
    api: "DatePicker API",
    calendarApi: "Calendar API",
    weekdaysApi: "WeekdayPicker API",
  },
  demos: {
    pickerTitle: "value, onChange, min, clearable",
    pickerDescription:
      "Read-only field with a floating label: the date is picked in the calendar, which opens below the field and gives focus back to it on close. clearable adds a clear button; Backspace and Delete clear too.",
    calendarTitle: "Controlled calendar",
    calendarDescription:
      "The calendar alone, to place in a card or a panel. Today carries a dot, the chosen date a primary pill.",
    rangeTitle: "min, max, isDateDisabled",
    rangeDescription:
      "Out-of-range or excluded days stay reachable from the keyboard and are announced as unavailable, but cannot be selected. Sundays are excluded here.",
    weekdaysTitle: "Weekday selection",
    weekdaysDescription:
      "Sorted value in ISO weekdays (1 = Monday, 7 = Sunday), handy for a weekly schedule.",
  },
  props: {
    label: "Floating label of the field.",
    value: "Selected date, or null.",
    onChange: "Called with the chosen date (null on clear for DatePicker).",
    min: "First selectable day.",
    max: "Last selectable day.",
    isDateDisabled: "Excludes specific days (weekends, holidays…).",
    placeholder: "Placeholder shown when the empty field has focus.",
    helperText: "Help text below the field.",
    error: "Error message; puts the field in error.",
    required: "Required field.",
    disabled: "Disables the field.",
    clearable: "Shows a button to clear the date.",
    fullWidth: "Takes the full available width.",
    size: "Field height.",
    name: "Field name in a form.",
    ariaLabel: "Accessible name of the calendar.",
    autoFocus: "Focuses the active day on mount.",
    animated: "Month slide and selection spring (cut under reduced motion).",
    weekdaysValue: "Selected days, as ISO weekdays (1 = Monday).",
    weekdaysOnChange: "Called with the new sorted list.",
    weekdaysLabel: "Visible label above the days.",
    weekdaysAriaLabel: "Accessible name of the group without a visible label.",
    weekdaysDisabled: "Disables every day.",
  },
};

const texts = { fr, en };

export default function DatePickerDoc() {
  const t = texts[useDocLocale()];

  const pickerRows: PropRow[] = [
    { name: "label", type: "string", required: true, description: t.props.label },
    { name: "value", type: "Date | null", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(date: Date | null) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "min", type: "Date", description: t.props.min },
    { name: "max", type: "Date", description: t.props.max },
    {
      name: "isDateDisabled",
      type: "(date: Date) => boolean",
      description: t.props.isDateDisabled,
    },
    { name: "placeholder", type: "string", description: t.props.placeholder },
    { name: "helperText", type: "string", description: t.props.helperText },
    { name: "error", type: "string | null", description: t.props.error },
    { name: "required", type: "boolean", defaultValue: "false", description: t.props.required },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "clearable", type: "boolean", defaultValue: "false", description: t.props.clearable },
    { name: "fullWidth", type: "boolean", defaultValue: "true", description: t.props.fullWidth },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    { name: "name", type: "string", description: t.props.name },
  ];

  const calendarRows: PropRow[] = [
    { name: "value", type: "Date | null", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(date: Date) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "min", type: "Date", description: t.props.min },
    { name: "max", type: "Date", description: t.props.max },
    {
      name: "isDateDisabled",
      type: "(date: Date) => boolean",
      description: t.props.isDateDisabled,
    },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "autoFocus", type: "boolean", defaultValue: "false", description: t.props.autoFocus },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
  ];

  const weekdaysRows: PropRow[] = [
    { name: "value", type: "CanopWeekday[]", required: true, description: t.props.weekdaysValue },
    {
      name: "onChange",
      type: "(value: CanopWeekday[]) => void",
      required: true,
      description: t.props.weekdaysOnChange,
    },
    { name: "label", type: "string", description: t.props.weekdaysLabel },
    { name: "ariaLabel", type: "string", description: t.props.weekdaysAriaLabel },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.weekdaysDisabled,
    },
  ];

  return (
    <DocPage title="DatePicker" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.picker}>
        <DemoCard
          title={t.demos.pickerTitle}
          description={t.demos.pickerDescription}
          code={pickerCode}
        >
          <PickerDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.calendar}>
        <DemoCard
          title={t.demos.calendarTitle}
          description={t.demos.calendarDescription}
          code={calendarCode}
        >
          <CalendarDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.range}>
        <DemoCard
          title={t.demos.rangeTitle}
          description={t.demos.rangeDescription}
          code={rangeCode}
        >
          <RangeDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.weekdays}>
        <DemoCard
          title={t.demos.weekdaysTitle}
          description={t.demos.weekdaysDescription}
          code={weekdaysCode}
        >
          <WeekdaysDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={pickerRows} />
      </DocSection>
      <DocSection title={t.sections.calendarApi}>
        <PropsTable rows={calendarRows} />
      </DocSection>
      <DocSection title={t.sections.weekdaysApi}>
        <PropsTable rows={weekdaysRows} />
      </DocSection>
    </DocPage>
  );
}
