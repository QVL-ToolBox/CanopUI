import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";
import { ShapeBackground } from "..";
import {
  avancerFrames,
  coucheDecorative,
  installerEnvironnementLave,
  lueurs,
  quitterEnvironnementLave,
  rendreAvecTheme,
  simulerMouvementReduit,
  type EnvironnementLave,
} from "./lavaTestKit";
import { oublierMachine, simulerMachine } from "../../../test/halloweenDecorTestKit";

interface Redimensionneur {
  redimensionner: (largeur: number, hauteur: number) => void;
}

let environnement: EnvironnementLave;
let horloge = 0;

function installerRedimensionneur(): Redimensionneur {
  const observes = new Map<ResizeObserver, { rappel: ResizeObserverCallback; cibles: Element[] }>();
  let taille = { largeur: 320, hauteur: 200 };
  const entree = (target: Element) =>
    ({
      target,
      contentRect: { width: taille.largeur, height: taille.hauteur, top: 0, left: 0 },
      borderBoxSize: [{ inlineSize: taille.largeur, blockSize: taille.hauteur }],
      contentBoxSize: [{ inlineSize: taille.largeur, blockSize: taille.hauteur }],
    }) as unknown as ResizeObserverEntry;
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => taille.largeur);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(() => taille.hauteur);
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(() => taille.largeur);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => taille.hauteur);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () =>
      ({
        width: taille.largeur,
        height: taille.hauteur,
        top: 0,
        left: 0,
        right: taille.largeur,
        bottom: taille.hauteur,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect,
  );
  class ResizeObserverPilote {
    constructor(rappel: ResizeObserverCallback) {
      observes.set(this as unknown as ResizeObserver, { rappel, cibles: [] });
    }

    observe(cible: Element) {
      const suivi = observes.get(this as unknown as ResizeObserver);
      suivi?.cibles.push(cible);
      suivi?.rappel([entree(cible)], this as unknown as ResizeObserver);
    }

    unobserve() {}

    disconnect() {
      observes.delete(this as unknown as ResizeObserver);
    }
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverPilote);
  return {
    redimensionner: (largeur, hauteur) => {
      taille = { largeur, hauteur };
      act(() => {
        observes.forEach(({ rappel, cibles }, observateur) =>
          rappel(cibles.map(entree), observateur),
        );
      });
    },
  };
}

function rendreLave(animated = true) {
  return rendreAvecTheme(
    <ShapeBackground animated={animated} density={4}>
      <p>Contenu</p>
    </ShapeBackground>,
  );
}

function piloterHorloge() {
  horloge = 0;
  vi.spyOn(performance, "now").mockImplementation(() => horloge);
}

function imagesA(intervalleMs: number, nombre: number): number[] {
  const appelsParImage: number[] = [];
  for (let image = 0; image < nombre; image += 1) {
    horloge += intervalleMs;
    const avant = environnement.appelsCanvas.length;
    environnement.frames.avancer();
    appelsParImage.push(environnement.appelsCanvas.length - avant);
  }
  return appelsParImage;
}

function boucleActive(): boolean {
  avancerFrames(environnement.frames, 5);
  return environnement.frames.enAttente() > 0;
}

beforeEach(() => {
  environnement = installerEnvironnementLave();
});

afterEach(() => {
  quitterEnvironnementLave();
  oublierMachine();
  Reflect.deleteProperty(Element.prototype, "animate");
});

describe("AC4 — la lave reste animee quelle que soit la machine", () => {
  it.each([
    ["1 coeur et 1 Go", { coeurs: 1, memoireGo: 1 }],
    ["2 coeurs et 2 Go", { coeurs: 2, memoireGo: 2 }],
    ["8 coeurs et 8 Go", { coeurs: 8, memoireGo: 8 }],
  ])("anime la lave sur une machine a %s", (_label, machine) => {
    simulerMachine(machine);
    rendreLave();
    environnement.visibilite.afficher();

    expect(boucleActive()).toBe(true);
  });

  it("reste animee apres de nombreuses images lentes", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();

    imagesA(60, 30);

    expect(boucleActive()).toBe(true);
    expect(imagesA(60, 10).some((appels) => appels > 0)).toBe(true);
  });

  it("reste animee apres de longues pauses entre les images", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();

    imagesA(400, 15);

    expect(boucleActive()).toBe(true);
  });

  it("reste figee avec animated a false sur une machine puissante", () => {
    simulerMachine({ coeurs: 16, memoireGo: 16 });
    rendreLave(false);
    environnement.visibilite.afficher();

    expect(boucleActive()).toBe(false);
  });

  it("reste figee sous mouvement reduit sur une machine puissante", () => {
    simulerMachine({ coeurs: 16, memoireGo: 16 });
    simulerMouvementReduit(true);
    rendreLave();
    environnement.visibilite.afficher();

    expect(boucleActive()).toBe(false);
  });
});

function imagesPeintesConsecutives(appelsParImage: number[]): number {
  return appelsParImage.slice(1).filter((appels, index) => appels > 0 && appelsParImage[index] > 0)
    .length;
}

describe("AC4 — cadence de 30 images par seconde", () => {
  it("ne peint jamais deux images consecutives a 60 Hz", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(1000 / 60, 4);

    const appels = imagesA(1000 / 60, 60);

    expect(appels.some((appel) => appel > 0)).toBe(true);
    expect(imagesPeintesConsecutives(appels)).toBe(0);
  });

  it("peint des images consecutives quand elles arrivent a moins de 30 Hz", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 2);

    expect(imagesPeintesConsecutives(imagesA(40, 20))).toBeGreaterThan(0);
  });
});

describe("AC4 — taille de police racine lue une seule fois", () => {
  it("ne relit pas la taille de police racine a chaque image", () => {
    const lectures = vi.spyOn(window, "getComputedStyle");
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 2);
    const lecturesRacineAvant = lectures.mock.calls.filter(
      ([element]) => element === document.documentElement,
    ).length;

    imagesA(40, 30);

    const lecturesRacineApres = lectures.mock.calls.filter(
      ([element]) => element === document.documentElement,
    ).length;
    expect(lecturesRacineApres).toBe(lecturesRacineAvant);
  });
});

const TRANSFORM_INLINE =
  /^translate3d\(-?\d+(\.\d+)?rem, -?\d+(\.\d+)?rem, 0(px)?\) scale\(\d+(\.\d+)?\)$/;

function transformsDesLueurs(): Map<HTMLElement, string> {
  return new Map(lueurs().map((lueur) => [lueur, lueur.style.transform]));
}

function espionnerStylesDesLueurs(): MutationObserver {
  const observateur = new MutationObserver(() => undefined);
  observateur.observe(coucheDecorative(), {
    attributes: true,
    attributeFilter: ["style"],
    subtree: true,
  });
  return observateur;
}

function lueursReecrites(observateur: MutationObserver): Set<Node> {
  const reecrites = new Set(observateur.takeRecords().map(({ target }) => target));
  reecrites.forEach((cible) => {
    if (cible instanceof HTMLCanvasElement) reecrites.delete(cible);
  });
  return reecrites;
}

function espionnerAnimate() {
  const animate = vi.fn();
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    writable: true,
    value: animate,
  });
  return animate;
}

describe("AC4 — lueurs positionnees par transform inline depuis la boucle canvas", () => {
  it("rend un seul element sans enfant par masse avec un transform translate3d en rem et scale", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 3);

    const elements = lueurs();
    expect(elements.length).toBeGreaterThan(0);
    elements.forEach((lueur) => {
      expect(lueur.childElementCount).toBe(0);
      expect(lueur.style.transform).toMatch(TRANSFORM_INLINE);
    });
  });

  it("n'appelle jamais Element.animate", () => {
    const animate = espionnerAnimate();
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();

    imagesA(40, 30);

    expect(animate).not.toHaveBeenCalled();
  });

  it("deplace les lueurs pendant l'animation en reecrivant leur transform", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 3);
    const avant = transformsDesLueurs();

    imagesA(40, 60);

    const deplacees = lueurs().filter((lueur) => lueur.style.transform !== avant.get(lueur));
    expect(deplacees.length).toBeGreaterThan(0);
    lueurs().forEach((lueur) => expect(lueur.style.transform).toMatch(TRANSFORM_INLINE));
  });

  it("ne reecrit jamais les lueurs sur deux images consecutives a 60 Hz", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(1000 / 60, 4);
    const observateur = espionnerStylesDesLueurs();

    const reecrituresParImage = Array.from({ length: 60 }, () => {
      imagesA(1000 / 60, 1);
      return lueursReecrites(observateur).size;
    });
    observateur.disconnect();

    expect(reecrituresParImage.some((reecritures) => reecritures > 0)).toBe(true);
    expect(imagesPeintesConsecutives(reecrituresParImage)).toBe(0);
  });

  it("ne reecrit une lueur que lorsque sa position change", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 3);
    const observateur = espionnerStylesDesLueurs();

    for (let image = 0; image < 30; image += 1) {
      const avant = transformsDesLueurs();
      imagesA(40, 1);
      lueursReecrites(observateur).forEach((lueur) =>
        expect((lueur as HTMLElement).style.transform).not.toBe(avant.get(lueur as HTMLElement)),
      );
    }
    observateur.disconnect();
  });

  it("ne reecrit aucune lueur quand le temps ne s'ecoule pas", () => {
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 3);
    const observateur = espionnerStylesDesLueurs();

    imagesA(0, 30);

    expect(lueursReecrites(observateur).size).toBe(0);
    observateur.disconnect();
  });

  it.each([
    ["avec animated a false", false, false],
    ["sous mouvement reduit", true, true],
  ])("pose le transform une seule fois puis fige les lueurs %s", (_label, animated, reduit) => {
    simulerMouvementReduit(reduit);
    const animate = espionnerAnimate();
    piloterHorloge();
    rendreLave(animated);
    environnement.visibilite.afficher();
    const initiaux = transformsDesLueurs();
    expect(initiaux.size).toBeGreaterThan(0);
    initiaux.forEach((transform) => expect(transform).toMatch(TRANSFORM_INLINE));
    const observateur = espionnerStylesDesLueurs();

    imagesA(40, 30);

    expect(lueursReecrites(observateur).size).toBe(0);
    observateur.disconnect();
    expect(transformsDesLueurs()).toEqual(initiaux);
    expect(animate).not.toHaveBeenCalled();
    expect(boucleActive()).toBe(false);
  });
});

describe("AC4 — lueurs au redimensionnement", () => {
  function preparer() {
    const redimensionneur = installerRedimensionneur();
    piloterHorloge();
    rendreLave();
    environnement.visibilite.afficher();
    imagesA(40, 3);
    const initiaux = transformsDesLueurs();
    expect(initiaux.size).toBeGreaterThan(0);
    return { redimensionneur, initiaux, observateur: espionnerStylesDesLueurs() };
  }

  it("ne touche a rien quand la taille ne change pas", () => {
    const { redimensionneur, initiaux, observateur } = preparer();

    redimensionneur.redimensionner(320, 200);
    imagesA(0, 3);

    expect(lueursReecrites(observateur).size).toBe(0);
    observateur.disconnect();
    expect(transformsDesLueurs()).toEqual(initiaux);
  });

  it("reecrit le transform des memes elements quand la taille change", () => {
    const { redimensionneur, initiaux, observateur } = preparer();

    redimensionneur.redimensionner(640, 400);
    imagesA(0, 3);

    const reecrites = lueursReecrites(observateur);
    observateur.disconnect();
    const apres = transformsDesLueurs();
    expect(Array.from(apres.keys())).toEqual(Array.from(initiaux.keys()));
    expect(reecrites.size).toBeGreaterThan(0);
    const changees = Array.from(apres).filter(
      ([lueur, transform]) => transform !== initiaux.get(lueur),
    );
    expect(changees.length).toBeGreaterThan(0);
    apres.forEach((transform) => expect(transform).toMatch(TRANSFORM_INLINE));
  });
});
