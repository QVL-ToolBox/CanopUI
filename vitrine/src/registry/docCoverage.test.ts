import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Le defaut que ce fichier garde : une prop publique qu'aucune page de la
// vitrine ne documente. Les tables de props sont ecrites a la main, donc elles
// derivent en silence -- rien ne casse, rien ne previent, et la table reste
// plausible tout en etant incomplete. A la parution de la 3.0, l'ecart avait
// atteint 61 props publiques sur 22 composants.

const COMPOSANTS = "src/components";
const PAGES = "vitrine/src/pages/components";

/** Les interfaces de props reexportees par le baril : la seule API a documenter. */
function interfacesPubliques(): Set<string> {
  const barils = ["src/components/index.ts", "src/index.ts"]
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");
  return new Set([...barils.matchAll(/type (Canop\w*Props)\b/g)].map((m) => m[1]));
}

function fichiersDe(dossier: string): string[] {
  const trouves: string[] = [];
  (function descendre(courant: string) {
    for (const entree of readdirSync(courant)) {
      const chemin = join(courant, entree);
      if (statSync(chemin).isDirectory()) {
        if (entree !== "test") descendre(chemin);
      } else if (/\.tsx?$/.test(chemin) && !/\.test\.tsx?$/.test(chemin)) {
        trouves.push(chemin);
      }
    }
  })(dossier);
  return trouves;
}

interface Page {
  cle: string;
  source: string;
  documentees: Set<string>;
}

function pages(): Page[] {
  return readdirSync(PAGES)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => {
      const source = readFileSync(join(PAGES, f), "utf8");
      return {
        cle: f.replace(/Doc\.tsx$/, "").replace(/\.tsx$/, ""),
        source,
        documentees: new Set([...source.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1])),
      };
    });
}

function propsDeclarees(dossier: string, publiques: Set<string>): Set<string> {
  const declarees = new Set<string>();
  for (const fichier of fichiersDe(dossier)) {
    const source = readFileSync(fichier, "utf8");
    for (const bloc of source.matchAll(/export interface (Canop\w*Props)\s*\{([\s\S]*?)\n\}/g)) {
      if (!publiques.has(bloc[1])) continue;
      for (const ligne of bloc[2].split("\n")) {
        const prop = ligne.match(/^ {2}(\w+)\??:/);
        if (prop) declarees.add(prop[1]);
      }
    }
  }
  return declarees;
}

function ecarts(): string[] {
  const publiques = interfacesPubliques();
  const toutes = pages();
  const manquantes: string[] = [];

  for (const dossier of readdirSync(COMPOSANTS)) {
    const chemin = join(COMPOSANTS, dossier);
    if (!statSync(chemin).isDirectory() || dossier === "_shared") continue;

    const declarees = propsDeclarees(chemin, publiques);
    if (declarees.size === 0) continue;

    // La page homonyme, et toute page qui rend le composant : plusieurs
    // pieces de partie sont documentees ensemble sur la page Game.
    const minuscule = dossier.charAt(0).toLowerCase() + dossier.slice(1);
    const concernees = toutes.filter(
      (p) =>
        p.cle === dossier ||
        p.source.includes("<" + dossier) ||
        p.source.includes(minuscule + "Rows"),
    );

    const documentees = new Set(concernees.flatMap((p) => [...p.documentees]));
    for (const prop of declarees) {
      if (!documentees.has(prop)) manquantes.push(dossier + "." + prop);
    }
  }
  return manquantes;
}

describe("couverture de la documentation", () => {
  it("documente chaque prop publique dans la vitrine", () => {
    expect(ecarts()).toEqual([]);
  });

  it("garde une page pour chaque composant exporte", () => {
    const publiques = interfacesPubliques();
    const toutes = pages();
    const sansPage = readdirSync(COMPOSANTS)
      .filter((d) => statSync(join(COMPOSANTS, d)).isDirectory() && d !== "_shared")
      .filter((d) => propsDeclarees(join(COMPOSANTS, d), publiques).size > 0)
      .filter((d) => !toutes.some((p) => p.cle === d || p.source.includes("<" + d)));

    expect(sansPage).toEqual([]);
  });
});
