import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../theme";
import { declarationsDe } from "./cssRules";

export interface ReglePosee {
  selecteur: string;
  valeur: string;
}

export function poser(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

export function racineDeCarte(container: HTMLElement): HTMLElement {
  return container.querySelector(".MuiCard-root") as HTMLElement;
}

export function reglesDe(element: Element, propriete: string): ReglePosee[] {
  const classes = Array.from(element.classList);
  const trouvees: ReglePosee[] = [];
  const parcourir = (regles: CSSRuleList) => {
    for (const regle of Array.from(regles)) {
      if (regle instanceof CSSMediaRule) parcourir(regle.cssRules);
      if (!(regle instanceof CSSStyleRule)) continue;
      if (!classes.some((classe) => regle.selectorText.includes(`.${classe}`))) continue;
      const valeur = regle.style.getPropertyValue(propriete);
      if (valeur !== "") trouvees.push({ selecteur: regle.selectorText, valeur });
    }
  };
  for (const feuille of Array.from(document.styleSheets)) parcourir(feuille.cssRules);
  return trouvees;
}

export function fondsDe(element: Element): string[] {
  return declarationsDe(element, "background-color")
    .filter((entree) => entree.condition === "")
    .map((entree) => entree.valeur);
}

export function espionDeToucheSurDocument() {
  const evenements: KeyboardEvent[] = [];
  const ecouteur = (evenement: KeyboardEvent) => evenements.push(evenement);
  document.addEventListener("keydown", ecouteur);
  return {
    evenements,
    retirer: () => document.removeEventListener("keydown", ecouteur),
  };
}
