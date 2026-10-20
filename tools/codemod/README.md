# canopui-rebrand — codemod `Ch*` → `Canop*` (CanopUI 3.0)

Migration du rebrand CanopUI 3.0. Tickets **SCRUM-391, 392, 393, 395**.

Ce codemod est un **livrable** : les 9 projets consommateurs de la flotte QVL le
rejouent sur leur propre `src/`. Il ne contient aucun chemin en dur.

---

## Installation

```bash
cd codemod
npm install
```

Node ≥ 18. Seule dépendance : `ts-morph`.

## Lancement

Le mode **simulation est celui par défaut** : sans `--apply`, rien n'est jamais
écrit sur disque.

### 1. Simuler (toujours commencer par là)

```bash
node canopui-rebrand.mjs --project ../src
```

Affiche, fichier par fichier, chaque ligne modifiée (`- avant` / `+ après`), le
décompte par catégorie, la liste des symboles renommés et les cas à reprendre à
la main.

Pour un rapport exploitable/diffable :

```bash
node canopui-rebrand.mjs --project ../src --quiet --json rapport.json
```

### 2. Appliquer

```bash
node canopui-rebrand.mjs --project ../src --apply
```

### Sur la librairie CanopUI elle-même

La lib possède 5 fichiers nommés `Ch*` / `createChTheme` : il faut donc aussi
renommer les fichiers et réécrire les imports.

```bash
node canopui-rebrand.mjs --project /chemin/vers/QVL-CanopUI/src --rename-files --apply
```

### Sur un projet consommateur

Le consommateur ne nomme pas ses fichiers `Ch*` : on n'utilise pas
`--rename-files`.

```bash
cd codemod && npm install
node canopui-rebrand.mjs --project ../../mon-app/src            # simulation
node canopui-rebrand.mjs --project ../../mon-app/src --apply    # application
```

Puis, dans le projet : `npx tsc --noEmit` et la suite de tests.

## Options

| Option | Effet |
| --- | --- |
| `-p, --project <dir>` | Dossier à migrer. **Obligatoire.** |
| `--tsconfig <f>` | tsconfig à utiliser (sinon autodétection, sinon tous les `.ts`/`.tsx`). |
| `-n, --dry-run` | Simulation. **Mode par défaut.** |
| `--apply` | Écrit réellement les modifications. |
| `--rename-files` | Renomme `ChXxx.tsx` → `CanopXxx.tsx` et met à jour les imports. |
| `--dom-prefix` | Renomme aussi les ids DOM / `layoutId` / `key` `"ch-*"`. **Hors périmètre par défaut.** |
| `--no-strings` | Ne réécrit pas les chaînes littérales égales à un symbole renommé. |
| `--verb <prefixe>` | Ajoute un préfixe camelCase autorisé devant `Ch<Maj>`. |
| `--ignore <glob>` | Exclusion supplémentaire (répétable). |
| `--json <f>` | Rapport complet en JSON. |
| `--quiet` | N'affiche que la synthèse. |

Code de sortie : `0` si rien ne reste à faire, `1` s'il subsiste des cas manuels,
`2` en cas d'erreur d'invocation.

## Tests du codemod

```bash
node rules.checks.mjs
```

`rules.checks.mjs` verrouille le motif contre les contre-exemples **réellement
extraits** de `src/` (Checkbox, Children, Chip, Chivo, ChangeEvent, Chart*,
Chat*, Check*, chunkSize, children, checked…) et contre le bug d'insertion en
milieu de mot.

---

## Le motif retenu

Le renommage n'est **pas** piloté par une liste figée de noms — la lib est en
refactoring, une telle liste serait périmée en quelques jours. Il est piloté par
un **motif**, validé contre l'état du code.

| Règle | Motif | Exemple |
| --- | --- | --- |
| `pascal-prefix` | `^Ch` suivi d'une **majuscule** | `ChButtonProps` → `CanopButtonProps` |
| `camel-prefix` | `^ch` suivi d'une **majuscule** | `chTheme` → `canopTheme` |
| `verb-prefix` | `^(use\|create\|build\|make\|with\|render)Ch` + majuscule | `useChTheme` → `useCanopTheme` |
| `explicit` | table de correspondance | `CH_UI_VERSION` → `CANOP_VERSION` |

**Pourquoi la majuscule qui suit est la clé.** Tous les faux positifs du dépôt
s'écrivent `Ch`/`ch` + **minuscule** : `Checkbox`, `Children`, `Chip`, `Chivo`,
`ChangeEvent`, `ChartPieSolid`, `ChatOutline`, `CheckSolid`, `chunkSize`,
`checked`, `children`, `checksum`, `channel`… Exiger une majuscule les exclut
tous, sans exception, tout en conservant les vrais cas y compris les plus
piégeux (`ChCheckboxProps`, `ChChunkRange`).

**Jamais d'insertion en milieu de mot.** Toutes les règles sont ancrées sur `^`.
Le bug `fileUploadSource` → `fileChUploadSource` est structurellement
impossible. Seule exception : la liste **fermée** de verbes ci-dessus. Tout autre
identifiant contenant `Ch<Majuscule>` en milieu de mot (`dispatchChXxx`,
`searchChXxx`…) est **signalé, jamais renommé** — une règle générique
`^[a-z]+Ch` serait dangereuse, trop de mots anglais finissent par « ch ».

## Comment c'est traité

| Cible | Technique | Pourquoi |
| --- | --- | --- |
| Identifiants TS/TSX | **AST (ts-morph)** | Une regex globale toucherait commentaires, JSDoc et chaînes. L'AST ne voit que de vrais identifiants. |
| Chaînes = un symbole | AST + garde-fou | Uniquement si la chaîne **entière** est un identifiant valide. |
| `cssVarPrefix: "ch"` | AST ciblé | Voir ci-dessous — le cas le plus dangereux du lot. |
| Variables CSS `--ch-*` | Textuel, ancré sur `--` | Jeton non ambigu, présent aussi hors TS. |
| Clés i18n `"ch.*"` | Textuel, ancré sur le **guillemet ouvrant** | Seule une chaîne qui *commence* par `ch.` matche : la prose (« arch. », « ch. 3 ») est épargnée, et `` `ch.error.${code}` `` est couvert. |
| Clés localStorage | Textuel, **égalité stricte** | N'attrape que `ch-theme-mode` / `ch-locale`, pas les ids DOM `ch-*`. |
| Fichiers `Ch*.tsx` | `ts-morph.move()` | Réécrit les spécificateurs d'import de tout le projet. |

### Le piège `cssVarPrefix`

`src/theme/createChTheme.ts` contient :

```ts
cssVariables: { cssVarPrefix: "ch" }
```

Cette unique chaîne `"ch"` — sans `--` ni `-` — engendre **à l'exécution** la
totalité des `var(--ch-palette-*)`, `var(--ch-spacing-*)`, etc. Aucune règle
textuelle sur `--ch-` ne peut la voir. La rater, c'est réécrire les ~480 usages
`var(--ch-…)` en `--canop-…` pendant que MUI continue d'émettre `--ch-…` : tout
le thème tombe alors silencieusement sur ses valeurs de repli, **sans la moindre
erreur de compilation**. Le codemod la traite par AST et la signale en priorité
dans le rapport.

---

## Rétrocompatibilité localStorage — À FAIRE À LA MAIN

**Le codemod ne fait pas cette partie**, et c'est volontaire : il renomme les
clés, il ne peut pas inventer la logique de repli. Sans le patch ci-dessous,
**tout utilisateur déjà installé perd son thème et sa langue** à la mise à jour.

Deux fichiers, une seule fonction chacun :

- `src/theme/ChThemeProvider.tsx` → `readStored()` (clé `ch-theme-mode`)
- `src/i18n/ChI18nProvider.tsx` → `readStored()` (clé `ch-locale`)

Principe : à la **lecture**, si la nouvelle clé est absente, relire l'ancienne,
la migrer puis la purger. À l'**écriture**, n'écrire que la nouvelle clé.

Le repli ne doit s'appliquer **que si le `storageKey` utilisé est celui par
défaut** : `storageKey` est une prop publique, et un consommateur qui fournit sa
propre clé ne doit jamais se voir servir la valeur d'une clé héritée.

```ts
const DEFAULT_STORAGE_KEY = "canop-theme-mode";
const LEGACY_STORAGE_KEY = "ch-theme-mode";

function readStored(storageKey: string | null): ChThemePreference | null {
  if (!storageKey || typeof window === "undefined") return null;

  const raw = window.localStorage?.getItem(storageKey);
  if (raw) return parse(raw);

  // Repli sur l'ancienne cle, uniquement pour la cle par defaut.
  if (storageKey !== DEFAULT_STORAGE_KEY) return null;
  const legacy = window.localStorage?.getItem(LEGACY_STORAGE_KEY);
  if (!legacy) return null;

  const parsed = parse(legacy);
  if (parsed) {
    window.localStorage?.setItem(storageKey, legacy);
    window.localStorage?.removeItem(LEGACY_STORAGE_KEY);
  }
  return parsed;
}
```

Même schéma pour `ChI18nProvider` avec `canop-locale` / `ch-locale`, en
conservant la validation `locales.includes(value)` existante.

À faire par `@qvl-dev-frontend`, avec un test « ancienne clé seule présente →
préférence restaurée et migrée ».

---

## Ce que le codemod ne fait pas

- **Rétrocompatibilité localStorage** — voir ci-dessus.
- **Ids DOM / `layoutId` / `key` `"ch-*"`** (`ch-lightbox-backdrop`,
  `ch-sliding-indicator`, `ch-confirm-dialog-title`…). Hors périmètre par
  défaut : ce sont des valeurs par défaut de props publiques et des cibles de
  sélecteurs CSS chez les consommateurs. Activable via `--dom-prefix`, à
  arbitrer produit.
- **`@keyframes chRowExit`** (`DataTable.tsx`) — nom d'animation interne, hors
  périmètre du rebrand d'API. Laissé intact et signalé.
- **Commentaires, JSDoc, prose, noms de tests** contenant `Ch*` — l'AST ne les
  touche pas par construction. Le scan des « restes » les liste tous en fin de
  rapport.
- **Renommage des dossiers** — signalé, à faire par `git mv` pour préserver
  l'historique.
- **`package.json`, README, CHANGELOG, docs** — hors du `--project` visé.

## Validation effectuée

Rejoué sur une copie complète de `QVL-CanopUI@dette/lot-0` (`496a110`) :

- 2 167 occurrences réécrites, 212 symboles distincts, 312 fichiers, 5 fichiers renommés
- `tsc -b` : **0 erreur**
- `vitest run` : **732 / 732 tests au vert**
