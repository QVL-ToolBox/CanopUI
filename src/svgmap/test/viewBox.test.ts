import { describe, expect, it } from "vitest";
import {
  clampViewBox,
  fitViewBox,
  formatViewBox,
  isZoomed,
  panViewBox,
  parseViewBox,
  viewBoxAspect,
  zoomViewBox,
  type CanopViewBox,
} from "../viewBox";

const BASE: CanopViewBox = { x: 0, y: 0, width: 800, height: 400 };
const LIMITS = { minWidth: 100 };

describe("parseViewBox", () => {
  it("lit des nombres séparés par des espaces", () => {
    expect(parseViewBox("0 0 800 400")).toEqual(BASE);
  });

  it("lit des nombres séparés par des virgules", () => {
    expect(parseViewBox("10,20,30,40")).toEqual({ x: 10, y: 20, width: 30, height: 40 });
  });

  it("tolère les espaces multiples et les bords", () => {
    expect(parseViewBox("  0   0  800   400 ")).toEqual(BASE);
  });

  it("accepte des coordonnées négatives, légales dans un SVG", () => {
    expect(parseViewBox("-50 -20 100 50")).toEqual({ x: -50, y: -20, width: 100, height: 50 });
  });

  it("refuse ce qui ne décrit pas une vue", () => {
    for (const entree of ["", "0 0 800", "0 0 800 400 5", "a b c d", "0 0 0 400", "0 0 800 -1"]) {
      expect(parseViewBox(entree)).toBeNull();
    }
  });
});

describe("formatViewBox", () => {
  it("rend un attribut relisible", () => {
    expect(parseViewBox(formatViewBox(BASE))).toEqual(BASE);
  });
});

describe("clampViewBox", () => {
  it("déduit la hauteur du rapport, au lieu de la transporter", () => {
    const serre = clampViewBox({ x: 0, y: 0, width: 400, height: 999 }, BASE, LIMITS);
    expect(serre.height).toBe(200);
    expect(viewBoxAspect(serre)).toBeCloseTo(viewBoxAspect(BASE), 10);
  });

  it("refuse de dépasser la vue d'ensemble", () => {
    expect(clampViewBox({ x: 0, y: 0, width: 5_000, height: 5_000 }, BASE, LIMITS)).toEqual(BASE);
  });

  it("refuse de zoomer au-delà de la largeur minimale", () => {
    expect(clampViewBox({ x: 0, y: 0, width: 1, height: 1 }, BASE, LIMITS).width).toBe(100);
  });

  it("garde la vue à l'intérieur, en haut à gauche", () => {
    const box = clampViewBox({ x: -300, y: -300, width: 200, height: 100 }, BASE, LIMITS);
    expect(box.x).toBe(0);
    expect(box.y).toBe(0);
  });

  it("garde la vue à l'intérieur, en bas à droite", () => {
    const box = clampViewBox({ x: 5_000, y: 5_000, width: 200, height: 100 }, BASE, LIMITS);
    expect(box.x).toBe(600);
    expect(box.y).toBe(300);
  });

  it("suit une vue d'ensemble décalée", () => {
    const decalee: CanopViewBox = { x: -100, y: -50, width: 200, height: 100 };
    const box = clampViewBox({ x: -999, y: -999, width: 50, height: 25 }, decalee, {
      minWidth: 20,
    });
    expect(box.x).toBe(-100);
    expect(box.y).toBe(-50);
  });
});

describe("zoomViewBox", () => {
  it("laisse le point visé immobile", () => {
    const origine = { x: 0.25, y: 0.75 };
    const avant = { x: 0, y: 0, width: 800, height: 400 };
    const sceneAvant = {
      x: avant.x + origine.x * avant.width,
      y: avant.y + origine.y * avant.height,
    };

    const apres = zoomViewBox(avant, BASE, 0.5, origine, LIMITS);
    const sceneApres = {
      x: apres.x + origine.x * apres.width,
      y: apres.y + origine.y * apres.height,
    };

    expect(sceneApres.x).toBeCloseTo(sceneAvant.x, 6);
    expect(sceneApres.y).toBeCloseTo(sceneAvant.y, 6);
  });

  it("rapproche sous 1 et éloigne au-dessus", () => {
    const centre = { x: 0.5, y: 0.5 };
    const zoome = zoomViewBox(BASE, BASE, 0.5, centre, LIMITS);
    expect(zoome.width).toBe(400);
    expect(zoomViewBox(zoome, BASE, 2, centre, LIMITS).width).toBe(800);
  });

  it("garde le rapport à chaque cran", () => {
    let box = BASE;
    for (let cran = 0; cran < 20; cran += 1) {
      box = zoomViewBox(box, BASE, 1 / 1.15, { x: 0.3, y: 0.6 }, LIMITS);
      expect(viewBoxAspect(box)).toBeCloseTo(viewBoxAspect(BASE), 10);
    }
    expect(box.width).toBe(LIMITS.minWidth);
  });

  it("reste dans les limites même en visant un bord", () => {
    const box = zoomViewBox(BASE, BASE, 0.25, { x: 1, y: 1 }, LIMITS);
    expect(box.x + box.width).toBeLessThanOrEqual(BASE.width + 1e-9);
    expect(box.y + box.height).toBeLessThanOrEqual(BASE.height + 1e-9);
  });
});

describe("panViewBox", () => {
  it("déplace d'une fraction de la vue, pas de la vue d'ensemble", () => {
    const zoome: CanopViewBox = { x: 200, y: 100, width: 200, height: 100 };
    const deplace = panViewBox(zoome, BASE, 0.5, 0, LIMITS);
    expect(deplace.x).toBe(100);
  });

  it("va dans le sens du doigt", () => {
    const zoome: CanopViewBox = { x: 200, y: 100, width: 200, height: 100 };
    expect(panViewBox(zoome, BASE, 0.1, 0.1, LIMITS).x).toBeLessThan(zoome.x);
    expect(panViewBox(zoome, BASE, -0.1, -0.1, LIMITS).x).toBeGreaterThan(zoome.x);
  });

  it("s'arrête au bord au lieu de sortir", () => {
    const zoome: CanopViewBox = { x: 0, y: 0, width: 200, height: 100 };
    expect(panViewBox(zoome, BASE, 1, 1, LIMITS)).toEqual(zoome);
  });

  it("ne change pas la taille", () => {
    const zoome: CanopViewBox = { x: 300, y: 150, width: 200, height: 100 };
    const deplace = panViewBox(zoome, BASE, 0.2, -0.3, LIMITS);
    expect(deplace.width).toBe(200);
    expect(deplace.height).toBe(100);
  });
});

describe("fitViewBox", () => {
  it("centre l'ensemble cadré", () => {
    const box = fitViewBox([{ x: 100, y: 100, width: 100, height: 50 }], BASE, {
      minWidth: 10,
      padding: 1,
    });
    expect(box.x + box.width / 2).toBeCloseTo(150, 6);
    expect(box.y + box.height / 2).toBeCloseTo(125, 6);
  });

  it("cadre sur la plus contraignante des deux dimensions", () => {
    const haut = [{ x: 300, y: 0, width: 20, height: 300 }];
    const box = fitViewBox(haut, BASE, { minWidth: 10, padding: 1 });
    expect(box.height).toBeGreaterThanOrEqual(300);
  });

  it("laisse une marge autour", () => {
    const cible = [{ x: 300, y: 100, width: 100, height: 50 }];
    const colle = fitViewBox(cible, BASE, { minWidth: 10, padding: 1 });
    const aere = fitViewBox(cible, BASE, { minWidth: 10, padding: 1.25 });
    expect(aere.width).toBeCloseTo(colle.width * 1.25, 6);
  });

  it("englobe plusieurs rectangles épars", () => {
    const box = fitViewBox(
      [
        { x: 100, y: 100, width: 10, height: 10 },
        { x: 400, y: 200, width: 10, height: 10 },
      ],
      BASE,
      { minWidth: 10, padding: 1 },
    );
    expect(box.x).toBeLessThanOrEqual(100);
    expect(box.x + box.width).toBeGreaterThanOrEqual(410);
  });

  it("ne descend pas sous la largeur minimale sur une région minuscule", () => {
    const box = fitViewBox([{ x: 400, y: 200, width: 0.5, height: 0.5 }], BASE, LIMITS);
    expect(box.width).toBe(LIMITS.minWidth);
  });

  it("revient à la vue d'ensemble sans rien à cadrer", () => {
    expect(fitViewBox([], BASE, LIMITS)).toEqual(BASE);
  });

  it("garde le rapport", () => {
    const box = fitViewBox([{ x: 10, y: 300, width: 200, height: 20 }], BASE, LIMITS);
    expect(viewBoxAspect(box)).toBeCloseTo(viewBoxAspect(BASE), 10);
  });
});

describe("isZoomed", () => {
  it("est faux sur la vue d'ensemble", () => {
    expect(isZoomed(BASE, BASE)).toBe(false);
  });

  it("est vrai dès que la vue se resserre", () => {
    expect(isZoomed({ ...BASE, width: 799 }, BASE)).toBe(true);
  });

  it("ne se laisse pas piéger par une erreur d'arrondi", () => {
    const cycle = BASE.width * (1 / 1.15) * 1.15;
    expect(isZoomed({ ...BASE, width: cycle }, BASE)).toBe(false);
  });
});
