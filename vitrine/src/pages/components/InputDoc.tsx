import { useState } from "react";
import { Input, InputEmail, InputPassword, InputText, PasswordStrength } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { LongCompletionDemo } from "./input/LongCompletionDemo";
import { NotchBackdrops } from "./input/NotchBackdrops";
import { SearchCompletionDemo } from "./input/SearchCompletionDemo";

const importCode = `import { Input, InputText, InputEmail, InputPassword, PasswordStrength } from "@canop/ui";`;

const baseCode = `function InputDemo() {
  const [value, setValue] = useState("");
  return <Input label="Nom" value={value} onChange={setValue} icon="user" />;
}`;

function InputDemo() {
  const [value, setValue] = useState("");
  return <Input label="Nom" value={value} onChange={setValue} icon="user" />;
}

const typesCode = `function TypesDemo() {
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState("");
  return (
    <>
      <Input label="Téléphone" type="tel" value={phone} onChange={setPhone} />
      <Input label="Quantité" type="number" value={count} onChange={setCount} />
    </>
  );
}`;

function TypesDemo() {
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState("");
  return (
    <>
      <Input label="Téléphone" type="tel" value={phone} onChange={setPhone} />
      <Input label="Quantité" type="number" value={count} onChange={setCount} />
    </>
  );
}

const statesCode = `function StatesDemo() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input
        label="Pseudo"
        value={value}
        onChange={setValue}
        helperText="Visible par les autres membres."
      />
      <Input
        label="Email"
        value={value}
        onChange={setValue}
        error="Adresse email invalide."
      />
      <Input label="Identifiant" value="verrouillé" onChange={() => {}} disabled />
    </>
  );
}`;

function StatesDemo() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input
        label="Pseudo"
        value={value}
        onChange={setValue}
        helperText="Visible par les autres membres."
      />
      <Input label="Email" value={value} onChange={setValue} error="Adresse email invalide." />
      <Input label="Identifiant" value="verrouillé" onChange={() => {}} disabled />
    </>
  );
}

const sizesCode = `function SizesDemo() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input label="Compact" size="small" value={value} onChange={setValue} />
      <Input label="Standard" size="medium" value={value} onChange={setValue} />
    </>
  );
}`;

function SizesDemo() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input label="Compact" size="small" value={value} onChange={setValue} />
      <Input label="Standard" size="medium" value={value} onChange={setValue} />
    </>
  );
}

const backdropsCode = `<Card variant="frosted">
  <Input label="Nom" value={name} onChange={setName} />
</Card>

<Box sx={{ background: "linear-gradient(135deg, var(--canop-palette-primary-light), var(--canop-palette-accent-light))" }}>
  <Input label="Email" value={email} onChange={setEmail} error="Adresse email invalide." />
</Box>`;

const patternCode = `function PatternDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      label="Code postal"
      value={value}
      onChange={setValue}
      pattern={/^\\d{5}$/}
      patternMessage="Cinq chiffres attendus."
    />
  );
}`;

function PatternDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      label="Code postal"
      value={value}
      onChange={setValue}
      pattern={/^\d{5}$/}
      patternMessage="Cinq chiffres attendus."
    />
  );
}

const completionSearchCode = `function searchSuggestion(value: string, signal: AbortSignal) {
  return fetch(\`/api/suggest?q=\${encodeURIComponent(value)}\`, { signal })
    .then((response) => response.json())
    .then((queries: string[]) => queries[0]);
}

function SearchDemo() {
  const [query, setQuery] = useState("");
  return (
    <Input
      label="Rechercher"
      placeholder="Une ville, une recette, un trajet…"
      value={query}
      onChange={setQuery}
      icon="search"
      completion={searchSuggestion}
    />
  );
}`;

const completionLongCode = `<Box sx={{ maxWidth: "18rem" }}>
  <Input
    label="Description du parc"
    value={sentence}
    onChange={setSentence}
    icon="mapLocation"
    completion={LONG_SENTENCES}
  />
</Box>`;

const inputTextCode = `function InputTextDemo() {
  const [value, setValue] = useState("");
  return <InputText label="Nom complet" value={value} onChange={setValue} icon="user" />;
}`;

function InputTextDemo() {
  const [value, setValue] = useState("");
  return <InputText label="Nom complet" value={value} onChange={setValue} icon="user" />;
}

const inputEmailCode = `function InputEmailDemo() {
  const [value, setValue] = useState("");
  return <InputEmail label="Email" value={value} onChange={setValue} required />;
}`;

function InputEmailDemo() {
  const [value, setValue] = useState("");
  return <InputEmail label="Email" value={value} onChange={setValue} required />;
}

const inputPasswordCode = `function InputPasswordDemo() {
  const [value, setValue] = useState("");
  return (
    <InputPassword
      label="Nouveau mot de passe"
      value={value}
      onChange={setValue}
      autoComplete="new-password"
      showStrength
    />
  );
}`;

function InputPasswordDemo() {
  const [value, setValue] = useState("");
  return (
    <InputPassword
      label="Nouveau mot de passe"
      value={value}
      onChange={setValue}
      autoComplete="new-password"
      showStrength
    />
  );
}

const passwordStrengthCode = `function PasswordStrengthDemo() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input label="Mot de passe" type="password" value={value} onChange={setValue} />
      <PasswordStrength value={value} />
    </>
  );
}`;

function PasswordStrengthDemo() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input label="Mot de passe" type="password" value={value} onChange={setValue} />
      <PasswordStrength value={value} />
    </>
  );
}

const fr = {
  intro:
    "Le champ de saisie contrôlé de CanopUI, bâti sur MUI TextField. Il gère le libellé flottant, les icônes, les messages d'aide et d'erreur, ainsi qu'une validation intégrée. Des variantes prêtes à l'emploi couvrent le texte, l'email et le mot de passe.",
  sections: {
    base: {
      title: "Champ de base",
      demoTitle: "Saisie contrôlée",
      demoDescription:
        "value et onChange pilotent le champ. La prop icon ajoute une icône en tête.",
    },
    types: {
      title: "Types de saisie",
      demoTitle: "text, email, password, tel, url, number",
      demoDescription:
        "La prop type adapte le clavier mobile et la validation native du navigateur.",
    },
    states: {
      title: "États",
      demoTitle: "Aide, erreur et désactivation",
      demoDescription:
        "helperText affiche un message d'aide, error force l'état d'erreur, disabled neutralise le champ.",
    },
    sizes: { title: "Tailles", demoTitle: "small et medium" },
    backdrops: {
      title: "Sur n'importe quel fond",
      demoTitle: "Encoche du libellé découpée dans le contour",
      demoDescription:
        "Le libellé flottant ne repose plus sur un aplat de la couleur du thème : le trait du contour s'interrompt sous lui, et le fond réel apparaît à travers, qu'il s'agisse d'une carte tonale, d'une couleur pleine, d'un dégradé, d'une image ou d'un verre liquide sur vidéo. La largeur de l'encoche suit celle du libellé, et s'ouvre en même temps qu'il remonte.",
      backgrounds: {
        theme: "Fond du thème",
        tonalCard: "Carte tonale (warning)",
        solid: "Couleur pleine (accent.light)",
        gradient: "Dégradé primary.light → accent.light",
        image: "Image (affiche de la canopée)",
        frosted: "Verre liquide sur la canopée animée",
      },
      fields: {
        empty: "Vide",
        filled: "Rempli",
        filledValue: "Martin Queval",
        longLabel:
          "Adresse de facturation complète du titulaire du compte, telle qu'elle figure sur le dernier relevé",
        focused: "Focus",
        error: "Erreur",
        errorValue: "martin@",
        errorMessage: "Adresse email invalide.",
      },
    },
    pattern: {
      title: "Validation par motif",
      demoTitle: "pattern et patternMessage",
      demoDescription:
        "La validation s'exécute à la perte de focus et affiche patternMessage si la valeur ne correspond pas.",
    },
    completion: {
      title: "Autocomplétion en ligne",
      description:
        "Avec completion, le champ propose la suite de la saisie en gris, au curseur, comme une barre de recherche. C'est la primitive : la source est une liste de textes ou une fonction, et onChange reçoit le texte. Pour choisir parmi des options qui ont une valeur et un libellé, utilisez Autocomplete, qui repose sur elle ; sa page détaille aussi tailles, libellé et raccourcis clavier. La correspondance ignore la casse et les accents ; completionNormalize la remplace.",
      search: {
        demoTitle: "Barre de recherche",
        demoDescription:
          "Tapez « mai », « mét » ou « hor ». La source est une fonction asynchrone : chaque frappe annule la requête précédente grâce au signal, et la suggestion en cours reste affichée tant qu'elle prolonge la saisie.",
        label: "Rechercher",
        placeholder: "Une ville, une recette, un trajet…",
      },
      long: {
        demoTitle: "Texte qui fait défiler le champ",
        demoDescription:
          "Cliquez en fin de texte puis tapez : le champ défile vers la droite et le calque suit son défilement, sans aucun décalage. → accepte toute la phrase, Ctrl + → un mot à la fois.",
        label: "Description du parc",
      },
    },
    inputText: {
      title: "InputText",
      description:
        "Raccourci pour un champ de type text. Reprend toutes les props d'Input hormis type.",
      demoTitle: "Champ texte",
    },
    inputEmail: {
      title: "InputEmail",
      description:
        "Champ email prêt à l'emploi : icône dédiée, autocomplete et validation du format d'adresse intégrés.",
      demoTitle: "Champ email",
    },
    inputPassword: {
      title: "InputPassword",
      description:
        "Champ mot de passe avec bouton d'affichage. Avec showStrength, il impose et visualise les critères de robustesse.",
      demoTitle: "Mot de passe avec robustesse",
    },
    passwordStrength: {
      title: "PasswordStrength",
      description:
        "Indicateur autonome de robustesse. Il visualise en temps réel les critères satisfaits par une valeur.",
      demoTitle: "Indicateur de robustesse",
    },
    apiInput: { title: "API — Input" },
    apiInputPassword: {
      title: "API — InputPassword",
      description:
        "InputPassword reprend les props d'Input (hors type, icon et validate) et ajoute :",
    },
    apiPasswordStrength: { title: "API — PasswordStrength" },
  },
  props: {
    label: "Libellé flottant du champ.",
    value: "Valeur contrôlée du champ.",
    onChange: "Appelé à chaque saisie avec la nouvelle valeur.",
    type: "Type HTML du champ. En mode password, un bouton d'affichage est ajouté.",
    name: "Attribut name natif, utile lors d'une soumission de formulaire.",
    placeholder: "Texte indicatif affiché quand le champ est vide.",
    helperText: "Message d'aide affiché sous le champ, remplacé par l'erreur le cas échéant.",
    error: "Message d'erreur contrôlé ; passe le champ en état d'erreur.",
    required: "Marque le champ comme obligatoire et alimente la validation intégrée.",
    disabled: "Désactive le champ.",
    fullWidth: "Étire le champ sur toute la largeur disponible.",
    autoComplete: "Valeur de l'attribut autocomplete natif.",
    autoFocus: "Place le focus sur le champ au montage.",
    inputRef:
      "Référence sur le champ natif, pour lui rendre le focus sans le remonter. autoFocus ne joue qu'au montage : reprendre la main sur un champ déjà présent — après chaque question d'un quiz, après une erreur de saisie — obligeait à poser une key changeante, donc à détruire et reconstruire le champ. Le focus revient, mais avec lui l'animation d'entrée du libellé, la perte de l'état de validation locale et une transition qui n'a aucune raison d'être rejouée.",
    size: "Densité du champ.",
    icon: "Icône affichée en début de champ.",
    pattern: "Expression régulière de validation appliquée au blur.",
    patternMessage: "Message affiché lorsque la valeur ne respecte pas pattern.",
    validate: "Validation personnalisée prioritaire sur pattern ; renvoie l'erreur ou null.",
    completion:
      "Active l'autocomplétion en ligne : une liste (la première entrée qui commence par la saisie, sans tenir compte de la casse ni des accents) ou une fonction qui renvoie la suggestion complète, éventuellement dans une promesse, avec un signal d'annulation. Changer de fonction prend effet à la frappe suivante ; une exception ou une promesse rejetée valent « aucune suggestion ». Une saisie égale à une suggestion n'affiche rien. Types text, tel et url uniquement ; autoComplete passe à off par défaut.",
    completionNormalize:
      "Remplace la comparaison entre la saisie et la suggestion, appliquée des deux côtés. Avec foldForSearch, les séparateurs sont aussi ignorés : « cote d » complète « Côte-d'Or ».",
    onCompletionAccept:
      "Appelé avec la suggestion entière quand elle est acceptée : Tab, Entrée, →, Ctrl + → sur son dernier mot ou un toucher sur le texte gris. Une saisie qui finit par égaler la suggestion n'en est pas une. Sans suggestion visible, Entrée garde son rôle natif.",
    ariaLabel: "Nom accessible explicite, pour un champ sans libellé visible.",
    onBlur: "Appelé quand le champ perd le focus, après la validation intégrée.",
    showStrength:
      "Affiche l'indicateur de robustesse et active la validation des critères de sécurité.",
    strengthValue: "Mot de passe évalué en temps réel selon les critères de sécurité.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI controlled text field, built on MUI TextField. It handles the floating label, icons, helper and error messages, as well as built-in validation. Ready-to-use variants cover text, email and password.",
  sections: {
    base: {
      title: "Basic field",
      demoTitle: "Controlled input",
      demoDescription: "value and onChange drive the field. The icon prop adds a leading icon.",
    },
    types: {
      title: "Input types",
      demoTitle: "text, email, password, tel, url, number",
      demoDescription:
        "The type prop tailors the mobile keyboard and the browser's native validation.",
    },
    states: {
      title: "States",
      demoTitle: "Helper, error and disabled",
      demoDescription:
        "helperText shows a helper message, error forces the error state, disabled neutralizes the field.",
    },
    sizes: { title: "Sizes", demoTitle: "small and medium" },
    backdrops: {
      title: "On any background",
      demoTitle: "Label notch cut out of the outline",
      demoDescription:
        "The floating label no longer sits on a patch of the theme color: the outline stroke breaks beneath it and the actual background shows through, be it a tonal card, a solid color, a gradient, an image or liquid glass over video. The notch width follows the label and opens as the label floats up.",
      backgrounds: {
        theme: "Theme background",
        tonalCard: "Tonal card (warning)",
        solid: "Solid color (accent.light)",
        gradient: "Gradient primary.light → accent.light",
        image: "Image (canopy poster)",
        frosted: "Liquid glass over the animated canopy",
      },
      fields: {
        empty: "Empty",
        filled: "Filled",
        filledValue: "Martin Queval",
        longLabel:
          "Full billing address of the account holder, exactly as it appears on the latest statement",
        focused: "Focus",
        error: "Error",
        errorValue: "martin@",
        errorMessage: "Invalid email address.",
      },
    },
    pattern: {
      title: "Pattern validation",
      demoTitle: "pattern and patternMessage",
      demoDescription:
        "Validation runs on blur and displays patternMessage when the value does not match.",
    },
    completion: {
      title: "Inline completion",
      description:
        "With completion, the field suggests the rest of the entry in gray, at the caret, like a search bar. This is the primitive: the source is a list of texts or a function, and onChange receives the text. To pick among options that carry a value and a label, use Autocomplete, which builds on it; its page also covers sizes, label and keyboard shortcuts. Matching ignores case and accents; completionNormalize replaces it.",
      search: {
        demoTitle: "Search bar",
        demoDescription:
          "Type “mai”, “mét” or “hor”. The source is an async function: each keystroke cancels the previous request through the signal, and the current suggestion stays visible as long as it extends the entry.",
        label: "Search",
        placeholder: "A city, a recipe, a trip…",
      },
      long: {
        demoTitle: "Text that scrolls the field",
        demoDescription:
          "Click at the end of the text and type: the field scrolls right and the layer follows its scroll, with no offset at all. → accepts the whole sentence, Ctrl + → one word at a time.",
        label: "Park description",
      },
    },
    inputText: {
      title: "InputText",
      description: "Shortcut for a text field. Reuses all Input props except type.",
      demoTitle: "Text field",
    },
    inputEmail: {
      title: "InputEmail",
      description:
        "Ready-to-use email field: dedicated icon, autocomplete and address-format validation built in.",
      demoTitle: "Email field",
    },
    inputPassword: {
      title: "InputPassword",
      description:
        "Password field with a reveal button. With showStrength, it enforces and visualizes the strength criteria.",
      demoTitle: "Password with strength",
    },
    passwordStrength: {
      title: "PasswordStrength",
      description:
        "Standalone strength indicator. It visualizes in real time the criteria satisfied by a value.",
      demoTitle: "Strength indicator",
    },
    apiInput: { title: "API — Input" },
    apiInputPassword: {
      title: "API — InputPassword",
      description:
        "InputPassword reuses the Input props (except type, icon and validate) and adds:",
    },
    apiPasswordStrength: { title: "API — PasswordStrength" },
  },
  props: {
    label: "Floating label of the field.",
    value: "Controlled value of the field.",
    onChange: "Called on each keystroke with the new value.",
    type: "HTML type of the field. In password mode, a reveal button is added.",
    name: "Native name attribute, useful when submitting a form.",
    placeholder: "Placeholder text shown when the field is empty.",
    helperText: "Helper message shown below the field, replaced by the error when present.",
    error: "Controlled error message; puts the field in an error state.",
    required: "Marks the field as required and feeds the built-in validation.",
    disabled: "Disables the field.",
    fullWidth: "Stretches the field across the available width.",
    autoComplete: "Value of the native autocomplete attribute.",
    autoFocus: "Focuses the field on mount.",
    inputRef:
      "Ref on the native field, to hand focus back without remounting it. autoFocus only plays on mount: taking hold of a field that is already there — after each quiz question, after a typing mistake — required a changing key, hence destroying and rebuilding the field. Focus does come back, but so does the label's entry animation, the loss of local validation state and a transition with no reason to replay.",
    size: "Density of the field.",
    icon: "Icon displayed at the start of the field.",
    pattern: "Validation regular expression applied on blur.",
    patternMessage: "Message shown when the value does not match pattern.",
    validate: "Custom validation taking precedence over pattern; returns the error or null.",
    completion:
      "Enables inline completion: a list (the first entry starting with the input, ignoring case and accents) or a function returning the full suggestion, possibly in a promise, with an abort signal. Switching functions takes effect on the next keystroke; an exception or a rejected promise means no suggestion. An entry equal to a suggestion shows nothing. Text, tel and url types only; autoComplete defaults to off.",
    completionNormalize:
      'Replaces how the entry and the suggestion are compared, applied on both sides. With foldForSearch, separators are ignored too: "cote d" completes "Côte-d\'Or".',
    onCompletionAccept:
      "Called with the whole suggestion when it is accepted: Tab, Enter, →, Ctrl + → on its last word or a tap on the gray text. Typing until the entry equals the suggestion does not count. With no visible suggestion, Enter keeps its native role.",
    ariaLabel: "Explicit accessible name, for a field with no visible label.",
    onBlur: "Called when the field loses focus, after the built-in validation.",
    showStrength: "Shows the strength indicator and enables validation of the security criteria.",
    strengthValue: "Password evaluated in real time against the security criteria.",
  },
};

const texts = { fr, en };

export default function InputDoc() {
  const t = texts[useDocLocale()];
  const inputRows: PropRow[] = [
    {
      name: "label",
      type: "string",
      required: true,
      description: t.props.label,
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
      name: "type",
      type: '"text" | "email" | "password" | "tel" | "url" | "number"',
      defaultValue: '"text"',
      description: t.props.type,
    },
    {
      name: "name",
      type: "string",
      description: t.props.name,
    },
    {
      name: "placeholder",
      type: "string",
      description: t.props.placeholder,
    },
    {
      name: "helperText",
      type: "string",
      description: t.props.helperText,
    },
    {
      name: "error",
      type: "string | null",
      description: t.props.error,
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: t.props.required,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "true",
      description: t.props.fullWidth,
    },
    {
      name: "autoComplete",
      type: "string",
      description: t.props.autoComplete,
    },
    {
      name: "autoFocus",
      type: "boolean",
      defaultValue: "false",
      description: t.props.autoFocus,
    },
    {
      name: "inputRef",
      type: "Ref<HTMLInputElement>",
      defaultValue: "—",
      description: t.props.inputRef,
    },
    {
      name: "size",
      type: '"small" | "medium"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "icon",
      type: "CanopIconName",
      description: t.props.icon,
    },
    {
      name: "pattern",
      type: "RegExp",
      description: t.props.pattern,
    },
    {
      name: "patternMessage",
      type: "string",
      description: t.props.patternMessage,
    },
    {
      name: "validate",
      type: "(value: string) => string | null",
      description: t.props.validate,
    },
    {
      name: "completion",
      type: "readonly string[] | (value: string, signal: AbortSignal) => string | undefined | PromiseLike<string | undefined>",
      description: t.props.completion,
    },
    {
      name: "completionNormalize",
      type: "(text: string) => string",
      defaultValue: "—",
      description: t.props.completionNormalize,
    },
    {
      name: "onCompletionAccept",
      type: "(suggestion: string) => void",
      defaultValue: "—",
      description: t.props.onCompletionAccept,
    },
    {
      name: "ariaLabel",
      type: "string",
      defaultValue: "—",
      description: t.props.ariaLabel,
    },
    {
      name: "onBlur",
      type: "() => void",
      defaultValue: "—",
      description: t.props.onBlur,
    },
  ];
  const inputPasswordRows: PropRow[] = [
    {
      name: "showStrength",
      type: "boolean",
      defaultValue: 'autoComplete === "new-password"',
      description: t.props.showStrength,
    },
  ];
  const passwordStrengthRows: PropRow[] = [
    {
      name: "value",
      type: "string",
      required: true,
      description: t.props.strengthValue,
    },
  ];
  return (
    <DocPage title="Input" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.base.title}>
        <DemoCard
          title={t.sections.base.demoTitle}
          description={t.sections.base.demoDescription}
          code={baseCode}
          align="stretch"
        >
          <InputDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.types.title}>
        <DemoCard
          title={t.sections.types.demoTitle}
          description={t.sections.types.demoDescription}
          code={typesCode}
          align="stretch"
        >
          <TypesDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.states.title}>
        <DemoCard
          title={t.sections.states.demoTitle}
          description={t.sections.states.demoDescription}
          code={statesCode}
          align="stretch"
        >
          <StatesDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes.title}>
        <DemoCard title={t.sections.sizes.demoTitle} code={sizesCode} align="stretch">
          <SizesDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.backdrops.title}>
        <DemoCard
          title={t.sections.backdrops.demoTitle}
          description={t.sections.backdrops.demoDescription}
          code={backdropsCode}
          align="stretch"
        >
          <NotchBackdrops
            labels={{ ...t.sections.backdrops.backgrounds, fields: t.sections.backdrops.fields }}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.pattern.title}>
        <DemoCard
          title={t.sections.pattern.demoTitle}
          description={t.sections.pattern.demoDescription}
          code={patternCode}
          align="stretch"
        >
          <PatternDemo />
        </DemoCard>
      </DocSection>
      <DocSection
        title={t.sections.completion.title}
        description={t.sections.completion.description}
      >
        <DemoCard
          title={t.sections.completion.search.demoTitle}
          description={t.sections.completion.search.demoDescription}
          code={completionSearchCode}
          align="stretch"
        >
          <SearchCompletionDemo
            label={t.sections.completion.search.label}
            placeholder={t.sections.completion.search.placeholder}
          />
        </DemoCard>
        <DemoCard
          title={t.sections.completion.long.demoTitle}
          description={t.sections.completion.long.demoDescription}
          code={completionLongCode}
          align="stretch"
        >
          <LongCompletionDemo label={t.sections.completion.long.label} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.inputText.title} description={t.sections.inputText.description}>
        <DemoCard title={t.sections.inputText.demoTitle} code={inputTextCode} align="stretch">
          <InputTextDemo />
        </DemoCard>
      </DocSection>
      <DocSection
        title={t.sections.inputEmail.title}
        description={t.sections.inputEmail.description}
      >
        <DemoCard title={t.sections.inputEmail.demoTitle} code={inputEmailCode} align="stretch">
          <InputEmailDemo />
        </DemoCard>
      </DocSection>
      <DocSection
        title={t.sections.inputPassword.title}
        description={t.sections.inputPassword.description}
      >
        <DemoCard
          title={t.sections.inputPassword.demoTitle}
          code={inputPasswordCode}
          align="stretch"
        >
          <InputPasswordDemo />
        </DemoCard>
      </DocSection>
      <DocSection
        title={t.sections.passwordStrength.title}
        description={t.sections.passwordStrength.description}
      >
        <DemoCard
          title={t.sections.passwordStrength.demoTitle}
          code={passwordStrengthCode}
          align="stretch"
        >
          <PasswordStrengthDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.apiInput.title}>
        <PropsTable rows={inputRows} />
      </DocSection>
      <DocSection
        title={t.sections.apiInputPassword.title}
        description={t.sections.apiInputPassword.description}
      >
        <PropsTable rows={inputPasswordRows} />
      </DocSection>
      <DocSection title={t.sections.apiPasswordStrength.title}>
        <PropsTable rows={passwordStrengthRows} />
      </DocSection>
    </DocPage>
  );
}
