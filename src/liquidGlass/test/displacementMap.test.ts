import { afterEach, describe, expect, it } from "vitest";
import {
  createDisplacementMap,
  displacementPixels,
  type DisplacementMapGeometry,
} from "../displacementMap";
import { installerCanvas, revenirAJsdom } from "../../test/liquidGlassTestKit";

const NEUTRE = 128;
const GEOMETRIE: DisplacementMapGeometry = {
  width: 100,
  height: 60,
  radius: 20,
  bevel: 15,
  exponent: 4,
};

afterEach(revenirAJsdom);

function lecteur(geometrie: DisplacementMapGeometry) {
  const pixels = displacementPixels(geometrie);
  return (x: number, y: number) => {
    const debut = (y * geometrie.width + x) * 4;
    const [r, g, b, a] = Array.from(pixels.slice(debut, debut + 4));
    return { r, g, b, a };
  };
}

describe("AC-R3 - displacementPixels", () => {
  const pixel = lecteur(GEOMETRIE);
  const milieuX = Math.floor(GEOMETRIE.width / 2);
  const milieuY = Math.floor(GEOMETRIE.height / 2);
  const dernierX = GEOMETRIE.width - 1;
  const dernierY = GEOMETRIE.height - 1;

  it("produit un pixel RGBA par point de la carte", () => {
    expect(displacementPixels(GEOMETRIE)).toHaveLength(GEOMETRIE.width * GEOMETRIE.height * 4);
  });

  it("laisse le centre neutre", () => {
    expect(pixel(milieuX, milieuY)).toMatchObject({ r: NEUTRE, g: NEUTRE });
  });

  it("pousse vers la droite sur le bord gauche sans deplacement vertical", () => {
    const bord = pixel(0, milieuY);
    expect(bord.r).toBeGreaterThan(NEUTRE);
    expect(bord.g).toBe(NEUTRE);
  });

  it("pousse vers le bas sur le bord haut", () => {
    expect(pixel(milieuX, 0).g).toBeGreaterThan(NEUTRE);
  });

  it("pousse vers la gauche sur le bord droit", () => {
    expect(pixel(dernierX, milieuY).r).toBeLessThan(NEUTRE);
  });

  it("pousse vers le haut sur le bord bas", () => {
    expect(pixel(milieuX, dernierY).g).toBeLessThan(NEUTRE);
  });

  it("est symetrique horizontalement : R(x) + R(miroir de x) = 256", () => {
    for (let x = 0; x < GEOMETRIE.width; x += 1) {
      expect(pixel(x, milieuY).r + pixel(dernierX - x, milieuY).r).toBe(256);
    }
  });

  it("pousse en diagonale dans le coin haut gauche", () => {
    const coin = pixel(4, 4);
    expect(coin.r).toBeGreaterThan(NEUTRE);
    expect(coin.g).toBeGreaterThan(NEUTRE);
  });

  it.each([
    { width: 100, height: 60 },
    { width: 1, height: 1 },
    { width: 37, height: 211 },
  ])("rend une carte entierement neutre avec bevel 0 ($width x $height)", (taille) => {
    const pixels = displacementPixels({ ...GEOMETRIE, ...taille, bevel: 0 });
    expect(pixels).toHaveLength(taille.width * taille.height * 4);
    pixels.forEach((valeur, index) => expect(valeur).toBe(index % 4 === 3 ? 255 : NEUTRE));
  });
});

describe("AC-R4 - cache des cartes de deplacement", () => {
  const GEOMETRIE_DU_CACHE: DisplacementMapGeometry = {
    width: 137,
    height: 91,
    radius: 13,
    bevel: 7,
    exponent: 4,
  };

  it("ne peint qu'une fois deux cartes de meme geometrie", () => {
    const toDataURL = installerCanvas();
    const premiere = createDisplacementMap(GEOMETRIE_DU_CACHE);
    const seconde = createDisplacementMap({ ...GEOMETRIE_DU_CACHE });
    expect(toDataURL).toHaveBeenCalledTimes(1);
    expect(seconde).toBe(premiere);
  });

  it("peint de nouveau pour une geometrie differente", () => {
    const toDataURL = installerCanvas();
    createDisplacementMap({ ...GEOMETRIE_DU_CACHE, width: 149 });
    createDisplacementMap({ ...GEOMETRIE_DU_CACHE, width: 151 });
    expect(toDataURL).toHaveBeenCalledTimes(2);
  });
});
