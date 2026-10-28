export interface CanopStyleDeclaration {
  condition: string;
  valeur: string;
}

export interface CanopStyleRegle extends CanopStyleDeclaration {
  selecteur: string;
}

export interface CanopRegleEmise {
  conditions: string[];
  selecteur: string;
  style: CSSStyleDeclaration;
}

type RegleGroupante = CSSRule & { cssRules: CSSRuleList; conditionText: string };

const estGroupante = (regle: CSSRule): regle is RegleGroupante =>
  regle instanceof CSSMediaRule || regle instanceof CSSSupportsRule;

const classesEmotion = (element: Element) =>
  Array.from(element.classList).filter((classe) => classe.startsWith("css-"));

function reglesPortant(classes: string[]): CanopRegleEmise[] {
  const trouvees: CanopRegleEmise[] = [];

  const parcourir = (regles: CSSRuleList, conditions: string[]) => {
    for (const regle of Array.from(regles)) {
      if (estGroupante(regle)) {
        parcourir(regle.cssRules, [...conditions, regle.conditionText]);
        continue;
      }
      if (!(regle instanceof CSSStyleRule)) continue;
      if (!classes.some((classe) => regle.selectorText.includes(`.${classe}`))) continue;
      trouvees.push({ conditions, selecteur: regle.selectorText, style: regle.style });
    }
  };

  for (const feuille of Array.from(document.styleSheets)) parcourir(feuille.cssRules, []);
  return trouvees;
}

export function reglesEmises(element: Element): CanopRegleEmise[] {
  return reglesPortant(classesEmotion(element));
}

export function reglesDe(element: Element, propriete: string): CanopStyleRegle[] {
  return reglesPortant(Array.from(element.classList))
    .map(({ conditions, selecteur, style }) => ({
      condition: conditions.join(" and "),
      selecteur,
      valeur: style.getPropertyValue(propriete),
    }))
    .filter((entree) => entree.valeur !== "");
}

export function declarationsDe(element: Element, propriete: string): CanopStyleDeclaration[] {
  return reglesDe(element, propriete).map(({ condition, valeur }) => ({ condition, valeur }));
}

export function valeurAuPalier(element: Element, propriete: string, rem: number): string {
  const palier = `(min-width:${rem}rem)`;
  return (
    declarationsDe(element, propriete).find((entree) => entree.condition === palier)?.valeur ?? ""
  );
}

export function valeurFixe(element: Element, propriete: string): string {
  return declarationsDe(element, propriete).find((entree) => entree.condition === "")?.valeur ?? "";
}

export function declarationsEmotionDe(
  element: Element,
  propriete: string,
  porteurs: Element[] = [element],
): CanopStyleRegle[] {
  const classes = porteurs.flatMap(classesEmotion);
  return reglesDe(element, propriete).filter((entree) =>
    classes.some((classe) => entree.selecteur.includes(`.${classe}`)),
  );
}

export function valeursEmises(
  element: Element,
  propriete: string,
  suffixe = "",
  conditions: string[] = [],
): string[] {
  const classes = classesEmotion(element);
  return reglesEmises(element)
    .filter((regle) => regle.conditions.join("|") === conditions.join("|"))
    .filter((regle) => classes.some((classe) => regle.selecteur === `.${classe}${suffixe}`))
    .map((regle) => regle.style.getPropertyValue(propriete))
    .filter((valeur) => valeur !== "");
}

export function derniereValeurEmise(
  element: Element,
  propriete: string,
  suffixe = "",
  conditions: string[] = [],
): string {
  return valeursEmises(element, propriete, suffixe, conditions).at(-1) ?? "";
}

export function derniereValeurDansLeGroupe(
  element: Element,
  propriete: string,
  suffixe = "",
): string {
  const classes = classesEmotion(element);
  return (
    reglesEmises(element)
      .filter((regle) => regle.conditions.length === 0)
      .filter((regle) =>
        regle.selecteur
          .split(",")
          .map((partie) => partie.trim())
          .some((partie) => classes.some((classe) => partie === `.${classe}${suffixe}`)),
      )
      .map((regle) => regle.style.getPropertyValue(propriete))
      .filter((valeur) => valeur !== "")
      .at(-1) ?? ""
  );
}

export function blocsBrutsDe(element: Element): string[] {
  const texte = Array.from(document.querySelectorAll("style"))
    .map((balise) => balise.textContent ?? "")
    .join("");
  return classesEmotion(element).flatMap(
    (classe) => texte.match(new RegExp(`\\.${classe}(?::[a-z-:]+)?\\{[^}]*\\}`, "g")) ?? [],
  );
}
