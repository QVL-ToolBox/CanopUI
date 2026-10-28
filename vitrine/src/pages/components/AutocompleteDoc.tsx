import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { CityLayoutsDemo } from "./autocomplete/CityLayoutsDemo";
import { CompletionShortcutsTable } from "./autocomplete/CompletionShortcutsTable";
import { DepartementDemo } from "./autocomplete/DepartementDemo";
import { FreeTextDemo } from "./autocomplete/FreeTextDemo";
import { RepeatedEntryDemo } from "./autocomplete/RepeatedEntryDemo";

const importCode = `import { Autocomplete } from "@canop/ui";`;

const usageCode = `const departements = [
  { value: "21", label: "Côte-d'Or" },
  { value: "22", label: "Côtes-d'Armor" },
  { value: "75", label: "Paris" },
];

const [code, setCode] = useState("");

<Autocomplete
  options={departements}
  value={code}
  onChange={setCode}
  label="Département"
/>`;

const layoutsCode = `<Autocomplete label="Ville" size="small" options={villes} value={ville} onChange={setVille} />
<Autocomplete label="Ville" options={villes} value={ville} onChange={setVille} />
<Autocomplete
  ariaLabel="Ville de départ"
  placeholder="Ville de départ"
  options={villes}
  value={ville}
  onChange={setVille}
/>
<Autocomplete label="Désactivé" disabled options={villes} value="13055" onChange={setVille} />`;

const repeatCode = `const [essais, setEssais] = useState<string[]>([]);

<Autocomplete
  options={departements.filter((option) => !essais.includes(option.value))}
  value=""
  onChange={(code) => setEssais((courants) => [...courants, code])}
  clearOnSelect
  label="Votre essai"
/>`;

const freeCode = `<Autocomplete options={departements} value={code} onChange={setCode} label="Liste imposée" />
<Autocomplete
  options={departements}
  value={texte}
  onChange={setTexte}
  allowFreeText
  label="Saisie libre"
/>`;

const fr = {
  intro:
    "Un champ qui complète la saisie en ligne à partir d'une liste d'options. La suite du libellé de la première option qui prolonge la saisie s'affiche en gris, au curseur, comme dans une barre de recherche : pas de liste déroulante, la saisie reste au clavier. La comparaison ignore accents, casse et séparateurs, et onChange reçoit la valeur de l'option, jamais son libellé.",
  sections: {
    usage: "Utilisation",
    layouts: "Tailles et libellé",
    repeat: "Saisie répétée",
    free: "Hors liste",
    shortcuts: "Clavier et toucher",
    api: "API",
  },
  demos: {
    usageTitle: "Tapez « cote d », puis Tab",
    usageDescription:
      "« cote d » propose « Côte-d'Or » : accents, casse, tiret et apostrophe sont ignorés, et la suite affichée reprend le libellé exact là où la saisie s'arrête. « cote » seul propose aussi Côte-d'Or, première option de la liste qui commence ainsi ; « cotes » passe aux Côtes-d'Armor. Tab, Entrée ou → acceptent. Une saisie égale à un libellé n'affiche plus rien. Dès que la saisie correspond exactement à un libellé, la valeur est retenue : la pastille montre la value, ici le numéro du département.",
    usageField: "Département",
    layoutsTitle: "small et medium, avec ou sans libellé visible",
    layoutsDescription:
      "Le texte fantôme se place dans la zone de saisie quel que soit le format, que le libellé soit rétracté ou absent. Sans libellé visible, ariaLabel donne son nom au champ. Il n'apparaît jamais sur un champ désactivé, qui affiche le libellé de sa valeur.",
    layoutsCity: "Ville",
    layoutsPlaceholder: "Ville de départ",
    layoutsDisabled: "Désactivé",
    repeatTitle: "Le champ se vide, la liste se souvient",
    repeatDescription:
      "Pour une suite d'essais, clearOnSelect vide le champ dès qu'une option est retenue : par acceptation, ou par saisie exacte quand aucun autre libellé ne la prolonge. Ici les départements déjà proposés sortent aussi de la liste. Tapez « loire » : Loire-Atlantique et Loiret la prolongent, la Loire attend donc l'acceptation d'une suggestion ou la sortie du champ. Poursuivez avec « -a », puis Tab ou Entrée retient Loire-Atlantique.",
    repeatField: "Votre essai",
    repeatNone: "Aucun essai pour l'instant.",
    freeTitle: "Refuser, ou accepter",
    freeDescription:
      "Par défaut, une saisie qui ne correspond à aucune option donne une valeur vide, et le champ reprend le libellé de la valeur retenue en perdant le focus. Avec allowFreeText, le texte brut est transmis à chaque frappe, sauf quand il correspond exactement à une option. Tapez « Atlantide » dans les deux champs, puis quittez-les.",
    freeStrict: "Liste imposée",
    freeFree: "Saisie libre",
  },
  shortcuts: {
    title: "Raccourcis",
    headers: { keys: "Touche", effect: "Effet" },
    rows: [
      { keys: "Tab", effect: "Accepte la suggestion entière (sinon, Tab change de champ)." },
      {
        keys: "Entrée",
        effect:
          "Accepte la suggestion visible (sinon, Entrée soumet le formulaire comme d'habitude).",
      },
      { keys: "→", effect: "Accepte la suggestion entière, curseur en fin de texte." },
      { keys: "Ctrl + →  /  ⌥ + →", effect: "Accepte le mot suivant de la suggestion." },
      { keys: "Échap", effect: "Masque la suggestion jusqu'à la prochaine frappe." },
      { keys: "Toucher le texte gris", effect: "Accepte la suggestion sur mobile." },
    ],
  },
  props: {
    options: "Les options : une valeur, et un libellé facultatif qui sert de suggestion.",
    value: "Valeur retenue, ou chaîne vide quand rien n'est choisi.",
    onChange:
      "Appelé avec la value de l'option retenue : à l'acceptation, ou quand la saisie correspond exactement à un libellé. Reçoit une chaîne vide pour une saisie hors liste, ou le texte brut avec allowFreeText.",
    inputValue: "Texte saisi, quand l'appelant veut le tenir lui-même.",
    onInputChange: "Appelé à chaque changement du texte saisi.",
    allowFreeText:
      "Accepte une saisie qui ne figure pas dans la liste, transmise telle quelle. Refusée par défaut.",
    maxSuggestions: "Obsolète, sans effet : il n'y a plus de liste de suggestions.",
    clearOnSelect:
      "Vide le champ dès qu'une option est retenue ; seules les options sont alors transmises.",
    error: "Message d'erreur, qui prend la place du texte d'aide.",
    ariaLabel: "Nom accessible explicite, pour un champ sans libellé visible.",
    label: "Libellé flottant du champ.",
    placeholder: "Texte d'invite, affiché tant que rien n'est saisi.",
    normalize:
      "Ce qu'on compare, des deux côtés : la saisie et chaque libellé passent par cette fonction, pour choisir la suggestion comme pour reconnaître une saisie exacte. Par défaut foldForSearch, qui retire accents, casse et séparateurs. La remplacer ajoute ce que la librairie ne peut pas deviner : une abréviation d'usage, un alias métier.",
    helperText: "Texte d'aide sous le champ, tant qu'aucune erreur ne prend sa place.",
    disabled: "Rend le champ inerte.",
    fullWidth: "Étire le champ sur toute la largeur disponible.",
    autoFocus: "Donne le focus au champ dès son montage.",
    size: "Hauteur du champ.",
  },
};

const en: typeof fr = {
  intro:
    "A field that completes the entry inline from a list of options. The rest of the label of the first option extending the entry shows in gray at the caret, like a search bar: no dropdown, typing stays on the keyboard. Matching ignores accents, case and separators, and onChange receives the option's value, never its label.",
  sections: {
    usage: "Usage",
    layouts: "Sizes and label",
    repeat: "Repeated entry",
    free: "Off-list",
    shortcuts: "Keyboard and touch",
    api: "API",
  },
  demos: {
    usageTitle: 'Type "cote d", then Tab',
    usageDescription:
      '"cote d" suggests "Côte-d\'Or": accents, case, hyphen and apostrophe are ignored, and the rest shown picks up the exact label where the entry stops. "cote" alone also suggests Côte-d\'Or, the first option starting that way; "cotes" moves on to Côtes-d\'Armor. Tab, Enter or → accept. An entry equal to a label shows nothing more. As soon as the entry exactly matches a label, the value is taken: the chip shows the value, here the department number.',
    usageField: "Department",
    layoutsTitle: "small and medium, with or without a visible label",
    layoutsDescription:
      "The ghost text sits in the input area whatever the size, whether the label is floated or absent. Without a visible label, ariaLabel names the field. It never shows on a disabled field, which displays the label of its value.",
    layoutsCity: "City",
    layoutsPlaceholder: "Departure city",
    layoutsDisabled: "Disabled",
    repeatTitle: "The field clears, the list remembers",
    repeatDescription:
      'For a run of guesses, clearOnSelect empties the field as soon as an option is taken: by acceptance, or by exact entry when no other label extends it. Here the departments already guessed also leave the list. Type "loire": Loire-Atlantique and Loiret extend it, so Loire waits for a suggestion to be accepted or for the field to be left. Go on with "-a", then Tab or Enter takes Loire-Atlantique.',
    repeatField: "Your guess",
    repeatNone: "No guess yet.",
    freeTitle: "Refuse, or accept",
    freeDescription:
      'By default, an entry matching no option yields an empty value, and the field restores the label of the value taken when it loses focus. With allowFreeText, the raw text is passed on every keystroke, unless it exactly matches an option. Type "Atlantis" in both fields, then leave them.',
    freeStrict: "List enforced",
    freeFree: "Free text",
  },
  shortcuts: {
    title: "Shortcuts",
    headers: { keys: "Key", effect: "Effect" },
    rows: [
      { keys: "Tab", effect: "Accepts the whole suggestion (otherwise Tab moves focus)." },
      {
        keys: "Enter",
        effect: "Accepts the visible suggestion (otherwise Enter submits the form as usual).",
      },
      { keys: "→", effect: "Accepts the whole suggestion, caret at the end." },
      { keys: "Ctrl + →  /  ⌥ + →", effect: "Accepts the next word of the suggestion." },
      { keys: "Esc", effect: "Hides the suggestion until the next keystroke." },
      { keys: "Tap the gray text", effect: "Accepts the suggestion on mobile." },
    ],
  },
  props: {
    options: "The options: a value, and an optional label used as the suggestion.",
    value: "Value taken, or empty string when nothing is chosen.",
    onChange:
      "Called with the value of the option taken: on acceptance, or when the entry exactly matches a label. Receives an empty string for an off-list entry, or the raw text with allowFreeText.",
    inputValue: "Typed text, when the caller wants to hold it.",
    onInputChange: "Called whenever the typed text changes.",
    allowFreeText: "Accepts an entry that is not in the list, passed as is. Refused by default.",
    maxSuggestions: "Deprecated, no effect: there is no suggestion list anymore.",
    clearOnSelect: "Empties the field as soon as an option is taken; only options are passed then.",
    error: "Error message, which replaces the helper text.",
    ariaLabel: "Explicit accessible name, for a field with no visible label.",
    label: "Floating label of the field.",
    placeholder: "Hint text, shown while the field is empty.",
    normalize:
      "What gets compared, on both sides: the entry and each label go through this function, to pick the suggestion and to recognize an exact entry. Defaults to foldForSearch, which strips accents, case and separators. Replacing it adds what the library cannot guess: a common abbreviation, a domain alias.",
    helperText: "Helper text below the field, until an error takes its place.",
    disabled: "Makes the field inert.",
    fullWidth: "Stretches the field across the available width.",
    autoFocus: "Focuses the field as soon as it mounts.",
    size: "Height of the field.",
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
      name: "clearOnSelect",
      type: "boolean",
      defaultValue: "false",
      description: t.props.clearOnSelect,
    },
    {
      name: "normalize",
      type: "(text: string) => string",
      defaultValue: "foldForSearch",
      description: t.props.normalize,
    },
    { name: "label", type: "string", description: t.props.label },
    { name: "ariaLabel", type: "string", defaultValue: "—", description: t.props.ariaLabel },
    { name: "placeholder", type: "string", description: t.props.placeholder },
    { name: "helperText", type: "string", description: t.props.helperText },
    { name: "error", type: "string | null", defaultValue: "—", description: t.props.error },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "fullWidth", type: "boolean", defaultValue: "false", description: t.props.fullWidth },
    { name: "autoFocus", type: "boolean", defaultValue: "false", description: t.props.autoFocus },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "maxSuggestions",
      type: "number",
      defaultValue: "—",
      description: t.props.maxSuggestions,
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
          <DepartementDemo label={t.demos.usageField} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.layouts}>
        <DemoCard
          title={t.demos.layoutsTitle}
          description={t.demos.layoutsDescription}
          code={layoutsCode}
          align="stretch"
        >
          <CityLayoutsDemo
            labels={{
              city: t.demos.layoutsCity,
              placeholder: t.demos.layoutsPlaceholder,
              disabled: t.demos.layoutsDisabled,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.repeat}>
        <DemoCard
          title={t.demos.repeatTitle}
          description={t.demos.repeatDescription}
          code={repeatCode}
          align="stretch"
        >
          <RepeatedEntryDemo labels={{ field: t.demos.repeatField, none: t.demos.repeatNone }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.free}>
        <DemoCard
          title={t.demos.freeTitle}
          description={t.demos.freeDescription}
          code={freeCode}
          align="stretch"
        >
          <FreeTextDemo labels={{ strict: t.demos.freeStrict, free: t.demos.freeFree }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.shortcuts}>
        <CompletionShortcutsTable
          title={t.shortcuts.title}
          headers={t.shortcuts.headers}
          rows={t.shortcuts.rows}
        />
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable rows={rows} />
      </DocSection>
    </DocPage>
  );
}
