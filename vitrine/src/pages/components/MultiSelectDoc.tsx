import { useState } from "react";
import { Icon, MultiSelect, type CanopMultiSelectOption } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { MultiSelect } from "@canop/ui";`;

const baseCode = `const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

function MultiSelectDemo() {
  const [value, setValue] = useState<string[]>(["react"]);
  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={setValue}
      label="Technologies"
      placeholder="Ajouter une technologie"
    />
  );
}`;

const options: CanopMultiSelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

function MultiSelectDemo() {
  const [value, setValue] = useState<string[]>(["react"]);
  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={setValue}
      label="Technologies"
      placeholder="Ajouter une technologie"
    />
  );
}

const emptyCode = `const options = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
];

function EmptyMultiSelectDemo() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Choisir une langue"
    />
  );
}`;

const languageOptions: CanopMultiSelectOption[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
];

function EmptyMultiSelectDemo() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      options={languageOptions}
      value={value}
      onChange={setValue}
      placeholder="Choisir une langue"
    />
  );
}

const iconCode = `const options = [
  { value: "admin", label: "Administrateur", icon: <Icon name="shield" size="xs" /> },
  { value: "editor", label: "Éditeur", icon: <Icon name="pencil" size="xs" /> },
  { value: "viewer", label: "Lecteur", icon: <Icon name="eye" size="xs" /> },
];

function IconMultiSelectDemo() {
  const [value, setValue] = useState<string[]>(["admin"]);
  return (
    <MultiSelect options={options} value={value} onChange={setValue} label="Rôles" />
  );
}`;

const roleOptions: CanopMultiSelectOption[] = [
  { value: "admin", label: "Administrateur", icon: <Icon name="shield" size="xs" /> },
  { value: "editor", label: "Éditeur", icon: <Icon name="pencil" size="xs" /> },
  { value: "viewer", label: "Lecteur", icon: <Icon name="eye" size="xs" /> },
];

function IconMultiSelectDemo() {
  const [value, setValue] = useState<string[]>(["admin"]);
  return <MultiSelect options={roleOptions} value={value} onChange={setValue} label="Rôles" />;
}

const fr = {
  intro:
    "Le sélecteur à choix multiples de CanopUI. Les valeurs retenues s'affichent en puces supprimables et disparaissent de la liste déroulante une fois sélectionnées.",
  sections: {
    multiple: {
      title: "Sélection multiple",
      demoTitle: "Puces et liste déroulante",
      demoDescription:
        "Chaque valeur sélectionnée devient une puce ; la liste ne propose que les options restantes.",
    },
    empty: {
      title: "Sans sélection initiale",
      demoTitle: "Démarrage vide",
      demoDescription: "Sans label, seul le placeholder guide l'utilisateur.",
    },
    icons: {
      title: "Options illustrées",
      demoTitle: "Icône par option",
      demoDescription:
        "L'icône de l'option est rendue dans la liste déroulante comme sur la puce sélectionnée.",
    },
    api: { title: "API" },
    option: {
      title: "CanopMultiSelectOption",
      description: "Forme de chaque entrée du tableau options, comme pour CanopSelectOption.",
    },
  },
  props: {
    options: "Liste des options disponibles ; chaque option a un value et un label facultatif.",
    value: "Valeurs sélectionnées, affichées sous forme de puces supprimables.",
    onChange: "Appelé avec la nouvelle sélection lors d'un ajout ou d'un retrait.",
    label: "Libellé visible au-dessus du champ, et nom accessible par défaut.",
    ariaLabel: "Nom accessible explicite, pour un champ sans libellé visible. Prime sur label.",
    placeholder: "Texte indicatif affiché dans le sélecteur.",
    optionValue: "Identifiant unique de l'option, stocké dans value.",
    optionLabel: "Libellé affiché ; à défaut, value est utilisé.",
    optionIcon: "Icône ou pastille affichée avant le libellé, dans la liste et sur la puce.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI multiple-choice selector. Selected values appear as removable chips and disappear from the dropdown once picked.",
  sections: {
    multiple: {
      title: "Multiple selection",
      demoTitle: "Chips and dropdown",
      demoDescription:
        "Each selected value becomes a chip; the dropdown only offers the remaining options.",
    },
    empty: {
      title: "No initial selection",
      demoTitle: "Empty start",
      demoDescription: "Without a label, only the placeholder guides the user.",
    },
    icons: {
      title: "Illustrated options",
      demoTitle: "Icon per option",
      demoDescription: "The option icon is rendered in the dropdown as well as on its chip.",
    },
    api: { title: "API" },
    option: {
      title: "CanopMultiSelectOption",
      description: "Shape of each entry in the options array, same as CanopSelectOption.",
    },
  },
  props: {
    options: "List of available options; each option has a value and an optional label.",
    value: "Selected values, displayed as removable chips.",
    onChange: "Called with the new selection when an option is added or removed.",
    label: "Visible label above the field, and default accessible name.",
    ariaLabel: "Explicit accessible name, for a field without a visible label. Wins over label.",
    placeholder: "Placeholder text displayed in the selector.",
    optionValue: "Unique identifier of the option, stored in value.",
    optionLabel: "Displayed label; falls back to value when omitted.",
    optionIcon: "Icon or dot displayed before the label, in the list and on the chip.",
  },
};

const texts = { fr, en };

export default function MultiSelectDoc() {
  const t = texts[useDocLocale()];
  const rows: PropRow[] = [
    {
      name: "options",
      type: "CanopMultiSelectOption[]",
      required: true,
      description: t.props.options,
    },
    {
      name: "value",
      type: "string[]",
      required: true,
      description: t.props.value,
    },
    {
      name: "onChange",
      type: "(value: string[]) => void",
      required: true,
      description: t.props.onChange,
    },
    {
      name: "label",
      type: "string",
      description: t.props.label,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.props.ariaLabel,
    },
    {
      name: "placeholder",
      type: "string",
      description: t.props.placeholder,
    },
  ];
  const optionRows: PropRow[] = [
    {
      name: "value",
      type: "string",
      required: true,
      description: t.props.optionValue,
    },
    {
      name: "label",
      type: "string",
      description: t.props.optionLabel,
    },
    {
      name: "icon",
      type: "ReactNode",
      description: t.props.optionIcon,
    },
  ];
  return (
    <DocPage title="MultiSelect" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.multiple.title}>
        <DemoCard
          title={t.sections.multiple.demoTitle}
          description={t.sections.multiple.demoDescription}
          code={baseCode}
          align="stretch"
        >
          <MultiSelectDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.empty.title}>
        <DemoCard
          title={t.sections.empty.demoTitle}
          description={t.sections.empty.demoDescription}
          code={emptyCode}
          align="stretch"
        >
          <EmptyMultiSelectDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.icons.title}>
        <DemoCard
          title={t.sections.icons.demoTitle}
          description={t.sections.icons.demoDescription}
          code={iconCode}
          align="stretch"
        >
          <IconMultiSelectDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api.title}>
        <PropsTable rows={rows} />
      </DocSection>
      <DocSection title={t.sections.option.title} description={t.sections.option.description}>
        <PropsTable rows={optionRows} />
      </DocSection>
    </DocPage>
  );
}
