import { createElement } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";
import { CanopThemeProvider } from "../theme";
import { derniereValeurEmise } from "./cssRules";

export const VARIABLE_DE_DECOUPE = "--canop-squircle-clip";
export const DECOUPE_PAR_LE_SQUIRCLE = "var(--canop-squircle-clip, none)";
export const ECHELLE_JUSQU_AUX_COINS = Math.SQRT2;

type Mode = "light" | "dark";

export function poserDansLeTheme(ui: React.ReactElement, mode: Mode = "light") {
  return render(createElement(CanopThemeProvider, { mode, children: ui }));
}

export const sansEspaces = (valeur: string) => valeur.replace(/\s+/g, "");

function styleCalculeFrais(element: Element, propriete: string): string {
  document.head.appendChild(document.createElement("style")).remove();
  return getComputedStyle(element).getPropertyValue(propriete).trim();
}

export function decoupeVue(element: Element): string {
  return styleCalculeFrais(element, VARIABLE_DE_DECOUPE);
}

export function arrondi(element: Element): string {
  return styleCalculeFrais(element, "border-radius");
}

export function estUnSquircle(valeur: string): boolean {
  return valeur.startsWith("polygon(");
}

export function nePorteAucunSquircle(element: Element): boolean {
  return ["", "initial"].includes(decoupeVue(element));
}

export function presser(element: Element): HTMLElement {
  act(() => {
    fireEvent.mouseDown(element);
  });
  const racine = element.querySelector<HTMLElement>(":scope > .MuiTouchRipple-root");
  if (!racine) throw new Error("aucun ripple enfant direct apres la pression");
  return racine;
}

export function decoupeDuRipple(element: Element): string {
  return styleCalculeFrais(presser(element), "clip-path");
}

export function arrondiDuRipple(element: Element): string {
  return arrondi(presser(element));
}

export async function echelleDeLOnde(element: Element): Promise<number> {
  const racine = presser(element);
  await act(async () => {});
  const onde = racine.querySelector(".MuiTouchRipple-ripple");
  if (!onde) throw new Error("aucune onde apres la pression");
  return Number(styleCalculeFrais(onde, "scale"));
}

export function formeDuFond(element: Element): string {
  return derniereValeurEmise(element, "clip-path", "::before");
}

export function contourExterieurDuFondEstLaDecoupe(element: Element): boolean {
  const fond = formeDuFond(element);
  if (fond.startsWith(`var(${VARIABLE_DE_DECOUPE}`)) return true;
  const contourDuRipple = sansEspaces(decoupeVue(element)).replace(/\)$/, "");
  return contourDuRipple !== "" && sansEspaces(fond).startsWith(contourDuRipple);
}

export function simulerLaModaliteClavier() {
  const correspondanceNative = Element.prototype.matches;
  return vi.spyOn(Element.prototype, "matches").mockImplementation(function (
    this: Element,
    selecteur: string,
  ) {
    if (selecteur === ":focus-visible") return this === document.activeElement;
    return correspondanceNative.call(this, selecteur);
  });
}

export async function focaliserAuClavier(element: HTMLElement) {
  fireEvent.keyDown(element, { key: "Tab" });
  act(() => element.focus());
  await act(async () => {});
}

export function ondesDeFocus(element: Element): number {
  return element.querySelectorAll(".MuiTouchRipple-ripplePulsate").length;
}
