import { useState } from "react";
import { Icon, InlineInput, Pressable, Stack, Text } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { InlineInput } from "@canop/ui";`;

const renommageCode = `function Renommage() {
  const [nom, setNom] = useState("rapport-annuel.pdf");
  const [brouillon, setBrouillon] = useState(nom);
  const [edition, setEdition] = useState(false);

  if (!edition) {
    return (
      <Pressable onClick={() => { setBrouillon(nom); setEdition(true); }} ariaLabel={\`Renommer \${nom}\`}>
        <Text variant="body-md">{nom}</Text>
      </Pressable>
    );
  }

  return (
    <InlineInput
      value={brouillon}
      onChange={setBrouillon}
      onCommit={() => { setNom(brouillon.trim() || nom); setEdition(false); }}
      onCancel={() => setEdition(false)}
      ariaLabel="Nom du fichier"
    />
  );
}`;

function Renommage() {
  const [nom, setNom] = useState("rapport-annuel.pdf");
  const [brouillon, setBrouillon] = useState(nom);
  const [edition, setEdition] = useState(false);

  return (
    <Stack direction="row" gap="sm" alignItems="center">
      <Icon name="file" size="sm" />
      {edition ? (
        <InlineInput
          value={brouillon}
          onChange={setBrouillon}
          onCommit={() => {
            setNom(brouillon.trim() || nom);
            setEdition(false);
          }}
          onCancel={() => setEdition(false)}
          ariaLabel="Nom du fichier"
        />
      ) : (
        <Pressable
          onClick={() => {
            setBrouillon(nom);
            setEdition(true);
          }}
          padding="2xs"
          radius="xs"
          ariaLabel={`Renommer ${nom}`}
        >
          <Text variant="body-md">{nom}</Text>
        </Pressable>
      )}
    </Stack>
  );
}

const fr = {
  intro:
    "Le champ d'édition en place : renommer un fichier dans sa liste, une colonne dans son en-tête, sans ouvrir de formulaire. Il n'apporte pas seulement une apparence discrète, il porte le comportement — Entrée valide, Échap abandonne, la perte du focus valide, et rien ne remonte à l'élément cliquable qui l'héberge.",
  sections: { renommage: "Renommer en place", api: "API" },
  demos: {
    renommage: {
      title: "Entrée valide, Échap abandonne",
      description:
        "Cliquez sur le nom pour l'éditer. La touche Entrée et la perte du focus valident, Échap revient au nom précédent. Le champ arrête la propagation du clic et des touches : sans cela, taper Entrée sur une ligne de fichier renommerait le fichier et l'ouvrirait dans le même geste — c'est précisément le défaut que ce composant existe pour empêcher, et il ne se voit qu'à l'usage.",
    },
  },
  props: {
    value: "Valeur affichée dans le champ.",
    onChange: "Appelé à chaque frappe avec la nouvelle valeur.",
    onCommit: "Appelé à la validation : touche Entrée, ou perte du focus.",
    onCancel: "Appelé à l'abandon : touche Échap.",
    placeholder: "Texte affiché quand le champ est vide.",
    ariaLabel: "Nom accessible du champ, indispensable sans libellé visible.",
    autoFocus: "Place le curseur dans le champ dès son apparition.",
    maxLength: "Nombre maximal de caractères saisissables.",
    disabled: "Rend le champ inerte.",
  },
};

const en: typeof fr = {
  intro:
    "The in-place editing field: rename a file in its list, a column in its header, without opening a form. It brings more than a discreet look, it carries the behaviour — Enter commits, Escape cancels, losing focus commits, and nothing bubbles up to the clickable element hosting it.",
  sections: { renommage: "Renaming in place", api: "API" },
  demos: {
    renommage: {
      title: "Enter commits, Escape cancels",
      description:
        "Click the name to edit it. Enter and losing focus commit, Escape restores the previous name. The field stops click and key propagation: without it, pressing Enter on a file row would rename the file and open it in the same gesture — precisely the defect this component exists to prevent, and one that only shows up in use.",
    },
  },
  props: {
    value: "Value shown in the field.",
    onChange: "Called on every keystroke with the new value.",
    onCommit: "Called on commit: Enter key, or focus loss.",
    onCancel: "Called on cancel: Escape key.",
    placeholder: "Text shown while the field is empty.",
    ariaLabel: "Accessible name of the field, required without a visible label.",
    autoFocus: "Places the caret in the field as soon as it appears.",
    maxLength: "Maximum number of characters that can be typed.",
    disabled: "Makes the field inert.",
  },
};

const texts = { fr, en };

export default function InlineInputDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "value", type: "string", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(value: string) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "onCommit", type: "() => void", required: true, description: t.props.onCommit },
    { name: "onCancel", type: "() => void", required: true, description: t.props.onCancel },
    { name: "placeholder", type: "string", description: t.props.placeholder },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "autoFocus", type: "boolean", defaultValue: "true", description: t.props.autoFocus },
    { name: "maxLength", type: "number", description: t.props.maxLength },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
  ];

  return (
    <DocPage title="InlineInput" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.renommage}>
        <DemoCard
          title={t.demos.renommage.title}
          description={t.demos.renommage.description}
          code={renommageCode}
        >
          <Renommage />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
