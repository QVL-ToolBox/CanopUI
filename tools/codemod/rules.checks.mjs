/**
 * Tests du motif de renommage.
 *
 * Les contre-exemples ci-dessous ne sont pas inventes : ils ont ete extraits de
 * `src/` de CanopUI (branche dette/lot-0) via
 *   grep -rhoE '\bCh[a-z][A-Za-z0-9_]*' src/ --include=*.ts --include=*.tsx | sort -u
 * C'est ce qui garantit que le motif ne casse ni Checkbox, ni Chip, ni Chivo.
 *
 * Lancer : node rules.checks.mjs
 */

import { renameIdentifier, isAmbiguousMidWord, TEXT_RULES } from "./rules.mjs";

let failures = 0;

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) {
    failures += 1;
    console.error(
      "  ECHEC  " + label + "\n         attendu: " + expected + "\n         obtenu : " + actual,
    );
  }
  return ok;
}

function renamesTo(input, expected) {
  const result = renameIdentifier(input);
  check(input, result ? result.to : null, expected);
}

function untouched(input) {
  const result = renameIdentifier(input);
  check(input + " (doit rester intact)", result ? result.to : null, null);
}

console.log("\n--- Types PascalCase : Ch + MAJUSCULE -> Canop ---");
[
  ["ChButtonProps", "CanopButtonProps"],
  ["ChThemeProvider", "CanopThemeProvider"],
  ["ChI18nProvider", "CanopI18nProvider"],
  ["ChI18nContext", "CanopI18nContext"],
  ["ChIconName", "CanopIconName"],
  ["ChApiError", "CanopApiError"],
  ["ChCheckboxProps", "CanopCheckboxProps"], // Ch + C : le mot suivant commence par Ch
  ["ChChunkRange", "CanopChunkRange"],
  ["ChUploadSource", "CanopUploadSource"],
  ["ChTokens", "CanopTokens"],
].forEach(([from, to]) => renamesTo(from, to));

console.log("--- CONTRE-EXEMPLES releves dans src/ : Ch + minuscule -> INTACT ---");
[
  "Checkbox",
  "Children",
  "Chip",
  "Chivo",
  "ChangeEvent",
  "Check",
  "CheckSolid",
  "CheckOutline",
  "ChatSolid",
  "ChatOutline",
  "ChartPieSolid",
  "ChartPieOutline",
  "Champ",
  "Changer",
  "Chaque",
  "Chargement",
  "Chemin",
  "Chercher",
].forEach(untouched);

console.log("--- Valeurs camelCase : ch + MAJUSCULE -> canop ---");
[
  ["chTheme", "canopTheme"],
  ["chBaseMessages", "canopBaseMessages"],
  ["chErrorMessages", "canopErrorMessages"],
].forEach(([from, to]) => renamesTo(from, to));

console.log("--- CONTRE-EXEMPLES releves dans src/ : ch + minuscule -> INTACT ---");
[
  "children",
  "checked",
  "chunkSize",
  "chunks",
  "chunkIndex",
  "chunkCount",
  "checkbox",
  "checksum",
  "childActive",
  "childrenCount",
  "chart",
  "chat",
  "channel",
  "change",
].forEach(untouched);

console.log("--- Verbes autorises devant Ch + MAJUSCULE ---");
[
  ["useChTheme", "useCanopTheme"],
  ["createChTheme", "createCanopTheme"],
  ["buildChCssVariables", "buildCanopCssVariables"],
].forEach(([from, to]) => renamesTo(from, to));

console.log("--- Renommage explicite (non mecanique) ---");
renamesTo("CH_UI_VERSION", "CANOP_VERSION");

console.log("--- NON-REGRESSION : jamais d'insertion en milieu de mot ---");
// Le bug fileUploadSource -> fileChUploadSource : aucun de ces noms ne bouge.
[
  "fileUploadSource",
  "fileUploadTransport",
  "uploadSource",
  "dispatchChanges",
  "fetchChartData",
  "searchChipList",
  "matchChecksum",
  "switchChannel",
  "branchName",
  "launchCheck",
].forEach(untouched);

console.log("--- NON-REGRESSION : types de hooks Use* sans prefixe (renommes cette semaine) ---");
["UseToolbarResult", "UseRouteGuardParams", "UseUploadResult", "UseThemeResult"].forEach(untouched);

console.log("--- Ambiguites signalees, jamais renommees ---");
check("dispatchChUnknown est ambigu", isAmbiguousMidWord("dispatchChUnknown"), true);
check("searchChIndex est ambigu", isAmbiguousMidWord("searchChIndex"), true);
check("useChTheme n'est PAS ambigu", isAmbiguousMidWord("useChTheme"), false);
check("fetchChartData n'est PAS ambigu", isAmbiguousMidWord("fetchChartData"), false);
check("ChButton n'est PAS ambigu", isAmbiguousMidWord("ChButton"), false);

console.log("--- Garde-fou des chaines : seul un identifiant complet est reecrit ---");
// Regression : "chRowExit, chRowExit" etait partiellement reecrit en
// "canopRowExit, chRowExit", et le message d'erreur "useChTheme doit etre..."
// voyait son premier mot renomme. La passe chaines exige desormais que la
// chaine ENTIERE soit un identifiant.
const IDENTIFIER_SHAPE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
[
  "chRowExit, chRowExit",
  "@keyframes chRowExit",
  "useChTheme doit etre utilise a l'interieur d'un <ChThemeProvider>.",
  "useChTheme — bascule runtime",
  "ch.toolbar.sort",
  "ch-theme-mode",
].forEach((value) =>
  check('"' + value + '" rejetee par la passe chaines', IDENTIFIER_SHAPE.test(value), false),
);

["ChThemeProvider", "useChTheme", "chTheme", "CH_UI_VERSION"].forEach((value) =>
  check('"' + value + '" acceptee par la passe chaines', IDENTIFIER_SHAPE.test(value), true),
);

console.log("--- Regles textuelles ---");
const byId = Object.fromEntries(TEXT_RULES.map((r) => [r.id, r]));
const applyRule = (id, text) => text.replace(byId[id].pattern, byId[id].replace);

check(
  "var CSS",
  applyRule("css-var", "color: var(--ch-palette-primary-main);"),
  "color: var(--canop-palette-primary-main);",
);
check(
  "var CSS en cle",
  applyRule("css-var", '"--ch-radius-md": "8px"'),
  '"--canop-radius-md": "8px"',
);
check("cle i18n simple", applyRule("i18n-key", 't("ch.toolbar.sort")'), 't("canop.toolbar.sort")');
check(
  "cle i18n en template",
  applyRule("i18n-key", "const key = `ch.error.${code}`;"),
  "const key = `canop.error.${code}`;",
);
check(
  "cle i18n en cle d'objet",
  applyRule("i18n-key", '"ch.themeToggle.group": "Theme",'),
  '"canop.themeToggle.group": "Theme",',
);
check(
  "prose epargnee par la regle i18n",
  applyRule("i18n-key", 'const s = "arch. 3 ch. 4";'),
  'const s = "arch. 3 ch. 4";',
);
check("storage theme", applyRule("storage-key", '"ch-theme-mode"'), '"canop-theme-mode"');
check("storage locale", applyRule("storage-key", "'ch-locale'"), "'canop-locale'");
check(
  "id DOM epargne par la regle storage",
  applyRule("storage-key", '"ch-lightbox-backdrop"'),
  '"ch-lightbox-backdrop"',
);
check(
  "keyframes chRowExit epargne par la regle storage",
  applyRule("storage-key", '"@keyframes chRowExit"'),
  '"@keyframes chRowExit"',
);

console.log(
  failures === 0 ? "\nOK — toutes les assertions passent.\n" : "\n" + failures + " ECHEC(S).\n",
);
process.exitCode = failures === 0 ? 0 : 1;
