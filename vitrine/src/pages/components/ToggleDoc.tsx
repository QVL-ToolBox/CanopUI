import { useState } from "react";
import { Toggle } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Toggle } from "@canop/ui";`;

const baseCode = `function ToggleDemo() {
  const [checked, setChecked] = useState(false);
  return <Toggle checked={checked} onChange={setChecked} ariaLabel="Mode sombre" />;
}`;

function ToggleDemo() {
  const [checked, setChecked] = useState(false);
  return <Toggle checked={checked} onChange={setChecked} ariaLabel="Mode sombre" />;
}

const labelCode = `function LabelToggleDemo() {
  const [checked, setChecked] = useState(true);
  return <Toggle checked={checked} onChange={setChecked} label="Notifications" />;
}`;

function LabelToggleDemo() {
  const [checked, setChecked] = useState(true);
  return <Toggle checked={checked} onChange={setChecked} label="Notifications" />;
}

const colorsCode = `function ColorsDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Toggle checked={checked} onChange={setChecked} color="accent" ariaLabel="Accent" />
      <Toggle checked={checked} onChange={setChecked} color="primary" ariaLabel="Primaire" />
      <Toggle checked={checked} onChange={setChecked} color="secondary" ariaLabel="Secondaire" />
      <Toggle checked={checked} onChange={setChecked} color="success" ariaLabel="Succès" />
    </>
  );
}`;

function ColorsDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Toggle checked={checked} onChange={setChecked} color="accent" ariaLabel="Accent" />
      <Toggle checked={checked} onChange={setChecked} color="primary" ariaLabel="Primaire" />
      <Toggle checked={checked} onChange={setChecked} color="secondary" ariaLabel="Secondaire" />
      <Toggle checked={checked} onChange={setChecked} color="success" ariaLabel="Succès" />
    </>
  );
}

const sizesCode = `function SizesDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Toggle checked={checked} onChange={setChecked} size="small" ariaLabel="Compact" />
      <Toggle checked={checked} onChange={setChecked} size="medium" ariaLabel="Standard" />
    </>
  );
}`;

function SizesDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Toggle checked={checked} onChange={setChecked} size="small" ariaLabel="Compact" />
      <Toggle checked={checked} onChange={setChecked} size="medium" ariaLabel="Standard" />
    </>
  );
}

const disabledCode = `<Toggle checked onChange={() => {}} disabled ariaLabel="Option verrouillée" />`;

const fr = {
  intro:
    "L'interrupteur on/off de CanopUI. Entièrement accessible via le rôle switch, il propose plusieurs couleurs sémantiques et une transition fluide du curseur.",
  sections: {
    base: {
      title: "Interrupteur de base",
      demoTitle: "Basculement contrôlé",
      demoDescription:
        "checked et onChange pilotent l'état ; ariaLabel alimente le libellé accessible.",
    },
    label: {
      title: "Libellé visible",
      demoTitle: "Interrupteur libellé",
      demoDescription:
        "Le libellé s'affiche à côté de l'interrupteur, le nomme pour les lecteurs d'écran et bascule l'état au clic.",
    },
    colors: {
      title: "Couleurs",
      demoTitle: "Couleurs sémantiques",
      demoDescription: "La prop color définit la teinte du rail à l'état activé.",
    },
    sizes: { title: "Tailles", demoTitle: "small et medium" },
    disabled: { title: "Désactivé", demoTitle: "disabled" },
    api: { title: "API" },
  },
  props: {
    checked: "État activé contrôlé de l'interrupteur.",
    onChange: "Appelé avec le nouvel état lors d'un basculement.",
    disabled: "Désactive l'interrupteur.",
    label: "Libellé visible à côté de l'interrupteur, et nom accessible par défaut.",
    ariaLabel: "Libellé accessible exposé via aria-label. Prime sur label.",
    size: "Taille de l'interrupteur.",
    color: "Couleur du rail lorsque l'interrupteur est activé.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI on/off switch. Fully accessible through the switch role, it offers several semantic colors and a smooth thumb transition.",
  sections: {
    base: {
      title: "Basic switch",
      demoTitle: "Controlled toggling",
      demoDescription: "checked and onChange drive the state; ariaLabel feeds the accessible name.",
    },
    label: {
      title: "Visible label",
      demoTitle: "Labelled switch",
      demoDescription:
        "The label sits next to the switch, names it for screen readers and toggles the state on click.",
    },
    colors: {
      title: "Colors",
      demoTitle: "Semantic colors",
      demoDescription: "The color prop sets the track hue when the switch is on.",
    },
    sizes: { title: "Sizes", demoTitle: "small and medium" },
    disabled: { title: "Disabled", demoTitle: "disabled" },
    api: { title: "API" },
  },
  props: {
    checked: "Controlled on state of the switch.",
    onChange: "Called with the new state on toggle.",
    disabled: "Disables the switch.",
    label: "Visible label next to the switch, and default accessible name.",
    ariaLabel: "Accessible label exposed through aria-label. Wins over label.",
    size: "Size of the switch.",
    color: "Track color when the switch is on.",
  },
};

const texts = { fr, en };

export default function ToggleDoc() {
  const t = texts[useDocLocale()];
  const rows: PropRow[] = [
    {
      name: "checked",
      type: "boolean",
      required: true,
      description: t.props.checked,
    },
    {
      name: "onChange",
      type: "(checked: boolean) => void",
      required: true,
      description: t.props.onChange,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
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
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "success"',
      defaultValue: '"accent"',
      description: t.props.color,
    },
  ];
  return (
    <DocPage title="Toggle" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.base.title}>
        <DemoCard
          title={t.sections.base.demoTitle}
          description={t.sections.base.demoDescription}
          code={baseCode}
          align="start"
        >
          <ToggleDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.label.title}>
        <DemoCard
          title={t.sections.label.demoTitle}
          description={t.sections.label.demoDescription}
          code={labelCode}
          align="start"
        >
          <LabelToggleDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors.title}>
        <DemoCard
          title={t.sections.colors.demoTitle}
          description={t.sections.colors.demoDescription}
          code={colorsCode}
          align="start"
        >
          <ColorsDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes.title}>
        <DemoCard title={t.sections.sizes.demoTitle} code={sizesCode} align="start">
          <SizesDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled.title}>
        <DemoCard title={t.sections.disabled.demoTitle} code={disabledCode} align="start">
          <Toggle checked onChange={() => {}} disabled ariaLabel="Option verrouillée" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api.title}>
        <PropsTable rows={rows} />
      </DocSection>
    </DocPage>
  );
}
