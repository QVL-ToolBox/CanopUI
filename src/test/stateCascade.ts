import { act } from "@testing-library/react";

export type CanopEtatInteraction = "repos" | "survol" | "focusSouris" | "focusClavier";

export type CanopRendu = Record<string, string>;

interface RegleAplatie {
  partie: string;
  pseudoElement: string;
  specificite: number;
  ordre: number;
  style: CSSStyleDeclaration;
}

const PSEUDO_ELEMENTS = ["", "::before", "::after"] as const;

const PROPRIETES_VISUELLES = [
  "color",
  "background-color",
  "background-image",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-style",
  "border-right-style",
  "border-bottom-style",
  "border-left-style",
  "outline",
  "outline-color",
  "outline-style",
  "outline-width",
  "outline-offset",
  "box-shadow",
  "filter",
  "transform",
  "text-decoration",
  "text-decoration-line",
  "opacity",
] as const;

const MARQUEURS = {
  survol: "canop-etat-survol",
  focus: "canop-etat-focus",
  focusVisible: "canop-etat-focus-visible",
  focusInterne: "canop-etat-focus-interne",
  actif: "canop-etat-actif",
} as const;

const VALEURS_NEUTRES = new Set(["", "none", "0", "0px", "medium", "initial"]);

const CONDITIONS_BUREAU = /^(\(hover: ?hover\)|\(min-width: ?0(rem|px)?\))$/;

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

function decouperSelecteur(selecteur: string): string[] {
  const parties: string[] = [];
  let profondeur = 0;
  let courante = "";
  for (const caractere of selecteur) {
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

function reglesActives(): RegleAplatie[] {
  const regles: RegleAplatie[] = [];
  const parcourir = (liste: CSSRuleList, applicable: boolean) => {
    for (const regle of Array.from(liste)) {
      if (regle instanceof CSSMediaRule) {
        parcourir(regle.cssRules, applicable && CONDITIONS_BUREAU.test(regle.conditionText));
        continue;
      }
      if (regle instanceof CSSSupportsRule) {
        parcourir(regle.cssRules, false);
        continue;
      }
      if (!(regle instanceof CSSStyleRule) || !applicable) continue;
      for (const partie of decouperSelecteur(regle.selectorText)) {
        const pseudoElement = partie.match(/::[\w-]+$/)?.[0] ?? "";
        regles.push({
          partie: versMarqueurs(partie.slice(0, partie.length - pseudoElement.length)),
          pseudoElement,
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
    return partie !== "" && element.matches(partie);
  } catch {
    return false;
  }
}

function valeurResolue(regles: RegleAplatie[], propriete: string): string {
  const candidates = regles
    .map((regle) => ({
      regle,
      valeur: regle.style.getPropertyValue(propriete),
      important: regle.style.getPropertyPriority(propriete) === "important",
    }))
    .filter((candidate) => candidate.valeur !== "")
    .sort(
      (a, b) =>
        Number(a.important) - Number(b.important) ||
        a.regle.specificite - b.regle.specificite ||
        a.regle.ordre - b.regle.ordre,
    );
  const valeur = candidates.at(-1)?.valeur ?? "";
  return VALEURS_NEUTRES.has(valeur) || (propriete === "color" && valeur === "inherit")
    ? ""
    : valeur;
}

function variablesDuDocument(regles: RegleAplatie[]): Map<string, string> {
  const variables = new Map<string, string>();
  const racine = document.documentElement;
  regles
    .filter((regle) => regle.pseudoElement === "" && correspond(racine, regle.partie))
    .sort((a, b) => a.specificite - b.specificite || a.ordre - b.ordre)
    .forEach((regle) => {
      for (const nom of Array.from(regle.style)) {
        if (nom.startsWith("--")) variables.set(nom, regle.style.getPropertyValue(nom).trim());
      }
    });
  return variables;
}

function hexVersRgb(hex: string): string {
  const chiffres = hex.slice(1);
  const complet =
    chiffres.length === 3
      ? chiffres
          .split("")
          .map((chiffre) => chiffre + chiffre)
          .join("")
      : chiffres;
  const [r, g, b] = [0, 2, 4].map((debut) => parseInt(complet.slice(debut, debut + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

function normaliser(valeur: string, variables: Map<string, string>): string {
  let courante = valeur;
  for (let passe = 0; passe < 5; passe += 1) {
    courante = courante.replace(
      /var\((--[\w-]+)\)/g,
      (brut, nom: string) => variables.get(nom) ?? brut,
    );
  }
  return courante.replace(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi, hexVersRgb);
}

const COTES = ["top", "right", "bottom", "left"] as const;

function sansTraitsInvisibles(valeurs: Map<string, string>) {
  for (const cote of COTES) {
    if (valeurs.has(`border-${cote}-style`)) continue;
    valeurs.delete(`border-${cote}-width`);
    valeurs.delete(`border-${cote}-color`);
  }
  if (!valeurs.has("outline-style") && !valeurs.has("outline")) {
    valeurs.delete("outline-width");
    valeurs.delete("outline-color");
    valeurs.delete("outline-offset");
  }
}

function couleurEffective(regles: RegleAplatie[], element: Element): string {
  for (let courant: Element | null = element; courant; courant = courant.parentElement) {
    const porteur = courant;
    const applicables = regles.filter(
      (regle) => regle.pseudoElement === "" && correspond(porteur, regle.partie),
    );
    const valeur = valeurResolue(applicables, "color");
    if (valeur !== "") return valeur;
  }
  return "";
}

function renduDe(elements: Element[]): CanopRendu {
  const regles = reglesActives();
  const variables = variablesDuDocument(regles);
  const rendu: CanopRendu = {};
  elements.forEach((element, index) => {
    for (const pseudoElement of PSEUDO_ELEMENTS) {
      const applicables = regles.filter(
        (regle) => regle.pseudoElement === pseudoElement && correspond(element, regle.partie),
      );
      const valeurs = new Map<string, string>();
      for (const propriete of PROPRIETES_VISUELLES) {
        const valeur =
          propriete === "color" && pseudoElement === "" && index === 0
            ? couleurEffective(regles, element)
            : valeurResolue(applicables, propriete);
        if (valeur !== "") valeurs.set(propriete, normaliser(valeur, variables));
      }
      sansTraitsInvisibles(valeurs);
      valeurs.forEach((valeur, propriete) => {
        rendu[`${index}${pseudoElement} ${propriete}`] = valeur;
      });
    }
  });
  return rendu;
}

function ancetresEtSoi(element: Element): Element[] {
  const chaine: Element[] = [];
  for (let courant: Element | null = element; courant; courant = courant.parentElement) {
    chaine.push(courant);
  }
  return chaine;
}

function poserMarqueurs(cible: Element, etat: CanopEtatInteraction) {
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

function retirerMarqueurs(racine: Element) {
  for (const element of [racine, ...Array.from(document.querySelectorAll("*"))]) {
    element.classList.remove(...Object.values(MARQUEURS));
    if (element.classList.length === 0) element.removeAttribute("class");
  }
}

function retirerFocusVisibleNatif() {
  document
    .querySelectorAll(".Mui-focusVisible")
    .forEach((element) => element.classList.remove("Mui-focusVisible"));
}

export function renduDansLEtat(
  cible: HTMLElement,
  racine: Element,
  etat: CanopEtatInteraction,
): CanopRendu {
  act(() => cible.blur());
  if (etat === "focusSouris" || etat === "focusClavier") act(() => cible.focus());
  retirerFocusVisibleNatif();
  poserMarqueurs(cible, etat);
  const rendu = renduDe([racine, ...Array.from(racine.querySelectorAll("*"))]);
  retirerMarqueurs(racine);
  act(() => cible.blur());
  return rendu;
}
