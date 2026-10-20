import { useState } from "react";
import { Autocomplete, Stack, StatusChip, Text, type CanopAutocompleteOption } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Autocomplete } from "@canop/ui";`;

const usageCode = `const [code, setCode] = useState("");
const [texte, setTexte] = useState("");

<Autocomplete
  options={departements}
  value={code}
  onChange={setCode}
  inputValue={texte}
  onInputChange={setTexte}
  label="Département"
/>`;

const repeatCode = `<Autocomplete
  options={departements}
  value={essai}
  onChange={deviner}
  inputValue={texte}
  onInputChange={setTexte}
  clearOnSelect
  label="Votre essai"
/>`;

const DEPARTEMENTS: CanopAutocompleteOption[] = [
  { value: "21", label: "Côte-d'Or" },
  { value: "29", label: "Finistère" },
  { value: "75", label: "Paris" },
  { value: "13", label: "Bouches-du-Rhône" },
  { value: "06", label: "Alpes-Maritimes" },
  { value: "2A", label: "Corse-du-Sud" },
  { value: "68", label: "Haut-Rhin" },
  { value: "44", label: "Loire-Atlantique" },
  { value: "59", label: "Nord" },
  { value: "69", label: "Rhône" },
  { value: "31", label: "Haute-Garonne" },
  { value: "33", label: "Gironde" },
];

const NOMS = new Map(DEPARTEMENTS.map((option) => [option.value, option.label ?? option.value]));

function Simple({ label }: { label: string }) {
  const [code, setCode] = useState("");
  const [texte, setTexte] = useState("");

  return (
    <Stack gap="md" alignItems="start">
      <Autocomplete
        options={DEPARTEMENTS}
        value={code}
        onChange={setCode}
        inputValue={texte}
        onInputChange={setTexte}
        label={label}
        fullWidth
      />
      <Stack direction="row" gap="sm" alignItems="center">
        <Text variant="body-sm" tone="muted">
          value
        </Text>
        <StatusChip tone={code ? "success" : "neutral"} label={code || "—"} />
      </Stack>
    </Stack>
  );
}

function Repetee({ labels }: { labels: { field: string; none: string } }) {
  const [essais, setEssais] = useState<string[]>([]);
  const [texte, setTexte] = useState("");

  return (
    <Stack gap="md" alignItems="start">
      <Autocomplete
        options={DEPARTEMENTS.filter((option) => !essais.includes(option.value))}
        value=""
        onChange={(code) => {
          if (code) setEssais((current) => [...current, code]);
        }}
        inputValue={texte}
        onInputChange={setTexte}
        clearOnSelect
        label={labels.field}
        fullWidth
      />
      <Stack direction="row" gap="xs" wrap>
        {essais.length === 0 ? (
          <Text variant="body-sm" tone="muted">
            {labels.none}
          </Text>
        ) : (
          essais.map((code) => (
            <StatusChip key={code} tone="info" label={`${NOMS.get(code)} (${code})`} />
          ))
        )}
      </Stack>
    </Stack>
  );
}

function Libre({ labels }: { labels: { strict: string; free: string } }) {
  const [strict, setStrict] = useState("");
  const [texteStrict, setTexteStrict] = useState("");
  const [libre, setLibre] = useState("");
  const [texteLibre, setTexteLibre] = useState("");

  return (
    <Stack gap="lg" alignItems="stretch">
      <Stack gap="sm" alignItems="start">
        <Autocomplete
          options={DEPARTEMENTS}
          value={strict}
          onChange={setStrict}
          inputValue={texteStrict}
          onInputChange={setTexteStrict}
          label={labels.strict}
          fullWidth
        />
        <StatusChip tone={strict ? "success" : "neutral"} label={strict || "—"} />
      </Stack>
      <Stack gap="sm" alignItems="start">
        <Autocomplete
          options={DEPARTEMENTS}
          value={libre}
          onChange={setLibre}
          inputValue={texteLibre}
          onInputChange={setTexteLibre}
          allowFreeText
          label={labels.free}
          fullWidth
        />
        <StatusChip tone={libre ? "success" : "neutral"} label={libre || "—"} />
      </Stack>
    </Stack>
  );
}

const fr = {
  intro:
    "Un champ de saisie avec suggestions, qui remplace le <datalist> qu'on écrit d'instinct. Le datalist coûte cher : le filtrage est laissé au navigateur, la navigation au clavier n'existe pas partout, et rien ne rattrape une saisie approchée.",
  sections: { usage: "Utilisation", repeat: "Saisie répétée", free: "Hors liste", api: "API" },
  demos: {
    usageTitle: "Tapez « par », puis « cote »",
    usageDescription:
      "Tapez « par » : la part non tapée de la suggestion apparaît dans le champ, en état sélectionné — c'est la complétion en ligne intégrée à MUI, et taper la suite la remplace. Entrée retient la suggestion mise en avant, et la flèche en change. Tapez maintenant « cote » : la liste trouve « Côte-d'Or » alors que l'accent manque, parce que le filtrage l'ignore, ainsi que la casse. La pastille montre la valeur retenue, qui n'est pas le libellé affiché.",
    usageField: "Département",
    repeatTitle: "Le champ se vide, la liste se souvient",
    repeatDescription:
      "Pour une suite d'essais, le texte précédent n'a plus rien à dire : clearOnSelect vide le champ dès qu'une valeur est retenue. Ici les départements déjà proposés sortent aussi de la liste — la sélection est retrouvée par sa valeur et non par identité, donc reconstruire la liste à chaque rendu ne casse rien.",
    repeatField: "Votre essai",
    repeatNone: "Aucun essai pour l'instant.",
    freeTitle: "Refuser, ou accepter",
    freeDescription:
      "Par défaut une saisie hors liste n'est pas retenue : une valeur qui ne correspond à rien n'est presque jamais exploitable, et la refuser tout de suite vaut mieux qu'un message d'erreur après coup. Tapez « Atlantide » puis Entrée dans les deux champs pour voir la différence.",
    freeStrict: "Liste imposée",
    freeFree: "Saisie libre",
  },
  props: {
    label: "Libellé du champ, affiché au-dessus de la saisie.",
    placeholder: "Texte d'invite, affiché tant que rien n'est saisi.",
    normalize:
      "Ce qu'on compare, des deux côtés : la saisie et le libellé de chaque option passent par cette fonction avant d'être confrontés. Par défaut foldForSearch, qui retire accents, casse et séparateurs. La remplacer ajoute ce que la librairie ne peut pas deviner — une abréviation d'usage, un préfixe à ignorer, un alias métier.",
    helperText: "Texte d'aide sous le champ, tant qu'aucune erreur ne prend sa place.",
    disabled: "Rend le champ inerte.",
    fullWidth: "Étire le champ sur toute la largeur disponible.",
    autoFocus: "Donne le focus au champ dès son montage.",
    size: "Hauteur du champ.",
    options: "Les suggestions : une valeur, et un libellé facultatif.",
    value: "Valeur retenue, ou chaîne vide quand rien n'est choisi.",
    onChange: "Appelé avec la valeur retenue.",
    inputValue: "Texte saisi, quand l'appelant veut le tenir lui-même.",
    onInputChange: "Appelé à chaque frappe.",
    allowFreeText: "Accepte une saisie qui ne figure pas dans la liste. Refusée par défaut.",
    maxSuggestions: "Plafond de suggestions affichées. Sans plafond par défaut.",
    clearOnSelect: "Vide le champ dès qu'une valeur est retenue.",
    error: "Message d'erreur, qui prend la place du texte d'aide.",
    ariaLabel: "Nom accessible explicite, pour un champ sans libellé visible.",
  },
};

const en = {
  intro:
    "A text field with suggestions, replacing the <datalist> everyone writes by reflex. A datalist is costly: filtering is left to the browser, keyboard navigation does not exist everywhere, and nothing rescues an approximate entry.",
  sections: { usage: "Usage", repeat: "Repeated entry", free: "Off-list", api: "API" },
  demos: {
    usageTitle: 'Type "par", then "cote"',
    usageDescription:
      'Filtering ignores accents and case: "cote" finds "Côte-d\'Or", which no keyboard makes easy. And the first suggestion is preselected, so Enter takes what is offered — that is the whole gap with a datalist, where the user types "cote d", the field finds nothing and the application answers "unknown" while the suggestion was right there. The chip shows the value taken, which is not the label displayed.',
    usageField: "Department",
    repeatTitle: "The field clears, the list remembers",
    repeatDescription:
      "For a run of guesses the previous text has nothing left to say: clearOnSelect empties the field as soon as a value is taken. Here the departments already guessed also leave the list — the selection is found by its value rather than by identity, so rebuilding the list on every render breaks nothing.",
    repeatField: "Your guess",
    repeatNone: "No guess yet.",
    freeTitle: "Refuse, or accept",
    freeDescription:
      'By default an off-list entry is not taken: a value matching nothing is almost never usable, and refusing it right away beats an error message after the fact. Type "Atlantis" then Enter in both fields to see the difference.',
    freeStrict: "List enforced",
    freeFree: "Free text",
  },
  props: {
    label: "Field label, shown above the input.",
    placeholder: "Hint text, shown while the field is empty.",
    normalize:
      "What gets compared, on both sides: the typed text and each option's label go through this function before being matched. Defaults to foldForSearch, which strips accents, case and separators. Replacing it adds what the library cannot guess — a common abbreviation, a prefix to ignore, a domain alias.",
    helperText: "Helper text below the field, until an error takes its place.",
    disabled: "Makes the field inert.",
    fullWidth: "Stretches the field across the available width.",
    autoFocus: "Focuses the field as soon as it mounts.",
    size: "Height of the field.",
    options: "The suggestions: a value, and an optional label.",
    value: "Value taken, or empty string when nothing is chosen.",
    onChange: "Called with the value taken.",
    inputValue: "Typed text, when the caller wants to hold it.",
    onInputChange: "Called on every keystroke.",
    allowFreeText: "Accepts an entry that is not in the list. Refused by default.",
    maxSuggestions: "Cap on displayed suggestions. No cap by default.",
    clearOnSelect: "Empties the field as soon as a value is taken.",
    error: "Error message, which replaces the helper text.",
    ariaLabel: "Explicit accessible name, for a field with no visible label.",
  },
};

const texts = { fr, en };

export default function AutocompleteDoc() {
  const t = texts[useDocLocale()];

  const rows: PropRow[] = [
    {
      name: "options",
      type: "readonly CanopAutocompleteOption[]",
      required: true,
      description: t.props.options,
    },
    { name: "value", type: "string", required: true, description: t.props.value },
    {
      name: "onChange",
      type: "(value: string) => void",
      required: true,
      description: t.props.onChange,
    },
    { name: "inputValue", type: "string", defaultValue: "—", description: t.props.inputValue },
    {
      name: "onInputChange",
      type: "(text: string) => void",
      defaultValue: "—",
      description: t.props.onInputChange,
    },
    {
      name: "allowFreeText",
      type: "boolean",
      defaultValue: "false",
      description: t.props.allowFreeText,
    },
    {
      name: "maxSuggestions",
      type: "number",
      defaultValue: "—",
      description: t.props.maxSuggestions,
    },
    {
      name: "clearOnSelect",
      type: "boolean",
      defaultValue: "false",
      description: t.props.clearOnSelect,
    },
    { name: "error", type: "string | null", defaultValue: "—", description: t.props.error },
    { name: "ariaLabel", type: "string", defaultValue: "—", description: t.props.ariaLabel },
    { name: "label", type: "string", description: t.props.label },
    { name: "placeholder", type: "string", description: t.props.placeholder },
    {
      name: "normalize",
      type: "(text: string) => string",
      defaultValue: "foldForSearch",
      description: t.props.normalize,
    },
    { name: "helperText", type: "string", description: t.props.helperText },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "fullWidth", type: "boolean", defaultValue: "false", description: t.props.fullWidth },
    { name: "autoFocus", type: "boolean", defaultValue: "false", description: t.props.autoFocus },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
  ];

  return (
    <DocPage title="Autocomplete" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
          align="stretch"
        >
          <Simple label={t.demos.usageField} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.repeat}>
        <DemoCard
          title={t.demos.repeatTitle}
          description={t.demos.repeatDescription}
          code={repeatCode}
          align="stretch"
        >
          <Repetee labels={{ field: t.demos.repeatField, none: t.demos.repeatNone }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.free}>
        <DemoCard
          title={t.demos.freeTitle}
          description={t.demos.freeDescription}
          code={`<Autocomplete allowFreeText ... />`}
          align="stretch"
        >
          <Libre labels={{ strict: t.demos.freeStrict, free: t.demos.freeFree }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable rows={rows} />
      </DocSection>
    </DocPage>
  );
}
