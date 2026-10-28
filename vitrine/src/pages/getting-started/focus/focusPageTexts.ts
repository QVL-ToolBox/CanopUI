import type { DocLocale } from "../../../i18n/useDocLocale";
import type { FocusActionsLabels } from "./FocusActionsDemo";
import type { FocusChoicesLabels } from "./FocusChoicesDemo";
import type { FocusFieldsLabels } from "./FocusFieldsDemo";
import type { FocusNavigationLabels } from "./FocusNavigationDemo";

export interface FocusPageTexts {
  title: string;
  intro: string;
  ruleTitle: string;
  ruleDescription: string;
  ruleHowTo: string;
  activations: (count: number) => string;
  actionsTitle: string;
  actionsDescription: string;
  actions: FocusActionsLabels;
  choicesTitle: string;
  choicesDescription: string;
  choices: FocusChoicesLabels;
  navigationTitle: string;
  navigationDescription: string;
  navigation: FocusNavigationLabels;
  fieldsTitle: string;
  fieldsDescription: string;
  fields: FocusFieldsLabels;
  helperTitle: string;
  helperDescription: string;
}

const fr: FocusPageTexts = {
  title: "Focus et clavier",
  intro:
    "Les composants CanopUI n'ont pas de style de focus. Un clic, un toucher ou un focus posé par le code ne changent rien à l'écran ; seuls le survol et l'appui ont un rendu.",
  ruleTitle: "La règle",
  ruleDescription:
    "Au clavier, un composant prend exactement son style de survol, rien de plus : pas d'anneau, pas de halo, pas de couleur propre. Un composant sans survol ne change pas d'aspect.",
  ruleHowTo:
    "Pour vérifier : cliquez sur chaque élément, aucun anneau ne doit apparaître. Puis parcourez la page avec Tab : chaque élément doit ressembler à son survol, à l'identique.",
  activations: (count) => `Activations : ${count}`,
  actionsTitle: "Actions",
  actionsDescription:
    "Boutons, boutons d'icône et lien prennent leur survol au clavier. Pressable n'a pas de survol : il ne change pas au focus.",
  actions: {
    group: "Actions",
    primary: "Principal",
    tonal: "Tonal",
    ghost: "Fantôme",
    text: "Texte",
    add: "Ajouter",
    favorite: "Mettre en favori",
    link: "Lien",
    swatch: "Pastille",
  },
  choicesTitle: "Choix",
  choicesDescription:
    "Le segment non sélectionné s'éclaircit comme au survol, la case à cocher prend son halo de survol, le curseur son halo. Interrupteurs et sélecteur de thème, sans survol, restent identiques.",
  choices: {
    group: "Choix",
    view: "Affichage",
    grid: "Grille",
    list: "Liste",
    notifications: "Notifications",
    accept: "J'accepte",
    volume: "Volume",
  },
  navigationTitle: "Navigation",
  navigationDescription:
    "Le fil d'Ariane se colore et se souligne, la carte interactive se soulève et pousse sa flèche, comme au survol.",
  navigation: {
    group: "Navigation",
    home: "Accueil",
    docs: "Documentation",
    current: "Focus",
    cardTitle: "Carte interactive",
    cardSubtitle: "Survol et clavier, même rendu",
    cardBody: "Tab jusqu'ici : elle se soulève comme sous le pointeur.",
  },
  fieldsTitle: "Champs",
  fieldsDescription:
    "Un champ en cours de saisie ne change pas de style : ni bordure ni libellé colorés, le curseur texte suffit. Le sélecteur, qui n'est pas un champ texte, prend son survol au clavier.",
  fields: {
    group: "Champs",
    name: "Nom",
    fruit: "Fruit",
    apple: "Pomme",
    pear: "Poire",
    plum: "Prune",
  },
  helperTitle: "Dans un portail",
  helperDescription:
    "Pour un élément maison, les mêmes outils que la librairie : withoutFocusRing retire l'anneau du navigateur, hoverOrKeyboardFocus vise le survol et le focus clavier d'un seul sélecteur.",
};

const en: FocusPageTexts = {
  title: "Focus and keyboard",
  intro:
    "CanopUI components have no focus style. A click, a tap or a focus set by code changes nothing on screen; only hover and press have a rendering.",
  ruleTitle: "The rule",
  ruleDescription:
    "From the keyboard, a component takes exactly its hover style, nothing more: no ring, no halo, no colour of its own. A component without hover does not change.",
  ruleHowTo:
    "To check: click every element, no ring should appear. Then walk the page with Tab: every element should look like its hover, identically.",
  activations: (count) => `Activations: ${count}`,
  actionsTitle: "Actions",
  actionsDescription:
    "Buttons, icon buttons and link take their hover from the keyboard. Pressable has no hover: it does not change on focus.",
  actions: {
    group: "Actions",
    primary: "Primary",
    tonal: "Tonal",
    ghost: "Ghost",
    text: "Text",
    add: "Add",
    favorite: "Add to favourites",
    link: "Link",
    swatch: "Swatch",
  },
  choicesTitle: "Choices",
  choicesDescription:
    "The unselected segment brightens as on hover, the checkbox takes its hover halo, the slider its halo. Switches and the theme toggle, which have no hover, stay identical.",
  choices: {
    group: "Choices",
    view: "View",
    grid: "Grid",
    list: "List",
    notifications: "Notifications",
    accept: "I agree",
    volume: "Volume",
  },
  navigationTitle: "Navigation",
  navigationDescription:
    "The breadcrumb colours and underlines, the interactive card lifts and nudges its arrow, as on hover.",
  navigation: {
    group: "Navigation",
    home: "Home",
    docs: "Documentation",
    current: "Focus",
    cardTitle: "Interactive card",
    cardSubtitle: "Hover and keyboard, same rendering",
    cardBody: "Tab to here: it lifts as under the pointer.",
  },
  fieldsTitle: "Fields",
  fieldsDescription:
    "A field being edited does not change style: no coloured border or label, the text caret is enough. The select, which is not a text field, takes its hover from the keyboard.",
  fields: {
    group: "Fields",
    name: "Name",
    fruit: "Fruit",
    apple: "Apple",
    pear: "Pear",
    plum: "Plum",
  },
  helperTitle: "In a portal",
  helperDescription:
    "For a home-made element, the same tools as the library: withoutFocusRing removes the browser ring, hoverOrKeyboardFocus targets hover and keyboard focus in a single selector.",
};

export const focusPageTexts: Record<DocLocale, FocusPageTexts> = { fr, en };
