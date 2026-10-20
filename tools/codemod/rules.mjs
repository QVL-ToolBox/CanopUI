/**
 * Regles de renommage du rebrand CanopUI 3.0 : `Ch*` -> `Canop*`.
 *
 * Ce module est la SOURCE DE VERITE unique du codemod. Il ne contient aucune
 * liste figee de symboles : uniquement des MOTIFS, valides contre l'etat reel
 * du code (cf. README, section "Motif retenu").
 *
 * Regle d'or : on ne renomme QUE des prefixes, jamais un `Ch` en milieu de mot
 * (hors verbes explicitement autorises ci-dessous). Un bug de ce type
 * (`fileUploadSource` -> `fileChUploadSource`) a deja casse un build.
 */

/**
 * Symboles dont le renommage ne suit pas un motif mecanique.
 * Ici `CH_UI_VERSION` perd son segment `UI_`, ce qu'aucune regle de prefixe
 * ne peut deviner.
 */
export const EXPLICIT_IDENTIFIERS = new Map([["CH_UI_VERSION", "CANOP_VERSION"]]);

/**
 * Verbes/prefixes camelCase autorises devant `Ch<Majuscule>`.
 *
 * Liste FERMEE et volontairement courte. Une regle generique
 * `^[a-z]+Ch(?=[A-Z])` matcherait `dispatchChXxx`, `searchChXxx`, ... chez un
 * consommateur : trop de mots anglais se terminent par "ch". Tout identifiant
 * contenant `Ch<Majuscule>` en milieu de mot sans verbe autorise est SIGNALE
 * dans le rapport, jamais renomme d'office.
 */
export const DEFAULT_VERB_PREFIXES = ["use", "create", "build", "make", "with", "render"];

/**
 * Construit les regles d'identifiants. `verbs` peut etre etendu via --verb.
 * L'ordre compte : la regle la plus specifique (verbe) est evaluee en premier.
 */
export function buildIdentifierRules(verbs = DEFAULT_VERB_PREFIXES) {
  const verbAlternation = verbs.join("|");
  return [
    {
      id: "verb-prefix",
      label: "valeur camelCase prefixee d'un verbe (useChTheme -> useCanopTheme)",
      // ^(use|create|...)Ch suivi d'une MAJUSCULE : `useChecklist` n'est pas touche.
      pattern: new RegExp(`^(${verbAlternation})Ch(?=[A-Z])`),
      apply: (name) => name.replace(new RegExp(`^(${verbAlternation})Ch`), "$1Canop"),
    },
    {
      id: "pascal-prefix",
      label: "type / composant PascalCase (ChButtonProps -> CanopButtonProps)",
      // ^Ch suivi d'une MAJUSCULE : exclut Checkbox, Children, Chip, Chivo,
      // ChangeEvent, Chart*, Chat*, Check* ... (tous en `Ch` + minuscule).
      pattern: /^Ch(?=[A-Z])/,
      apply: (name) => name.replace(/^Ch/, "Canop"),
    },
    {
      id: "camel-prefix",
      label: "valeur camelCase (chTheme -> canopTheme)",
      // ^ch suivi d'une MAJUSCULE : exclut chunkSize, children, checked, ...
      pattern: /^ch(?=[A-Z])/,
      apply: (name) => name.replace(/^ch/, "canop"),
    },
  ];
}

/**
 * Detecte un `Ch<Majuscule>` en MILIEU d'identifiant non couvert par un verbe
 * autorise. Ces cas sont remontes dans le rapport pour arbitrage humain.
 */
export function isAmbiguousMidWord(name, verbs = DEFAULT_VERB_PREFIXES) {
  if (!/[a-z0-9_]Ch[A-Z]/.test(name)) return false;
  return !new RegExp(`^(${verbs.join("|")})Ch[A-Z]`).test(name);
}

/**
 * Renomme un identifiant, ou renvoie null s'il est hors perimetre.
 * @returns {{to: string, rule: string}|null}
 */
export function renameIdentifier(name, verbs = DEFAULT_VERB_PREFIXES) {
  const explicit = EXPLICIT_IDENTIFIERS.get(name);
  if (explicit) return { to: explicit, rule: "explicit" };
  for (const rule of buildIdentifierRules(verbs)) {
    if (rule.pattern.test(name)) return { to: rule.apply(name), rule: rule.id };
  }
  return null;
}

/**
 * Proprietes de configuration dont la VALEUR porte le prefixe de marque sous
 * une forme que les regles textuelles ne peuvent structurellement pas voir.
 *
 * Cas critique : `cssVariables: { cssVarPrefix: "ch" }` dans le theme MUI.
 * Cette unique chaine `"ch"` — sans `--` ni `-` — engendre a l'execution la
 * TOTALITE des `var(--ch-palette-*)`, `var(--ch-spacing-*)`, etc. La rater,
 * c'est renommer les 477 usages `var(--ch-…)` en `--canop-…` alors que MUI
 * continue d'emettre `--ch-…` : tout le theme tombe silencieusement sur les
 * valeurs de repli. Detecte ici par AST (nom de propriete + valeur exacte).
 */
export const CONFIG_VALUE_RENAMES = [
  {
    property: "cssVarPrefix",
    from: "ch",
    to: "canop",
    why: "prefixe des CSS variables generees par MUI (source de verite des var(--ch-*))",
  },
];

/**
 * Passes TEXTUELLES, appliquees apres la passe AST.
 *
 * Chaque motif est ancre sur un delimiteur non ambigu (`--`, un guillemet
 * ouvrant) pour ne jamais matcher `ch` en prose ou dans un mot.
 * L'ordre d'application est celui du tableau.
 */
export const TEXT_RULES = [
  {
    id: "css-var",
    category: "CSS",
    label: "variable CSS --ch-* -> --canop-*",
    // Ancre sur `--`, suivi obligatoire d'un caractere de nom : `--ch-` seul
    // ou `--check-*` ne matchent pas.
    pattern: /--ch-(?=[a-z0-9])/g,
    replace: "--canop-",
    enabledByDefault: true,
  },
  {
    id: "i18n-key",
    category: "i18n",
    label: 'cle i18n "ch.*" -> "canop.*"',
    // Ancre sur le guillemet OUVRANT (", ' ou `) : seule une chaine qui
    // COMMENCE par `ch.` matche. La prose ("...ch. 3", "arch.") est epargnee,
    // et le template litteral `ch.error.${code}` est bien couvert.
    pattern: /(["'`])ch\.(?=[a-zA-Z])/g,
    replace: "$1canop.",
    enabledByDefault: true,
  },
  {
    id: "storage-key",
    category: "localStorage",
    label: "cle localStorage ch-theme-mode / ch-locale -> canop-*",
    // Egalite STRICTE sur la chaine complete (guillemets identiques de part et
    // d'autre) : on ne touche pas aux ids DOM `ch-lightbox-backdrop` & co.
    pattern: /(["'])ch-(theme-mode|locale)\1/g,
    replace: "$1canop-$2$1",
    enabledByDefault: true,
  },
  {
    id: "dom-prefix",
    category: "DOM",
    label: 'id DOM / layoutId / key "ch-*" -> "canop-*" (HORS PERIMETRE par defaut)',
    // Desactive par defaut : ces chaines sont des ids DOM, des cles React et
    // des layoutId Motion, parfois valeurs par defaut de props publiques
    // (SlidingIndicator.layoutId). Les renommer casse les selecteurs CSS et les
    // tests des consommateurs. Activable via --dom-prefix.
    pattern: /(["'])ch-(?=[a-z0-9])/g,
    replace: "$1canop-",
    enabledByDefault: false,
  },
];

/** Extensions traitees par la passe AST (ts-morph). */
export const AST_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];

/** Extensions traitees uniquement par les passes textuelles. */
export const TEXT_ONLY_EXTENSIONS = [
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".html",
  ".md",
  ".mdx",
  ".json",
];
