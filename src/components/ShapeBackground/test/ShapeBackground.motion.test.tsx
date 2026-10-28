import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ShapeBackground } from "..";
import {
  avancerFrames,
  changerOnglet,
  installerEnvironnementLave,
  quitterEnvironnementLave,
  rendreAvecTheme,
  simulerMouvementReduit,
  type EnvironnementLave,
} from "./lavaTestKit";

const FRAMES_OBSERVEES = 5;

let environnement: EnvironnementLave;

function rendreFond(animated?: boolean) {
  return rendreAvecTheme(
    <ShapeBackground animated={animated}>
      <p>Contenu de page</p>
    </ShapeBackground>,
  );
}

function boucleActive(): boolean {
  avancerFrames(environnement.frames, FRAMES_OBSERVEES);
  return environnement.frames.enAttente() > 0;
}

describe("ShapeBackground — mouvement", () => {
  beforeEach(() => {
    environnement = installerEnvironnementLave();
  });

  afterEach(() => {
    quitterEnvironnementLave();
  });

  it("affiche une image fixe sans boucle d'animation par défaut", () => {
    rendreFond();
    expect(boucleActive()).toBe(false);
  });

  it("affiche une image fixe sans boucle d'animation avec animated à false", () => {
    rendreFond(false);
    expect(boucleActive()).toBe(false);
  });

  it("dessine quand même la trame en image fixe", () => {
    rendreFond(false);
    avancerFrames(environnement.frames, FRAMES_OBSERVEES);
    expect(environnement.appelsCanvas.length).toBeGreaterThan(0);
  });

  it("anime en continu quand animated est actif, à l'écran et onglet visible", () => {
    rendreFond(true);
    environnement.visibilite.afficher();
    expect(boucleActive()).toBe(true);
    expect(boucleActive()).toBe(true);
  });

  it("n'anime pas quand l'utilisateur préfère réduire les animations", () => {
    simulerMouvementReduit(true);
    rendreFond(true);
    environnement.visibilite.afficher();
    expect(boucleActive()).toBe(false);
  });

  it("met la boucle en pause quand le fond sort de l'écran", () => {
    rendreFond(true);
    environnement.visibilite.afficher();
    expect(boucleActive()).toBe(true);
    environnement.visibilite.masquer();
    expect(boucleActive()).toBe(false);
  });

  it("reprend la boucle quand le fond revient à l'écran", () => {
    rendreFond(true);
    environnement.visibilite.masquer();
    expect(boucleActive()).toBe(false);
    environnement.visibilite.afficher();
    expect(boucleActive()).toBe(true);
  });

  it("met la boucle en pause quand l'onglet est masqué", () => {
    rendreFond(true);
    environnement.visibilite.afficher();
    expect(boucleActive()).toBe(true);
    changerOnglet("hidden");
    expect(boucleActive()).toBe(false);
  });

  it("reprend la boucle quand l'onglet redevient visible", () => {
    rendreFond(true);
    environnement.visibilite.afficher();
    changerOnglet("hidden");
    expect(boucleActive()).toBe(false);
    changerOnglet("visible");
    expect(boucleActive()).toBe(true);
  });

  it("reste en pause tant que le fond est hors écran même si l'onglet redevient visible", () => {
    rendreFond(true);
    environnement.visibilite.masquer();
    changerOnglet("hidden");
    changerOnglet("visible");
    expect(boucleActive()).toBe(false);
  });

  it("arrête la boucle quand animated repasse à false", () => {
    const { rerender } = rendreFond(true);
    environnement.visibilite.afficher();
    expect(boucleActive()).toBe(true);
    rerender(
      <ShapeBackground animated={false}>
        <p>Contenu de page</p>
      </ShapeBackground>,
    );
    expect(boucleActive()).toBe(false);
  });
});
