import { useState } from "react";
import { Checkbox, Link } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Checkbox } from "@canop/ui";`;

const baseCode = `function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox checked={checked} onChange={setChecked} label="Recevoir la newsletter" />
  );
}`;

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="Recevoir la newsletter" />;
}

const sublabelCode = `function SublabelDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label="Notifications par email"
      sublabel="Un récapitulatif hebdomadaire de votre activité."
    />
  );
}`;

function SublabelDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label="Notifications par email"
      sublabel="Un récapitulatif hebdomadaire de votre activité."
    />
  );
}

const linkCode = `function LinkLabelDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      required
      label={
        <>
          J'accepte les{" "}
          <Link href="#cgu" size="small">
            conditions générales d'utilisation
          </Link>
        </>
      }
    />
  );
}`;

function LinkLabelDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      required
      label={
        <>
          J'accepte les{" "}
          <Link href="#cgu" size="small">
            conditions générales d'utilisation
          </Link>
        </>
      }
    />
  );
}

const errorCode = `function ErrorDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      required
      error="Vous devez accepter les conditions générales d'utilisation."
      label="J'accepte les conditions générales d'utilisation"
    />
  );
}`;

function ErrorDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      required
      error="Vous devez accepter les conditions générales d'utilisation."
      label="J'accepte les conditions générales d'utilisation"
    />
  );
}

const sizeCode = `function SizeDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Checkbox checked={checked} onChange={setChecked} size="small" label="Compact" />
      <Checkbox checked={checked} onChange={setChecked} size="medium" label="Standard" />
    </>
  );
}`;

function SizeDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Checkbox checked={checked} onChange={setChecked} size="small" label="Compact" />
      <Checkbox checked={checked} onChange={setChecked} size="medium" label="Standard" />
    </>
  );
}

const disabledCode = `<Checkbox checked onChange={() => {}} disabled label="Option indisponible" />`;

const fr = {
  intro:
    "La case à cocher contrôlée de CanopUI. Elle accepte un libellé enrichi, un sous-libellé descriptif, un état obligatoire et un message d'erreur, tout en restant accessible.",
  sections: {
    base: {
      title: "Case de base",
      demoTitle: "Case avec libellé",
      demoDescription: "checked et onChange pilotent l'état. Le libellé est cliquable.",
    },
    sublabel: {
      title: "Sous-libellé",
      demoTitle: "Libellé et description",
      demoDescription: "sublabel ajoute un texte secondaire pour préciser l'option.",
    },
    richLabel: {
      title: "Libellé enrichi",
      demoTitle: "Lien dans le libellé",
      demoDescription:
        "Le libellé accepte tout ReactNode ; un clic sur un lien ne bascule pas la case.",
    },
    error: {
      title: "Erreur",
      demoTitle: "Case obligatoire en erreur",
      demoDescription: "error affiche un message et passe la case en état d'erreur.",
    },
    sizes: { title: "Tailles", demoTitle: "small et medium" },
    disabled: { title: "Désactivée", demoTitle: "disabled" },
    api: { title: "API" },
  },
  props: {
    checked: "État coché contrôlé de la case.",
    onChange: "Appelé avec le nouvel état lors d'un basculement.",
    label: "Libellé cliquable ; accepte du texte enrichi comme un lien.",
    sublabel: "Texte secondaire affiché sous le libellé.",
    disabled: "Désactive la case.",
    size: "Taille de la case.",
    required: "Marque le champ comme obligatoire.",
    error: "Message d'erreur affiché sous la case et passant le contrôle en état d'erreur.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI controlled checkbox. It accepts a rich label, a descriptive sublabel, a required state and an error message, all while staying accessible.",
  sections: {
    base: {
      title: "Basic checkbox",
      demoTitle: "Checkbox with label",
      demoDescription: "checked and onChange drive the state. The label is clickable.",
    },
    sublabel: {
      title: "Sublabel",
      demoTitle: "Label and description",
      demoDescription: "sublabel adds secondary text to clarify the option.",
    },
    richLabel: {
      title: "Rich label",
      demoTitle: "Link inside the label",
      demoDescription:
        "The label accepts any ReactNode; clicking a link does not toggle the checkbox.",
    },
    error: {
      title: "Error",
      demoTitle: "Required checkbox in error",
      demoDescription: "error displays a message and puts the checkbox in an error state.",
    },
    sizes: { title: "Sizes", demoTitle: "small and medium" },
    disabled: { title: "Disabled", demoTitle: "disabled" },
    api: { title: "API" },
  },
  props: {
    checked: "Controlled checked state of the checkbox.",
    onChange: "Called with the new state on toggle.",
    label: "Clickable label; accepts rich content such as a link.",
    sublabel: "Secondary text displayed below the label.",
    disabled: "Disables the checkbox.",
    size: "Size of the checkbox.",
    required: "Marks the field as required.",
    error: "Error message displayed below the checkbox, putting the control in an error state.",
  },
};

const texts = { fr, en };

export default function CheckboxDoc() {
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
      name: "label",
      type: "ReactNode",
      description: t.props.label,
    },
    {
      name: "sublabel",
      type: "ReactNode",
      description: t.props.sublabel,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
    },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: t.props.required,
    },
    {
      name: "error",
      type: "string | null",
      defaultValue: "null",
      description: t.props.error,
    },
  ];
  return (
    <DocPage title="Checkbox" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.base.title}>
        <DemoCard
          title={t.sections.base.demoTitle}
          description={t.sections.base.demoDescription}
          code={baseCode}
          align="start"
        >
          <CheckboxDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sublabel.title}>
        <DemoCard
          title={t.sections.sublabel.demoTitle}
          description={t.sections.sublabel.demoDescription}
          code={sublabelCode}
          align="start"
        >
          <SublabelDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.richLabel.title}>
        <DemoCard
          title={t.sections.richLabel.demoTitle}
          description={t.sections.richLabel.demoDescription}
          code={linkCode}
          align="start"
        >
          <LinkLabelDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.error.title}>
        <DemoCard
          title={t.sections.error.demoTitle}
          description={t.sections.error.demoDescription}
          code={errorCode}
          align="start"
        >
          <ErrorDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes.title}>
        <DemoCard title={t.sections.sizes.demoTitle} code={sizeCode} align="start">
          <SizeDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled.title}>
        <DemoCard title={t.sections.disabled.demoTitle} code={disabledCode} align="start">
          <Checkbox checked onChange={() => {}} disabled label="Option indisponible" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api.title}>
        <PropsTable rows={rows} />
      </DocSection>
    </DocPage>
  );
}
