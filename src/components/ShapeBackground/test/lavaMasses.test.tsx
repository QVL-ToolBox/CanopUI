import { afterEach, describe, expect, it } from "vitest";
import { ShapeBackground } from "..";
import { blobAt, lavaMasses, type LavaMass } from "../lavaMasses";
import {
  lueurs,
  quitterEnvironnementLave,
  installerEnvironnementLave,
  rendreAvecTheme,
} from "./lavaTestKit";

const BORD_MIN = 0.12;
const BORD_MAX = 0.88;
const DENSITE_MAX = 10;

function centres(masses: LavaMass[]) {
  return masses.map(({ centerX, centerY }) => ({ centerX, centerY }));
}

function estPositionnee(element: HTMLElement): boolean {
  const { left, top } = getComputedStyle(element);
  return left !== "" && left !== "auto" && top !== "" && top !== "auto";
}

function ancreDe(lueur: HTMLElement): HTMLElement {
  let courant: HTMLElement | null = lueur;
  while (courant && !estPositionnee(courant)) courant = courant.parentElement;
  if (!courant) throw new Error("ancre de la lueur introuvable");
  return courant;
}

function positionsRendues(density?: number): string[] {
  const { unmount } = rendreAvecTheme(<ShapeBackground density={density}>Contenu</ShapeBackground>);
  const positions = lueurs().map((lueur) => {
    const { left, top } = getComputedStyle(ancreDe(lueur));
    return `${left} ${top}`;
  });
  unmount();
  return positions;
}

describe("Masses de lave — déterminisme", () => {
  afterEach(() => {
    quitterEnvironnementLave();
  });

  it("produit les mêmes masses à chaque appel", () => {
    expect(lavaMasses(DENSITE_MAX)).toEqual(lavaMasses(DENSITE_MAX));
  });

  it("place une masse au même endroit au même instant", () => {
    lavaMasses(DENSITE_MAX).forEach((masse) => {
      expect(blobAt(masse, 12.5)).toEqual(blobAt(masse, 12.5));
    });
  });

  it("ajoute des masses sans déplacer les existantes quand la densité augmente", () => {
    for (let densite = 1; densite < DENSITE_MAX; densite += 1) {
      const moins = lavaMasses(densite);
      const plus = lavaMasses(densite + 1);
      expect(plus).toHaveLength(densite + 1);
      expect(plus.slice(0, densite)).toEqual(moins);
    }
  });

  it("rend les mêmes positions de masses d'un rendu à l'autre", () => {
    installerEnvironnementLave();
    const premier = positionsRendues();
    expect(premier.length).toBeGreaterThan(0);
    expect(new Set(premier).size).toBe(premier.length);
    expect(positionsRendues()).toEqual(premier);
  });

  it("conserve la position des masses existantes à l'écran quand la densité augmente", () => {
    installerEnvironnementLave();
    const troisMasses = positionsRendues(3);
    const septMasses = positionsRendues(7);
    expect(troisMasses).toHaveLength(3);
    expect(septMasses).toHaveLength(7);
    expect(new Set(septMasses).size).toBe(7);
    expect(septMasses.slice(0, 3)).toEqual(troisMasses);
  });
});

describe("Masses de lave — répartition", () => {
  it.each(Array.from({ length: DENSITE_MAX }, (_, index) => index + 1))(
    "garde les centres entre 12 %% et 88 %% sur les deux axes pour %s masses",
    (densite) => {
      centres(lavaMasses(densite)).forEach(({ centerX, centerY }) => {
        expect(centerX).toBeGreaterThanOrEqual(BORD_MIN);
        expect(centerX).toBeLessThanOrEqual(BORD_MAX);
        expect(centerY).toBeGreaterThanOrEqual(BORD_MIN);
        expect(centerY).toBeLessThanOrEqual(BORD_MAX);
      });
    },
  );

  it("place des masses dans la moitié basse", () => {
    expect(lavaMasses(DENSITE_MAX).some(({ centerY }) => centerY > 0.5)).toBe(true);
  });

  it("couvre les quatre quadrants de la surface", () => {
    const masses = centres(lavaMasses(DENSITE_MAX));
    const quadrants = new Set(
      masses.map(
        ({ centerX, centerY }) => `${centerX < 0.5 ? "g" : "d"}${centerY < 0.5 ? "h" : "b"}`,
      ),
    );
    expect(quadrants.size).toBe(4);
  });
});
