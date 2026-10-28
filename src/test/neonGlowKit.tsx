import type { ReactElement } from "react";
import { act } from "@testing-library/react";
import type { CanopThemeMode } from "../theme";
import { rendreTonal, texteDesStyles } from "./navbarToneKit";

export type EtatNeon = "repos" | "survol" | "focusSouris" | "focusClavier";

export interface OptionsNeon {
  moinsDeMouvement?: boolean;
}

interface RegleAplatie {
  partie: string;
  specificite: number;
  ordre: number;
  style: CSSStyleDeclaration;
}

const MARQUEURS = {
  survol: "neon-etat-survol",
  focus: "neon-etat-focus",
  focusVisible: "neon-etat-focus-visible",
  focusInterne: "neon-etat-focus-interne",
  actif: "neon-etat-actif",
} as const;

const PROPRIETES_DE_HALO = ["filter", "box-shadow", "text-shadow"] as const;

const SPECIFICITE_EN_LIGNE = 1_000_000;

const CONDITIONS_TOUJOURS_VRAIES = /^(\(hover: ?hover\)|\(min-width: ?0(rem|px)?\))$/;
const CONDITION_MOUVEMENT_REDUIT = /prefers-reduced-motion: ?reduce/;

export const VARIABLES_NEON = [
  "--canop-glow-intensity",
  "--canop-glow-core",
  "--canop-glow-aura",
  "--canop-glow-alpha",
  "--canop-glow-flicker",
] as const;

export function rendreNeon(ui: ReactElement, mode: CanopThemeMode) {
  return rendreTonal(ui, mode);
}

export function variablesNeonSurRoot(): Record<string, string> {
  const blocs = texteDesStyles().match(/:root\{[^}]*\}/g) ?? [];
  const variables: Record<string, string> = {};
  for (const bloc of blocs) {
    for (const [, nom, valeur] of bloc.matchAll(/(--canop-glow-[a-z-]+):([^;}]+)/g)) {
      variables[nom] = valeur.trim();
    }
  }
  return variables;
}

export function keyframesDeclarees(): string[] {
  return Array.from(texteDesStyles().matchAll(/@keyframes\s+([\w-]+)/g), ([, nom]) => nom);
}

function versMarqueurs(partie: string): string {
  return partie
    .replace(/:hover/g, `.${MARQUEURS.survol}`)
    .replace(/:focus-visible/g, `.${MARQUEURS.focusVisible}`)
    .replace(/:focus-within/g, `.${MARQUEURS.focusInterne}`)
    .replace(/:focus/g, `.${MARQUEURS.focus}`)
    .replace(/:active/g, `.${MARQUEURS.actif}`);
}

function specificiteDe(partie: string): number {
  const nettoyee = partie.replace(/:(not|has|is|where)\(/g, "(").replace(/::[\w-]+/g, " ");
  const ids = (nettoyee.match(/#[\w-]+/g) ?? []).length;
  const classes =
    (nettoyee.match(/\.[\w-]+/g) ?? []).length +
    (nettoyee.match(/\[[^\]]+\]/g) ?? []).length +
    (nettoyee.match(/(?<!:):[\w-]+/g) ?? []).length;
  const types = (nettoyee.match(/(^|[\s>+~(])[a-z][\w-]*/gi) ?? []).length;
  return ids * 10000 + classes * 100 + types;
}

function decouperAuNiveauZero(texte: string): string[] {
  const parties: string[] = [];
  let profondeur = 0;
  let courante = "";
  for (const caractere of texte) {
    if (caractere === "(") profondeur += 1;
    if (caractere === ")") profondeur -= 1;
    if (caractere === "," && profondeur === 0) {
      parties.push(courante.trim());
      courante = "";
      continue;
    }
    courante += caractere;
  }
  parties.push(courante.trim());
  return parties;
}

function conditionRetenue(condition: string, options: OptionsNeon): boolean {
  if (CONDITIONS_TOUJOURS_VRAIES.test(condition)) return true;
  return Boolean(options.moinsDeMouvement) && CONDITION_MOUVEMENT_REDUIT.test(condition);
}

function reglesAplaties(options: OptionsNeon): RegleAplatie[] {
  const regles: RegleAplatie[] = [];
  const parcourir = (liste: CSSRuleList, applicable: boolean) => {
    for (const regle of Array.from(liste)) {
      if (regle instanceof CSSMediaRule) {
        parcourir(regle.cssRules, applicable && conditionRetenue(regle.conditionText, options));
        continue;
      }
      if (!(regle instanceof CSSStyleRule) || !applicable) continue;
      for (const partie of decouperAuNiveauZero(regle.selectorText)) {
        if (/::[\w-]+$/.test(partie)) continue;
        regles.push({
          partie: versMarqueurs(partie),
          specificite: specificiteDe(partie),
          ordre: regles.length,
          style: regle.style,
        });
      }
    }
  };
  for (const feuille of Array.from(document.styleSheets)) parcourir(feuille.cssRules, true);
  return regles;
}

function correspond(element: Element, partie: string): boolean {
  try {
    return element.matches(partie);
  } catch {
    return false;
  }
}

function reglesDe(element: Element, regles: RegleAplatie[]): RegleAplatie[] {
  const applicables = regles.filter((regle) => correspond(element, regle.partie));
  if (element instanceof HTMLElement && element.style.length > 0) {
    applicables.push({
      partie: "",
      specificite: SPECIFICITE_EN_LIGNE,
      ordre: Number.MAX_SAFE_INTEGER,
      style: element.style,
    });
  }
  return applicables;
}

function valeurGagnante(regles: RegleAplatie[], proprietes: readonly string[]): string {
  const candidates = regles
    .flatMap((regle) =>
      proprietes.map((propriete) => ({
        regle,
        valeur: regle.style.getPropertyValue(propriete).trim(),
        important: regle.style.getPropertyPriority(propriete) === "important",
      })),
    )
    .filter((candidate) => candidate.valeur !== "")
    .sort(
      (a, b) =>
        Number(a.important) - Number(b.important) ||
        a.regle.specificite - b.regle.specificite ||
        a.regle.ordre - b.regle.ordre,
    );
  return candidates.at(-1)?.valeur ?? "";
}

function variableHeritee(element: Element, nom: string, regles: RegleAplatie[]): string {
  for (let courant: Element | null = element; courant; courant = courant.parentElement) {
    const valeur = valeurGagnante(reglesDe(courant, regles), [nom]);
    if (valeur !== "") return valeur;
  }
  return "";
}

function substituer(
  valeur: string,
  element: Element,
  regles: RegleAplatie[],
  garder: (nom: string) => boolean,
): string {
  let courante = valeur;
  for (let passe = 0; passe < 6; passe += 1) {
    courante = courante.replace(
      /var\((--[\w-]+)(?:,\s*([^()]*))?\)/g,
      (brut, nom: string, repli?: string) => {
        if (garder(nom)) return brut;
        const resolue = variableHeritee(element, nom, regles);
        if (resolue !== "") return resolue;
        return repli?.trim() ?? brut;
      },
    );
  }
  return courante;
}

const garderLesVariablesNeon = (nom: string) =>
  nom.startsWith("--canop-glow-") || nom.startsWith("--canop-palette-");

function ancetresEtSoi(element: Element): Element[] {
  const chaine: Element[] = [];
  for (let courant: Element | null = element; courant; courant = courant.parentElement) {
    chaine.push(courant);
  }
  return chaine;
}

function poserMarqueurs(cible: Element, etat: EtatNeon) {
  const chaine = ancetresEtSoi(cible);
  if (etat === "survol") chaine.forEach((element) => element.classList.add(MARQUEURS.survol));
  if (etat === "focusSouris" || etat === "focusClavier") {
    cible.classList.add(MARQUEURS.focus);
    chaine.forEach((element) => element.classList.add(MARQUEURS.focusInterne));
  }
  if (etat === "focusClavier") {
    cible.classList.add(MARQUEURS.focusVisible);
    cible.closest(".MuiButtonBase-root")?.classList.add("Mui-focusVisible");
  }
}

function retirerMarqueurs() {
  for (const element of Array.from(document.querySelectorAll("*"))) {
    element.classList.remove(...Object.values(MARQUEURS));
  }
  document
    .querySelectorAll(".Mui-focusVisible")
    .forEach((element) => element.classList.remove("Mui-focusVisible"));
}

function dansLEtat<T>(cible: HTMLElement, etat: EtatNeon, lire: () => T): T {
  act(() => cible.blur());
  if (etat === "focusSouris" || etat === "focusClavier") act(() => cible.focus());
  retirerMarqueurs();
  poserMarqueurs(cible, etat);
  const resultat = lire();
  retirerMarqueurs();
  act(() => cible.blur());
  return resultat;
}

export function halosDuSousArbre(
  racine: Element,
  cible: HTMLElement = racine as HTMLElement,
  etat: EtatNeon = "repos",
): string[] {
  return dansLEtat(cible, etat, () => {
    const regles = reglesAplaties({});
    return [racine, ...Array.from(racine.querySelectorAll("*"))].flatMap((element) => {
      const applicables = reglesDe(element, regles);
      return PROPRIETES_DE_HALO.map((propriete) =>
        substituer(
          valeurGagnante(applicables, [propriete]),
          element,
          regles,
          garderLesVariablesNeon,
        ),
      ).filter((valeur) => valeur.includes("--canop-glow-"));
    });
  });
}

export function proprieteResolue(
  element: Element,
  proprietes: readonly string[],
  options: OptionsNeon = {},
): string {
  const regles = reglesAplaties(options);
  return substituer(
    valeurGagnante(reglesDe(element, regles), proprietes),
    element,
    regles,
    () => false,
  );
}

export function proprieteBrute(element: Element, proprietes: readonly string[]): string {
  return valeurGagnante(reglesDe(element, reglesAplaties({})), proprietes);
}

export function proprieteDansLEtat(cible: HTMLElement, etat: EtatNeon, propriete: string): string {
  return dansLEtat(cible, etat, () => proprieteBrute(cible, [propriete]));
}

export function estDeCouleur(halo: string, couleur: string): boolean {
  return halo.includes(`--canop-palette-${couleur}-main`);
}

export function forceDuHalo(halos: string[]): number {
  return halos
    .flatMap((halo) =>
      Array.from(halo.matchAll(/\)\s*\*\s*([\d.]+)\)/g), ([, facteur]) => Number(facteur)),
    )
    .reduce((somme, facteur) => somme + facteur, 0);
}

export function couchesDe(valeur: string): string[] {
  return decouperAuNiveauZero(valeur).filter((couche) => couche !== "");
}

export function dureeEnMs(valeur: string): number {
  const [, nombre, unite] = valeur.match(/^([\d.]+)(ms|s)$/) ?? [];
  if (nombre === undefined) return Number.NaN;
  return unite === "s" ? Number(nombre) * 1000 : Number(nombre);
}
