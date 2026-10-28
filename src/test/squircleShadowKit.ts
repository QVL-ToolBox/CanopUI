type RegleGroupante = CSSRule & { cssRules: CSSRuleList };

const estGroupante = (regle: CSSRule): regle is RegleGroupante =>
  regle instanceof CSSMediaRule || regle instanceof CSSSupportsRule;

function toutesLesReglesDeStyle(): CSSStyleRule[] {
  const trouvees: CSSStyleRule[] = [];
  const parcourir = (regles: CSSRuleList) => {
    for (const regle of Array.from(regles)) {
      if (estGroupante(regle)) parcourir(regle.cssRules);
      else if (regle instanceof CSSStyleRule) trouvees.push(regle);
    }
  };
  for (const feuille of Array.from(document.styleSheets)) parcourir(feuille.cssRules);
  return trouvees;
}

function dernierComposant(selecteur: string): string {
  return (
    selecteur
      .trim()
      .split(/[\s>+~]+/)
      .at(-1) ?? ""
  );
}

function cibleLElementLuiMeme(selecteur: string, element: Element): boolean {
  const composant = dernierComposant(selecteur);
  if (composant.includes("::")) return false;
  const sansPseudoClasses = composant.replace(/:[a-z-]+(\([^)]*\))?/g, "");
  const classes = Array.from(sansPseudoClasses.matchAll(/\.([\w-]+)/g), (match) => match[1]);
  return classes.length > 0 && classes.every((classe) => element.classList.contains(classe));
}

export function valeursPortees(element: Element, propriete: string): string[] {
  return toutesLesReglesDeStyle()
    .filter((regle) =>
      regle.selectorText.split(",").some((selecteur) => cibleLElementLuiMeme(selecteur, element)),
    )
    .map((regle) => regle.style.getPropertyValue(propriete).trim())
    .filter((valeur) => valeur !== "");
}

function texteDesStyles(): string {
  return Array.from(document.querySelectorAll("style"))
    .map((balise) => balise.textContent ?? "")
    .join("");
}

export function declarationsDeVariable(nom: string): string[] {
  const motif = new RegExp(`${nom}:([^;}]*)`, "g");
  return Array.from(texteDesStyles().matchAll(motif), (match) => match[1].trim());
}

export function resoudre(valeur: string): string {
  return valeur.replace(/var\((--[\w-]+)\)/g, (brut, nom: string) => {
    const declarations = declarationsDeVariable(nom);
    return declarations.length > 0 ? declarations.map(resoudre).join(" | ") : brut;
  });
}

export function estDecoupeEnSquircle(element: Element): boolean {
  return valeursPortees(element, "clip-path").some((valeur) =>
    resoudre(valeur).includes("polygon("),
  );
}

export function porteUnDropShadow(element: Element): boolean {
  return valeursPortees(element, "filter").some((valeur) =>
    resoudre(valeur).includes("drop-shadow("),
  );
}

export function porteUnOverflowMasque(element: Element): boolean {
  return valeursPortees(element, "overflow").includes("hidden");
}

export function porteUnFond(element: Element): boolean {
  return ["background", "background-color"].some((propriete) =>
    valeursPortees(element, propriete).some(
      (valeur) => valeur !== "transparent" && valeur !== "none",
    ),
  );
}

export function elementsDecoupesEtOmbres(racine: ParentNode = document.body): Element[] {
  return Array.from(racine.querySelectorAll("*")).filter(
    (element) => estDecoupeEnSquircle(element) && porteUnDropShadow(element),
  );
}
