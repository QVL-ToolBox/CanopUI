import { useState } from "react";
import {
  SegmentedControl,
  type CanopSegmentedControlIconOption,
  type CanopSegmentedControlOption,
} from "@canop/ui";
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

const iconOnlyCode = `import { SegmentedControl, type CanopSegmentedControlIconOption } from "@canop/ui";

const options: CanopSegmentedControlIconOption[] = [
  { value: "grid", label: "Vue grille", icon: "apps" },
  { value: "list", label: "Vue liste", icon: "menu" },
];

<SegmentedControl
  iconOnly
  options={options}
  value={view}
  onChange={setView}
  ariaLabel="Affichage"
/>`;

const badgeCode = `const options = [
  { value: "inbox", label: "Reçus", badge: 12 },
  { value: "drafts", label: "Brouillons", badge: 3, badgeColor: "secondary" },
  { value: "sent", label: "Envoyés", badge: "Nouveau", badgeColor: "accent" },
];

<SegmentedControl options={options} value={box} onChange={setBox} ariaLabel="Boîte" />

const views = [
  { value: "grid", label: "Vue grille", icon: "apps" },
  { value: "list", label: "Vue liste", icon: "menu", badge: 128, badgeColor: "error" },
];

<SegmentedControl iconOnly options={views} value={view} onChange={setView} ariaLabel="Affichage" />`;

const badgeOptions: CanopSegmentedControlOption[] = [
  { value: "inbox", label: "Reçus", badge: 12 },
  { value: "drafts", label: "Brouillons", badge: 3, badgeColor: "secondary" },
  { value: "sent", label: "Envoyés", badge: "Nouveau", badgeColor: "accent" },
];

const badgeIconOptions: CanopSegmentedControlIconOption[] = [
  { value: "grid", label: "Vue grille", icon: "apps" },
  { value: "list", label: "Vue liste", icon: "menu", badge: 128, badgeColor: "error" },
];

const viewOptions: CanopSegmentedControlOption[] = [
  { value: "grid", label: "Grille", icon: "apps" },
  { value: "list", label: "Liste", icon: "menu" },
];

const iconOnlyOptions: CanopSegmentedControlIconOption[] = [
  { value: "grid", label: "Vue grille", icon: "apps" },
  { value: "list", label: "Vue liste", icon: "menu" },
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

function IconOnlyDemo() {
  const [view, setView] = useState("grid");
  return (
    <>
      <SegmentedControl
        iconOnly
        size="small"
        options={iconOnlyOptions}
        value={view}
        onChange={setView}
        ariaLabel="Affichage (petit)"
      />
      <SegmentedControl
        iconOnly
        options={iconOnlyOptions}
        value={view}
        onChange={setView}
        ariaLabel="Affichage (moyen)"
      />
    </>
  );
}

function BadgeDemo() {
  const [box, setBox] = useState("inbox");
  const [view, setView] = useState("grid");
  return (
    <>
      <SegmentedControl options={badgeOptions} value={box} onChange={setBox} ariaLabel="Boîte" />
      <SegmentedControl
        iconOnly
        options={badgeIconOptions}
        value={view}
        onChange={setView}
        ariaLabel="Affichage avec compteur"
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
    iconOnly: "Icônes seules",
    badges: "Badges",
    fullWidth: "Pleine largeur",
    api: "API",
    optionApi: "Champs d'une option",
  },
  demos: {
    basicTitle: "Contrôlé avec icônes",
    basicDescription:
      "Le composant est contrôlé : passez value et mettez à jour l'état dans onChange. Chaque option peut porter une icône.",
    sizesTitle: "small et medium",
    sizesDescription:
      "Deux tailles pour s'adapter à la densité de l'interface. Une option peut être désactivée.",
    iconOnlyTitle: "iconOnly",
    iconOnlyDescription:
      "Segments carrés à icône seule dans un conteneur en pilule, comme la bascule d'affichage de la Toolbar. Chaque option doit porter une icône ; son label reste le nom accessible du segment. L'icône active passe en variante pleine.",
    badgesTitle: "badge sur une option",
    badgesDescription:
      "Chaque option accepte un badge : un nombre, rendu par Badge (masqué à 0, 99+ au-delà de 99), ou un court texte. Il éclot sur un ressort quand sa valeur change et reste lisible que l'option soit choisie ou non. Le badge entre dans le nom accessible de l'option, par exemple « Reçus (12) » ; pour un badge qui n'est pas du texte, badgeLabel donne ce qui est lu. badgeColor choisit la couleur de palette, primary par défaut.",
    fullWidthTitle: "fullWidth",
    fullWidthDescription:
      "Étire le sélecteur sur toute la largeur, chaque segment occupant une part égale.",
  },
  optionProps: {
    value: "Valeur de l'option, transmise à onChange.",
    label: "Libellé visible, ou nom accessible en iconOnly.",
    icon: "Icône du registre, obligatoire en iconOnly.",
    disabled: "Désactive l'option, sautée par la navigation clavier.",
    badge: "Compteur (number) ou court contenu (ReactNode) affiché après le libellé.",
    badgeLabel:
      "Texte lu par les lecteurs d'écran pour le badge ; déduit d'un nombre ou d'un texte.",
    badgeColor: "Couleur de palette du badge.",
  },
  props: {
    options:
      "Liste des options ; chacune porte value, label, et en option une icône, un état désactivé et un badge.",
    value: "Valeur actuellement sélectionnée.",
    onChange: "Handler appelé avec la nouvelle valeur au changement de segment.",
    ariaLabel: "Libellé accessible du groupe (attribut aria-label du radiogroup).",
    size: "Taille du sélecteur.",
    fullWidth: "Étire le sélecteur sur toute la largeur disponible.",
    iconOnly:
      "Affiche des segments à icône seule (icon obligatoire sur chaque option, label utilisé comme aria-label).",
  },
};

const en: typeof fr = {
  intro:
    "A segmented control to pick one option among a small, mutually exclusive set. A sliding indicator animates the transition between segments and keyboard navigation (arrows, Home/End) is built in.",
  sections: {
    basic: "Usage",
    sizes: "Sizes",
    iconOnly: "Icons only",
    badges: "Badges",
    fullWidth: "Full width",
    api: "API",
    optionApi: "Option fields",
  },
  demos: {
    basicTitle: "Controlled with icons",
    basicDescription:
      "The component is controlled: pass value and update state in onChange. Each option can carry an icon.",
    sizesTitle: "small and medium",
    sizesDescription: "Two sizes to match the density of the interface. An option can be disabled.",
    iconOnlyTitle: "iconOnly",
    iconOnlyDescription:
      "Square icon-only segments in a pill container, like the Toolbar view toggle. Every option must carry an icon; its label remains the accessible name of the segment. The active icon switches to its solid variant.",
    badgesTitle: "badge on an option",
    badgesDescription:
      "Each option accepts a badge: a number, rendered by Badge (hidden at 0, 99+ above 99), or a short text. It pops in on a spring when its value changes and stays readable whether the option is selected or not. The badge is part of the option's accessible name, for example “Inbox (12)”; for a badge that is not text, badgeLabel gives what is read. badgeColor picks the palette colour, primary by default.",
    fullWidthTitle: "fullWidth",
    fullWidthDescription:
      "Stretches the control to the full width, each segment taking an equal share.",
  },
  optionProps: {
    value: "Option value, passed to onChange.",
    label: "Visible label, or accessible name with iconOnly.",
    icon: "Registry icon, required with iconOnly.",
    disabled: "Disables the option, skipped by keyboard navigation.",
    badge: "Counter (number) or short content (ReactNode) shown after the label.",
    badgeLabel: "Text read by screen readers for the badge; inferred from a number or a text.",
    badgeColor: "Palette colour of the badge.",
  },
  props: {
    options:
      "List of options; each carries value, label, and optionally an icon, a disabled state and a badge.",
    value: "Currently selected value.",
    onChange: "Handler called with the new value when the segment changes.",
    ariaLabel: "Accessible label of the group (radiogroup aria-label attribute).",
    size: "Size of the control.",
    fullWidth: "Stretches the control to the full available width.",
    iconOnly:
      "Renders icon-only segments (icon required on every option, label used as aria-label).",
  },
};

const texts = { fr, en };

export default function SegmentedControlDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "options",
      type: "CanopSegmentedControlOption<T>[] | CanopSegmentedControlIconOption<T>[]",
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
    { name: "iconOnly", type: "boolean", defaultValue: "false", description: t.props.iconOnly },
  ];

  const optionRows: PropRow[] = [
    { name: "value", type: "T", required: true, description: t.optionProps.value },
    { name: "label", type: "string", required: true, description: t.optionProps.label },
    { name: "icon", type: "CanopIconName", description: t.optionProps.icon },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.optionProps.disabled,
    },
    { name: "badge", type: "number | ReactNode", description: t.optionProps.badge },
    { name: "badgeLabel", type: "string", description: t.optionProps.badgeLabel },
    {
      name: "badgeColor",
      type: "CanopBadgeColor",
      defaultValue: '"primary"',
      description: t.optionProps.badgeColor,
    },
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
      <DocSection title={t.sections.iconOnly}>
        <DemoCard
          title={t.demos.iconOnlyTitle}
          description={t.demos.iconOnlyDescription}
          code={iconOnlyCode}
          align="start"
        >
          <IconOnlyDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.badges}>
        <DemoCard
          title={t.demos.badgesTitle}
          description={t.demos.badgesDescription}
          code={badgeCode}
          align="start"
        >
          <BadgeDemo />
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
      <DocSection title={t.sections.optionApi}>
        <PropsTable rows={optionRows} />
      </DocSection>
    </DocPage>
  );
}
