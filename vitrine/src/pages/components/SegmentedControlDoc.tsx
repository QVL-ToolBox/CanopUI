import { useState } from "react";
import { SegmentedControl, type CanopSegmentedControlOption } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SegmentedControl } from "@canop/ui";`;

const basicCode = `const options = [
  { value: "grid", label: "Grille", icon: "apps" },
  { value: "list", label: "Liste", icon: "menu" },
];

function ViewSwitch() {
  const [view, setView] = useState("grid");
  return (
    <SegmentedControl
      options={options}
      value={view}
      onChange={setView}
      ariaLabel="Mode d'affichage"
    />
  );
}`;

const sizesCode = `<SegmentedControl size="small" options={options} value={value} onChange={setValue} ariaLabel="Période" />
<SegmentedControl size="medium" options={options} value={value} onChange={setValue} ariaLabel="Période" />`;

const fullWidthCode = `<SegmentedControl
  fullWidth
  options={options}
  value={value}
  onChange={setValue}
  ariaLabel="Filtre"
/>`;

const viewOptions: CanopSegmentedControlOption[] = [
  { value: "grid", label: "Grille", icon: "apps" },
  { value: "list", label: "Liste", icon: "menu" },
];

const periodOptions: CanopSegmentedControlOption[] = [
  { value: "day", label: "Jour" },
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois", disabled: true },
];

const filterOptions: CanopSegmentedControlOption[] = [
  { value: "all", label: "Tous" },
  { value: "active", label: "Actifs" },
  { value: "archived", label: "Archivés" },
];

function ViewSwitchDemo() {
  const [view, setView] = useState("grid");
  return (
    <SegmentedControl
      options={viewOptions}
      value={view}
      onChange={setView}
      ariaLabel="Mode d'affichage"
    />
  );
}

function SizesDemo() {
  const [value, setValue] = useState("week");
  return (
    <>
      <SegmentedControl
        size="small"
        options={periodOptions}
        value={value}
        onChange={setValue}
        ariaLabel="Période (petit)"
      />
      <SegmentedControl
        size="medium"
        options={periodOptions}
        value={value}
        onChange={setValue}
        ariaLabel="Période (moyen)"
      />
    </>
  );
}

function FullWidthDemo() {
  const [value, setValue] = useState("all");
  return (
    <SegmentedControl
      fullWidth
      options={filterOptions}
      value={value}
      onChange={setValue}
      ariaLabel="Filtre"
    />
  );
}

const fr = {
  intro:
    "Sélecteur segmenté pour choisir une option parmi un petit ensemble mutuellement exclusif. Un indicateur coulissant anime la transition entre segments et la navigation clavier (flèches, Début/Fin) est intégrée.",
  sections: {
    basic: "Utilisation",
    sizes: "Tailles",
    fullWidth: "Pleine largeur",
    api: "API",
  },
  demos: {
    basicTitle: "Contrôlé avec icônes",
    basicDescription:
      "Le composant est contrôlé : passez value et mettez à jour l'état dans onChange. Chaque option peut porter une icône.",
    sizesTitle: "small et medium",
    sizesDescription:
      "Deux tailles pour s'adapter à la densité de l'interface. Une option peut être désactivée.",
    fullWidthTitle: "fullWidth",
    fullWidthDescription:
      "Étire le sélecteur sur toute la largeur, chaque segment occupant une part égale.",
  },
  props: {
    options:
      "Liste des options ; chacune porte value, label, une icône et un état désactivé optionnels.",
    value: "Valeur actuellement sélectionnée.",
    onChange: "Handler appelé avec la nouvelle valeur au changement de segment.",
    ariaLabel: "Libellé accessible du groupe (attribut aria-label du radiogroup).",
    size: "Taille du sélecteur.",
    fullWidth: "Étire le sélecteur sur toute la largeur disponible.",
  },
};

const en: typeof fr = {
  intro:
    "A segmented control to pick one option among a small, mutually exclusive set. A sliding indicator animates the transition between segments and keyboard navigation (arrows, Home/End) is built in.",
  sections: {
    basic: "Usage",
    sizes: "Sizes",
    fullWidth: "Full width",
    api: "API",
  },
  demos: {
    basicTitle: "Controlled with icons",
    basicDescription:
      "The component is controlled: pass value and update state in onChange. Each option can carry an icon.",
    sizesTitle: "small and medium",
    sizesDescription: "Two sizes to match the density of the interface. An option can be disabled.",
    fullWidthTitle: "fullWidth",
    fullWidthDescription:
      "Stretches the control to the full width, each segment taking an equal share.",
  },
  props: {
    options: "List of options; each carries value, label, an optional icon and disabled state.",
    value: "Currently selected value.",
    onChange: "Handler called with the new value when the segment changes.",
    ariaLabel: "Accessible label of the group (radiogroup aria-label attribute).",
    size: "Size of the control.",
    fullWidth: "Stretches the control to the full available width.",
  },
};

const texts = { fr, en };

export default function SegmentedControlDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "options",
      type: "CanopSegmentedControlOption<T>[]",
      required: true,
      description: t.props.options,
    },
    { name: "value", type: "T", required: true, description: t.props.value },
    { name: "onChange", type: "(value: T) => void", required: true, description: t.props.onChange },
    { name: "ariaLabel", type: "string", required: true, description: t.props.ariaLabel },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    { name: "fullWidth", type: "boolean", defaultValue: "false", description: t.props.fullWidth },
  ];

  return (
    <DocPage title="SegmentedControl" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <ViewSwitchDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard
          title={t.demos.sizesTitle}
          description={t.demos.sizesDescription}
          code={sizesCode}
          align="start"
        >
          <SizesDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fullWidth}>
        <DemoCard
          title={t.demos.fullWidthTitle}
          description={t.demos.fullWidthDescription}
          code={fullWidthCode}
          align="stretch"
        >
          <FullWidthDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
