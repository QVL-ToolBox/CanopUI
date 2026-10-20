#!/usr/bin/env node
/**
 * canopui-rebrand — codemod du rebrand CanopUI 3.0 (`Ch*` -> `Canop*`).
 *
 * Tickets SCRUM-391, 392, 393, 395.
 *
 * A rejouer par chacun des 9 projets consommateurs de la flotte QVL sur leur
 * propre `src/`. Aucun chemin en dur : la cible est toujours passee en argument.
 *
 * Trois passes complementaires :
 *   1. AST (ts-morph)   -> les IDENTIFIANTS. Precis : ni les commentaires, ni la
 *      prose, ni les chaines quelconques ne sont touches.
 *   2. AST (chaines)    -> les chaines litterales EGALES a un symbole renomme
 *      (listes d'exports attendues dans les tests, mocks...).
 *   3. Textuelle ciblee -> variables CSS `--ch-*`, cles i18n `"ch.*"`, cles
 *      localStorage. Chaque motif est ancre sur un delimiteur non ambigu.
 *
 * Puis un scan des "restes" signale ce qui doit etre repris a la main.
 *
 * Usage : voir README.md ou `node canopui-rebrand.mjs --help`.
 */

import {
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
  existsSync,
  statSync,
  readdirSync,
} from "node:fs";
import { dirname, extname, basename, join, relative, resolve, sep } from "node:path";
import { Project, SyntaxKind, Node } from "ts-morph";

import { buildIgnoreMatcher } from "./glob.mjs";
import {
  AST_EXTENSIONS,
  TEXT_ONLY_EXTENSIONS,
  TEXT_RULES,
  CONFIG_VALUE_RENAMES,
  DEFAULT_VERB_PREFIXES,
  renameIdentifier,
  isAmbiguousMidWord,
} from "./rules.mjs";

const DEFAULT_IGNORES = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.git/**",
];

/** Motifs recherches lors du scan final des occurrences non traitees. */
const LEFTOVER_PATTERNS = [
  { id: "identifiant Ch*", pattern: /(?<![A-Za-z0-9_])Ch(?=[A-Z])/ },
  { id: "identifiant ch*", pattern: /(?<![A-Za-z0-9_])ch(?=[A-Z])/ },
  { id: "variable CSS --ch-", pattern: /--ch-/ },
  { id: 'cle i18n "ch."', pattern: /["'`]ch\./ },
  { id: "constante CH_", pattern: /(?<![A-Za-z0-9_])CH_/ },
];

/** Une chaine n'est reecrite que si elle est, a elle seule, un identifiant. */
const IDENTIFIER_SHAPE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const CATEGORY_LABELS = {
  types: "Types / interfaces / alias",
  valeurs: "Valeurs (composants, fonctions, constantes)",
  "imports/exports": "Specificateurs d'import / export",
  chaines: "Chaines litterales egales a un symbole",
  CSS: "Variables CSS --ch-* -> --canop-*",
  i18n: 'Cles i18n "ch.*" -> "canop.*"',
  localStorage: "Cles localStorage ch-* -> canop-*",
  DOM: 'Ids DOM / layoutId "ch-*" (opt-in)',
};

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = {
    project: null,
    tsconfig: null,
    // La simulation est le mode PAR DEFAUT : une invocation distraite ne peut
    // jamais modifier un depot. Il faut `--apply` explicitement pour ecrire.
    dryRun: true,
    renameFiles: false,
    domPrefix: false,
    strings: true,
    verbs: [...DEFAULT_VERB_PREFIXES],
    ignore: [...DEFAULT_IGNORES],
    json: null,
    quiet: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[(i += 1)];

    switch (arg) {
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      case "--project":
      case "-p":
        opts.project = next();
        break;
      case "--tsconfig":
        opts.tsconfig = next();
        break;
      case "--dry-run":
      case "-n":
        opts.dryRun = true;
        break;
      case "--apply":
        opts.dryRun = false;
        break;
      case "--rename-files":
        opts.renameFiles = true;
        break;
      case "--dom-prefix":
        opts.domPrefix = true;
        break;
      case "--no-strings":
        opts.strings = false;
        break;
      case "--verb":
        opts.verbs.push(next());
        break;
      case "--ignore":
        opts.ignore.push(next());
        break;
      case "--json":
        opts.json = next();
        break;
      case "--quiet":
        opts.quiet = true;
        break;
      default:
        if (!opts.project && !arg.startsWith("-")) {
          opts.project = arg;
        } else {
          console.error("Option inconnue : " + arg);
          process.exit(2);
        }
    }
  }

  return opts;
}

function printHelp() {
  console.log(`
canopui-rebrand — codemod Ch* -> Canop* (CanopUI 3.0)

  node canopui-rebrand.mjs --project <dossier> [options]

Options
  -p, --project <dir>   Dossier a migrer (ex: ../mon-app/src). OBLIGATOIRE.
      --tsconfig <f>    tsconfig a utiliser. Par defaut : autodetection, sinon
                        tous les .ts/.tsx du dossier.
  -n, --dry-run         Simulation : affiche fichier / ligne / avant -> apres,
                        n'ecrit RIEN. C'est le mode PAR DEFAUT.
      --apply           Ecrit reellement les modifications sur disque.
      --rename-files    Renomme aussi les fichiers ChXxx.tsx -> CanopXxx.tsx et
                        met a jour les imports. Utile pour la lib elle-meme,
                        inutile pour un consommateur.
      --dom-prefix      Renomme aussi les ids DOM / layoutId / key "ch-*".
                        HORS PERIMETRE par defaut (casse les selecteurs CSS et
                        les tests existants).
      --no-strings      N'applique pas le renommage aux chaines litterales
                        egales a un symbole renomme.
      --verb <prefixe>  Ajoute un prefixe camelCase autorise devant Ch<Maj>
                        (par defaut : ${DEFAULT_VERB_PREFIXES.join(", ")}).
      --ignore <glob>   Glob a exclure (repetable).
      --json <fichier>  Ecrit le rapport complet en JSON.
      --quiet           N'affiche que le resume.

Code de sortie : 0 si rien ne reste a faire, 1 s'il subsiste des cas manuels.
`);
}

// ---------------------------------------------------------------------------
// Helpers AST
// ---------------------------------------------------------------------------

const toPosix = (value) => value.split(sep).join("/");

const TYPE_POSITION_KINDS = [
  SyntaxKind.TypeReference,
  SyntaxKind.InterfaceDeclaration,
  SyntaxKind.TypeAliasDeclaration,
  SyntaxKind.ExpressionWithTypeArguments,
  SyntaxKind.TypeQuery,
  SyntaxKind.TypeParameter,
];

function classifyIdentifier(node) {
  const parent = node.getParent();

  if (TYPE_POSITION_KINDS.includes(parent.getKind())) return "types";

  if (Node.isImportSpecifier(parent) || Node.isExportSpecifier(parent)) {
    if (parent.isTypeOnly && parent.isTypeOnly()) return "types";
    const clause = parent.getFirstAncestorByKind(SyntaxKind.ImportClause);
    if (clause && clause.isTypeOnly && clause.isTypeOnly()) return "types";
    return "imports/exports";
  }

  return "valeurs";
}

/**
 * Un identifiant en position de "nom de propriete" ne designe pas forcement le
 * symbole de la lib (ce peut etre la cle d'un objet metier quelconque) : on ne
 * le renomme pas, on le signale.
 */
function isUnsafePropertyPosition(node) {
  const parent = node.getParent();
  const namedParents = [
    Node.isPropertyAccessExpression,
    Node.isPropertySignature,
    Node.isPropertyAssignment,
    Node.isMethodSignature,
    Node.isMethodDeclaration,
  ];
  return namedParents.some((guard) => guard(parent) && parent.getNameNode() === node);
}

/**
 * `{ chTheme }` doit devenir `{ chTheme: canopTheme }` : on preserve le nom de
 * la propriete et on ne renomme que la liaison locale. Sans cette expansion, le
 * raccourci renommerait silencieusement la cle de l'objet.
 */
function shorthandExpansion(node, newName) {
  const parent = node.getParent();

  if (Node.isShorthandPropertyAssignment(parent) && parent.getNameNode() === node) {
    return node.getText() + ": " + newName;
  }

  if (
    Node.isBindingElement(parent) &&
    parent.getNameNode() === node &&
    !parent.getPropertyNameNode() &&
    Node.isObjectBindingPattern(parent.getParent())
  ) {
    return node.getText() + ": " + newName;
  }

  return null;
}

/** Applique une liste de {start, end, text} sur une chaine, de la fin au debut. */
function applyEdits(text, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let out = text;
  for (const edit of sorted) {
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
  }
  return out;
}

/**
 * Diff ligne a ligne. Aucune passe n'ajoute ni ne supprime de saut de ligne,
 * donc l'appariement par index est exact ; on garde neanmoins un garde-fou.
 */
function lineDiff(before, after) {
  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);

  if (beforeLines.length !== afterLines.length) {
    return [{ line: 0, before: "<nombre de lignes modifie — voir --json>", after: "" }];
  }

  const changes = [];
  for (let i = 0; i < beforeLines.length; i += 1) {
    if (beforeLines[i] !== afterLines[i]) {
      changes.push({ line: i + 1, before: beforeLines[i].trim(), after: afterLines[i].trim() });
    }
  }
  return changes;
}

function collectEntries(root, isIgnored, wantDirectories, extensions) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (isIgnored(toPosix(full))) continue;
      if (entry.isDirectory()) {
        if (wantDirectories) out.push(full);
        walk(full);
      } else if (!wantDirectories && extensions.includes(extname(entry.name))) {
        out.push(full);
      }
    }
  };
  walk(root);
  return out;
}

function findTsconfig(root) {
  let dir = root;
  for (let depth = 0; depth < 5; depth += 1) {
    for (const name of ["tsconfig.app.json", "tsconfig.json"]) {
      const candidate = join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Signale ce qui reste apres passage du codemod : occurrences en commentaire,
 * en JSDoc, dans une chaine composite, etc. C'est le filet de securite qui
 * garantit qu'aucune occurrence ne passe silencieusement a la trappe.
 */
function scanLeftovers(text, filePath, addManual) {
  text.split(/\r?\n/).forEach((line, index) => {
    // On neutralise ce qui vient d'etre renomme pour ne pas se signaler soi-meme.
    const residual = line.replace(/[Cc]anop[A-Za-z0-9_-]*/g, "").replace(/--canop-/g, "");
    for (const { id, pattern } of LEFTOVER_PATTERNS) {
      if (pattern.test(residual)) {
        addManual(
          "reste apres codemod",
          filePath,
          index + 1,
          id + " — " + line.trim().slice(0, 120),
        );
        return;
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Coeur
// ---------------------------------------------------------------------------

function run(opts) {
  if (!opts.project) {
    console.error("Erreur : --project <dossier> est obligatoire. `--help` pour l'aide.");
    return 2;
  }

  const root = resolve(opts.project);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error("Erreur : " + root + " n'est pas un dossier.");
    return 2;
  }

  const isIgnored = buildIgnoreMatcher(opts.ignore);

  const report = {
    root,
    counts: Object.fromEntries(Object.keys(CATEGORY_LABELS).map((key) => [key, 0])),
    symbols: new Map(),
    files: new Map(),
    renamedFiles: [],
    manual: [],
  };

  const addManual = (kind, file, line, detail) => {
    report.manual.push({ kind, file: relative(root, file) || basename(file), line, detail });
  };

  // --- Chargement du projet ------------------------------------------------
  const tsconfig = opts.tsconfig ? resolve(opts.tsconfig) : findTsconfig(root);
  const project = new Project(
    tsconfig
      ? { tsConfigFilePath: tsconfig, skipAddingFilesFromTsConfig: true }
      : { compilerOptions: { jsx: 4, allowJs: false } },
  );

  project.addSourceFilesAtPaths(AST_EXTENSIONS.map((ext) => toPosix(root) + "/**/*" + ext));

  const sourceFiles = project
    .getSourceFiles()
    .filter((sf) => !isIgnored(toPosix(sf.getFilePath())));
  if (sourceFiles.length === 0) {
    console.warn(
      "Attention : aucun fichier " + AST_EXTENSIONS.join("/") + " trouve sous " + root + ".",
    );
  }

  // Texte d'origine capture AVANT toute modification, pour produire le diff.
  const originals = new Map();
  for (const sf of sourceFiles) {
    originals.set(sf, { path: sf.getFilePath(), text: sf.getFullText() });
  }

  // --- Passe 0 : renommage des fichiers (opt-in) ---------------------------
  if (opts.renameFiles) {
    for (const sf of sourceFiles) {
      const filePath = sf.getFilePath();
      const ext = extname(filePath);
      const renamed = renameIdentifier(basename(filePath, ext), opts.verbs);
      if (!renamed) continue;

      const target = join(dirname(filePath), renamed.to + ext);
      // move() reecrit les specificateurs d'import de tout le projet en memoire.
      sf.move(target);
      report.renamedFiles.push({ from: relative(root, filePath), to: relative(root, target) });
    }

    for (const dir of collectEntries(root, isIgnored, true, [])) {
      const renamed = renameIdentifier(basename(dir), opts.verbs);
      if (renamed) {
        addManual(
          "dossier a renommer",
          dir,
          0,
          basename(dir) +
            " -> " +
            renamed.to +
            " (renommage de dossier non automatise : faire un `git mv`)",
        );
      }
    }
  }

  // --- Passes 1 & 2 : identifiants, puis chaines-symboles ------------------
  const finalTexts = new Map();

  for (const sf of sourceFiles) {
    const filePath = sf.getFilePath();
    const edits = [];
    const renamedInFile = new Set();

    sf.forEachDescendant((node) => {
      if (node.getKind() !== SyntaxKind.Identifier) return;

      const name = node.getText();

      if (isAmbiguousMidWord(name, opts.verbs)) {
        addManual(
          "Ch en milieu de mot",
          filePath,
          node.getStartLineNumber(),
          name +
            " — `Ch` en milieu d'identifiant, hors verbe autorise. NON renomme." +
            " Arbitrer a la main, ou autoriser le prefixe via --verb.",
        );
        return;
      }

      const renamed = renameIdentifier(name, opts.verbs);
      if (!renamed) return;

      if (isUnsafePropertyPosition(node)) {
        addManual(
          "nom de propriete",
          filePath,
          node.getStartLineNumber(),
          name +
            " en position de nom de propriete (" +
            node.getParent().getKindName() +
            "). NON renomme : verifier qu'il s'agit bien d'un symbole CanopUI.",
        );
        return;
      }

      const expansion = shorthandExpansion(node, renamed.to);
      if (expansion) {
        edits.push({ start: node.getStart(), end: node.getEnd(), text: expansion });
        addManual(
          "raccourci d'objet",
          filePath,
          node.getStartLineNumber(),
          name + " — etendu en `" + expansion + "` pour preserver le nom de propriete. A relire.",
        );
      } else {
        edits.push({ start: node.getStart(), end: node.getEnd(), text: renamed.to });
      }

      report.counts[classifyIdentifier(node)] += 1;
      renamedInFile.add(name);

      const entry = report.symbols.get(name) || { to: renamed.to, rule: renamed.rule, count: 0 };
      entry.count += 1;
      report.symbols.set(name, entry);
    });

    // Passe 1b : valeurs de configuration portant le prefixe de marque.
    sf.forEachDescendant((node) => {
      if (!Node.isPropertyAssignment(node)) return;

      const rename = CONFIG_VALUE_RENAMES.find((entry) => entry.property === node.getName());
      if (!rename) return;

      const initializer = node.getInitializer();
      if (!initializer || !Node.isStringLiteral(initializer)) return;
      if (initializer.getLiteralText() !== rename.from) return;

      const quote = initializer.getText()[0];
      edits.push({
        start: initializer.getStart(),
        end: initializer.getEnd(),
        text: quote + rename.to + quote,
      });
      report.counts.CSS += 1;
      addManual(
        "valeur de configuration",
        filePath,
        node.getStartLineNumber(),
        rename.property +
          ': "' +
          rename.from +
          '" -> "' +
          rename.to +
          '" — ' +
          rename.why +
          ". A verifier en priorite.",
      );
    });

    if (opts.strings) {
      sf.forEachDescendant((node) => {
        const kind = node.getKind();
        if (kind !== SyntaxKind.StringLiteral && kind !== SyntaxKind.NoSubstitutionTemplateLiteral)
          return;

        const value = node.getLiteralText();

        // Garde-fou indispensable : la chaine doit etre UN identifiant et rien
        // d'autre. Sans cela, "chRowExit, chRowExit" ou un message d'erreur
        // commencant par "useChTheme ..." seraient partiellement reecrits.
        if (!IDENTIFIER_SHAPE.test(value)) return;
        if (isAmbiguousMidWord(value, opts.verbs)) return;

        const renamed = renameIdentifier(value, opts.verbs);
        if (!renamed) return;

        const quote = node.getText()[0];
        edits.push({
          start: node.getStart(),
          end: node.getEnd(),
          text: quote + renamed.to + quote,
        });
        report.counts.chaines += 1;

        if (!renamedInFile.has(value)) {
          addManual(
            "chaine litterale",
            filePath,
            node.getStartLineNumber(),
            '"' +
              value +
              '" -> "' +
              renamed.to +
              '" : chaine egale a un symbole du rebrand, sans identifiant homonyme dans ce fichier.' +
              " Verifier que ce n'est pas une valeur metier.",
          );
        }
      });
    }

    finalTexts.set(sf, applyEdits(sf.getFullText(), edits));
  }

  // --- Passe 3 : regles textuelles ciblees ---------------------------------
  const activeTextRules = TEXT_RULES.filter((rule) =>
    rule.id === "dom-prefix" ? opts.domPrefix : rule.enabledByDefault,
  );

  const applyTextRules = (text) => {
    let out = text;
    for (const rule of activeTextRules) {
      out = out.replace(rule.pattern, (...args) => {
        report.counts[rule.category] += 1;
        return rule.replace.replace(/\$(\d)/g, (_, digit) => args[Number(digit)]);
      });
    }
    return out;
  };

  for (const sf of sourceFiles) {
    finalTexts.set(sf, applyTextRules(finalTexts.get(sf)));
  }

  // Fichiers non-TS (CSS, md, html, json) : passes textuelles uniquement.
  const textOnlyChanges = new Map();
  for (const file of collectEntries(root, isIgnored, false, TEXT_ONLY_EXTENSIONS)) {
    const before = readFileSync(file, "utf8");
    const after = applyTextRules(before);
    if (before !== after) textOnlyChanges.set(file, { before, after });
  }

  // --- Diff + scan des restes ----------------------------------------------
  const allChanges = [];

  for (const sf of sourceFiles) {
    const { path: originalPath, text: before } = originals.get(sf);
    const after = finalTexts.get(sf);
    const newPath = sf.getFilePath();

    scanLeftovers(after, originalPath, addManual);

    if (before === after && originalPath === newPath) continue;

    allChanges.push({
      file: relative(root, originalPath),
      newFile: newPath === originalPath ? null : relative(root, newPath),
      changes: lineDiff(before, after),
    });
    report.files.set(originalPath, { newPath, after });
  }

  for (const [file, { before, after }] of textOnlyChanges) {
    allChanges.push({
      file: relative(root, file),
      newFile: null,
      changes: lineDiff(before, after),
    });
    report.files.set(file, { newPath: file, after });
  }

  // --- Ecriture -------------------------------------------------------------
  if (!opts.dryRun) {
    for (const [originalPath, { newPath, after }] of report.files) {
      mkdirSync(dirname(newPath), { recursive: true });
      writeFileSync(newPath, after, "utf8");
      if (newPath !== originalPath && existsSync(originalPath)) rmSync(originalPath);
    }
  }

  printReport(report, allChanges, opts);

  if (opts.json) {
    const target = resolve(opts.json);
    writeFileSync(
      target,
      JSON.stringify(
        {
          root,
          dryRun: opts.dryRun,
          counts: report.counts,
          symbols: Object.fromEntries(report.symbols),
          renamedFiles: report.renamedFiles,
          manual: report.manual,
          changes: allChanges,
        },
        null,
        2,
      ),
      "utf8",
    );
    console.log("\nRapport JSON ecrit : " + target);
  }

  return report.manual.length > 0 ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Rapport
// ---------------------------------------------------------------------------

function printReport(report, allChanges, opts) {
  const rule = "=".repeat(78);
  const thin = "-".repeat(78);
  const mode = opts.dryRun
    ? "SIMULATION (--dry-run) — aucun fichier ecrit"
    : "APPLIQUE — fichiers modifies sur disque";

  console.log("\n" + rule);
  console.log("canopui-rebrand  |  " + mode);
  console.log("cible : " + report.root);
  console.log(rule);

  if (!opts.quiet) {
    for (const { file, newFile, changes } of allChanges) {
      if (changes.length === 0 && !newFile) continue;
      console.log("\n--- " + file + (newFile ? "   =>   " + newFile : ""));
      for (const change of changes) {
        console.log("  L" + String(change.line).padStart(4) + "  - " + change.before);
        console.log("         + " + change.after);
      }
    }
  }

  console.log("\n" + thin);
  console.log("OCCURRENCES PAR CATEGORIE");
  console.log(thin);
  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    console.log("  " + label.padEnd(46) + String(report.counts[key]).padStart(6));
  }
  const total = Object.values(report.counts).reduce((a, b) => a + b, 0);
  console.log("  " + "TOTAL".padEnd(46) + String(total).padStart(6));
  console.log(
    "  " + "Symboles distincts renommes".padEnd(46) + String(report.symbols.size).padStart(6),
  );
  console.log("  " + "Fichiers touches".padEnd(46) + String(report.files.size).padStart(6));

  if (report.renamedFiles.length > 0) {
    console.log("\n" + thin);
    console.log("FICHIERS RENOMMES (" + report.renamedFiles.length + ")");
    console.log(thin);
    for (const { from, to } of report.renamedFiles) console.log("  " + from + "\n    => " + to);
  }

  if (!opts.quiet && report.symbols.size > 0) {
    console.log("\n" + thin);
    console.log("SYMBOLES RENOMMES — liste DEDUITE du motif, a relire avant --apply");
    console.log(thin);
    const sorted = [...report.symbols].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [from, entry] of sorted) {
      console.log(
        "  " +
          from.padEnd(34) +
          " -> " +
          entry.to.padEnd(36) +
          " [" +
          entry.rule +
          "] x" +
          entry.count,
      );
    }
  }

  console.log("\n" + thin);
  console.log("CAS NON TRAITES AUTOMATIQUEMENT — REPRISE MANUELLE (" + report.manual.length + ")");
  console.log(thin);

  if (report.manual.length === 0) {
    console.log("  Aucun.");
  } else {
    const grouped = new Map();
    for (const item of report.manual) {
      if (!grouped.has(item.kind)) grouped.set(item.kind, []);
      grouped.get(item.kind).push(item);
    }
    for (const [kind, items] of grouped) {
      console.log("\n  [" + kind + "] — " + items.length);
      for (const item of items.slice(0, 40)) {
        console.log("    " + item.file + ":" + item.line + "  " + item.detail);
      }
      if (items.length > 40)
        console.log("    ... et " + (items.length - 40) + " autres (voir --json)");
    }
  }

  console.log("\n" + rule);
  if (opts.dryRun) console.log("Rien n'a ete ecrit. Relancer avec --apply pour appliquer.");
  console.log("RAPPEL : la retrocompatibilite localStorage n'est PAS faite par ce codemod.");
  console.log("         Voir README.md, section 'Retrocompatibilite localStorage'.");
  console.log(rule);
}

process.exitCode = run(parseArgs(process.argv.slice(2)));
