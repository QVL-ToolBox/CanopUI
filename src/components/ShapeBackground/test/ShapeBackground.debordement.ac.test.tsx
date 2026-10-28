import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ShapeBackground } from "..";
import type { CanopShapeVariant } from "../../../index";
import {
  coucheDecorative,
  installerEnvironnementLave,
  lueurs,
  quitterEnvironnementLave,
  rendreAvecTheme,
} from "./lavaTestKit";

const VARIANTES: CanopShapeVariant[] = ["hero", "ambient"];
const DEBORDEMENT = "-3rem";

function surfaceDeCalcul(): HTMLElement {
  const toile = document.querySelector("canvas");
  if (!toile?.parentElement) throw new Error("toile de lave introuvable");
  return toile.parentElement;
}

function ancetresJusquA(depart: HTMLElement, arret: HTMLElement): HTMLElement[] {
  const chaine: HTMLElement[] = [];
  for (
    let noeud = depart.parentElement;
    noeud && noeud !== arret.parentElement;
    noeud = noeud.parentElement
  ) {
    chaine.push(noeud);
  }
  return chaine;
}

describe.each(VARIANTES)("AC10 ShapeBackground %s : lave calculée hors cadre", (variant) => {
  beforeEach(() => {
    installerEnvironnementLave();
    rendreAvecTheme(
      <ShapeBackground variant={variant}>
        <p>Contenu de page</p>
      </ShapeBackground>,
    );
  });

  afterEach(() => {
    quitterEnvironnementLave();
  });

  it("calcule la lave sur une surface qui déborde du cadre de 3rem de chaque côté", () => {
    const surface = getComputedStyle(surfaceDeCalcul());
    expect(surface.position).toBe("absolute");
    expect(surface.getPropertyValue("inset")).toBe(DEBORDEMENT);
  });

  it("rogne cette surface dans une couche en overflow hidden", () => {
    const couche = coucheDecorative();
    const rognantes = ancetresJusquA(surfaceDeCalcul(), couche).filter(
      (noeud) => getComputedStyle(noeud).overflow === "hidden",
    );
    expect(rognantes.length).toBeGreaterThan(0);
  });

  it("cale la couche rognante sur le cadre visible", () => {
    const couche = getComputedStyle(coucheDecorative());
    expect(couche.overflow).toBe("hidden");
    expect(couche.getPropertyValue("inset")).toMatch(/^0(px)?$/);
  });

  it("place toutes les lueurs dans la surface débordante", () => {
    const surface = surfaceDeCalcul();
    expect(lueurs().length).toBeGreaterThan(0);
    expect(lueurs().every((lueur) => surface.contains(lueur))).toBe(true);
  });

  it("laisse le contenu de page hors de la couche décorative", () => {
    const contenu = document.querySelector("p") as HTMLElement;
    expect(coucheDecorative().contains(contenu)).toBe(false);
  });
});
