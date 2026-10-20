import { useState } from "react";
import { Icon, Select, type CanopSelectOption } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Select } from "@canop/ui";`;

const baseCode = `const options = [
  { value: "admin", label: "Administrateur" },
  { value: "editor", label: "Éditeur" },
  { value: "viewer", label: "Lecteur" },
];

function SelectDemo() {
  const [value, setValue] = useState("admin");
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      label="Rôle"
      placeholder="Choisir un rôle"
    />
  );
}`;

const options: CanopSelectOption[] = [
  { value: "admin", label: "Administrateur" },
  { value: "editor", label: "Éditeur" },
  { value: "viewer", label: "Lecteur" },
];

function SelectDemo() {
  const [value, setValue] = useState("admin");
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      label="Rôle"
      placeholder="Choisir un rôle"
    />
  );
}

const iconCode = `const options = [
  { value: "admin", label: "Administrateur", icon: <Icon name="shield" size="xs" /> },
  { value: "editor", label: "Éditeur", icon: <Icon name="pencil" size="xs" /> },
  { value: "viewer", label: "Lecteur", icon: <Icon name="eye" size="xs" /> },
];

function IconSelectDemo() {
  const [value, setValue] = useState("editor");
  return <Select options={options} value={value} onChange={setValue} label="Rôle" />;
}`;

const iconOptions: CanopSelectOption[] = [
  { value: "admin", label: "Administrateur", icon: <Icon name="shield" size="xs" /> },
  { value: "editor", label: "Éditeur", icon: <Icon name="pencil" size="xs" /> },
  { value: "viewer", label: "Lecteur", icon: <Icon name="eye" size="xs" /> },
];

function IconSelectDemo() {
  const [value, setValue] = useState("editor");
  return <Select options={iconOptions} value={value} onChange={setValue} label="Rôle" />;
}

const ariaLabelCode = `function CompactSelectDemo() {
  const [value, setValue] = useState("");
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      ariaLabel="Rôle du compte"
      placeholder="Choisir un rôle"
    />
  );
}`;

function CompactSelectDemo() {
  const [value, setValue] = useState("");
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      ariaLabel="Rôle du compte"
      placeholder="Choisir un rôle"
    />
  );
}

const fr = {
  intro:
    "Le sélecteur mono-valeur de CanopUI. Pendant de MultiSelect quand une seule option peut être retenue : le libellé visible nomme le champ pour les lecteurs d'écran, et chaque option peut porter une icône.",
  sections: {
    base: {
      title: "Sélection simple",
      demoTitle: "Libellé et placeholder",
      demoDescription:
        "Le libellé s'affiche au-dessus du champ et devient son nom accessible ; le placeholder guide tant qu'aucune valeur n'est choisie.",
    },
    icons: {
      title: "Options illustrées",
      demoTitle: "Icône par option",
      demoDescription:
        "L'icône de l'option est rendue dans la liste déroulante comme sur la valeur sélectionnée.",
    },
    ariaLabel: {
      title: "Sans libellé visible",
      demoTitle: "Nom accessible explicite",
      demoDescription:
        "Dans une barre d'outils compacte, ariaLabel nomme le champ à la place du libellé visible.",
    },
    api: { title: "API" },
    option: {
      title: "CanopSelectOption",
      description: "Forme de chaque entrée du tableau options.",
    },
  },
  props: {
    options: "Liste des options disponibles ; chaque option a un value et un label facultatif.",
    value: "Valeur sélectionnée, retenue parmi les value des options.",
    onChange: "Appelé avec la nouvelle valeur à chaque changement de sélection.",
    label: "Libellé visible au-dessus du champ, et nom accessible par défaut.",
    ariaLabel: "Nom accessible explicite, pour un champ sans libellé visible. Prime sur label.",
    placeholder: "Texte indicatif affiché tant qu'aucune valeur n'est sélectionnée.",
    optionValue: "Identifiant unique de l'option, stocké dans value.",
    optionLabel: "Libellé affiché ; à défaut, value est utilisé.",
    optionIcon: "Icône ou pastille affichée avant le libellé, dans la liste et sur la valeur.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI single-value selector. Counterpart of MultiSelect when only one option can be picked: the visible label names the field for screen readers, and each option may carry an icon.",
  sections: {
    base: {
      title: "Single selection",
      demoTitle: "Label and placeholder",
      demoDescription:
        "The label sits above the field and becomes its accessible name; the placeholder guides the user until a value is picked.",
    },
    icons: {
      title: "Illustrated options",
      demoTitle: "Icon per option",
      demoDescription:
        "The option icon is rendered in the dropdown as well as on the selected value.",
    },
    ariaLabel: {
      title: "Without a visible label",
      demoTitle: "Explicit accessible name",
      demoDescription:
        "In a compact toolbar, ariaLabel names the field instead of a visible label above it.",
    },
    api: { title: "API" },
    option: {
      title: "CanopSelectOption",
      description: "Shape of each entry in the options array.",
    },
  },
  props: {
    options: "List of available options; each option has a value and an optional label.",
    value: "Selected value, picked among the option values.",
    onChange: "Called with the new value on every selection change.",
    label: "Visible label above the field, and default accessible name.",
    ariaLabel: "Explicit accessible name, for a field without a visible label. Wins over label.",
    placeholder: "Placeholder text displayed until a value is selected.",
    optionValue: "Unique identifier of the option, stored in value.",
    optionLabel: "Displayed label; falls back to value when omitted.",
    optionIcon: "Icon or dot displayed before the label, in the list and on the selected value.",
  },
};

const texts = { fr, en };

export default function SelectDoc() {
  const t = texts[useDocLocale()];
  const rows: PropRow[] = [
    {
      name: "options",
      type: "CanopSelectOption[]",
      required: true,
      description: t.props.options,
    },
    {
      name: "value",
      type: "string",
      required: true,
      description: t.props.value,
    },
    {
      name: "onChange",
      type: "(value: string) => void",
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
    <DocPage title="Select" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.base.title}>
        <DemoCard
          title={t.sections.base.demoTitle}
          description={t.sections.base.demoDescription}
          code={baseCode}
          align="stretch"
        >
          <SelectDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.icons.title}>
        <DemoCard
          title={t.sections.icons.demoTitle}
          description={t.sections.icons.demoDescription}
          code={iconCode}
          align="stretch"
        >
          <IconSelectDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.ariaLabel.title}>
        <DemoCard
          title={t.sections.ariaLabel.demoTitle}
          description={t.sections.ariaLabel.demoDescription}
          code={ariaLabelCode}
          align="stretch"
        >
          <CompactSelectDemo />
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
