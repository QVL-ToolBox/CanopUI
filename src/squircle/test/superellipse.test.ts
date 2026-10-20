import { describe, expect, it } from "vitest";
import {
  insetRadius,
  squircleClipPath,
  squircleRingPath,
  superellipseCorner,
} from "../superellipse";
import { squircle } from "../../tokens/squircle";

describe("superellipseCorner", () => {
  it.each([2, 3, 4, 5, 8])("place chaque point sur la superellipse d'exposant %s", (exponent) => {
    for (const [u, v] of superellipseCorner(exponent, 16)) {
      expect((1 - u) ** exponent + (1 - v) ** exponent).toBeCloseTo(1, 3);
    }
  });

  it("part de l'arête verticale et arrive sur l'arête horizontale", () => {
    const corner = superellipseCorner(4, 8);
    expect(corner[0]).toEqual([0, 1]);
    expect(corner[corner.length - 1]).toEqual([1, 0]);
  });

  it("rend segments + 1 points", () => {
    expect(superellipseCorner(4, 12)).toHaveLength(13);
    expect(superellipseCorner(4, 4)).toHaveLength(5);
  });

  it("progresse de façon monotone le long de l'arc", () => {
    const corner = superellipseCorner(4, 16);
    for (let step = 1; step < corner.length; step += 1) {
      expect(corner[step][0]).toBeGreaterThan(corner[step - 1][0]);
      expect(corner[step][1]).toBeLessThan(corner[step - 1][1]);
    }
  });

  it("redonne un quart de cercle quand l'exposant vaut 2", () => {
    const [, quarter] = superellipseCorner(2, 4);
    expect(quarter[0]).toBeCloseTo(1 - Math.cos(Math.PI / 8), 4);
  });

  it("remplit davantage le coin quand l'exposant monte", () => {
    const middle = (exponent: number) => superellipseCorner(exponent, 4)[2];
    const [circleU] = middle(2);
    const [squircleU] = middle(4);
    const [almostSquareU] = middle(16);
    expect(squircleU).toBeLessThan(circleU);
    expect(almostSquareU).toBeLessThan(squircleU);
  });

  it("refuse un exposant nul ou négatif", () => {
    expect(() => superellipseCorner(0, 4)).toThrow(RangeError);
    expect(() => superellipseCorner(-1, 4)).toThrow(RangeError);
  });

  it("refuse un nombre de segments invalide", () => {
    expect(() => superellipseCorner(4, 0)).toThrow(RangeError);
    expect(() => superellipseCorner(4, 2.5)).toThrow(RangeError);
  });
});

function countPoints(path: string): number {
  const body = path.slice("polygon(".length, -1);
  let depth = 0;
  let points = 1;
  for (const character of body) {
    if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;
    else if (character === "," && depth === 0) points += 1;
  }
  return points;
}

describe("squircleClipPath", () => {
  it("produit un polygone fermé de quatre coins", () => {
    const path = squircleClipPath("1rem", { segments: 4 });
    expect(path.startsWith("polygon(")).toBe(true);
    expect(path.endsWith(")")).toBe(true);
    expect(countPoints(path)).toBe(4 * 5);
  });

  it("ancre les extrémités sur les arêtes sans calcul superflu", () => {
    const path = squircleClipPath("1rem", { segments: 4 });
    expect(path).toContain("0% calc(100% - min(1rem, 50%))");
    expect(path).toContain("min(1rem, 50%) 0%");
    expect(path).toContain("calc(100% - min(1rem, 50%)) 0%");
    expect(path).toContain("100% calc(100% - min(1rem, 50%))");
  });

  it("accepte une CSS variable comme rayon", () => {
    const path = squircleClipPath("var(--canop-radius-md)", { segments: 4 });
    expect(path).toContain("min(var(--canop-radius-md), 50%) 0%");
    expect(path).toContain("calc(100% - min(var(--canop-radius-md), 50%) * ");
  });

  it("accepte un rayon en pourcentage pour les formes circulaires", () => {
    const path = squircleClipPath("50%", { segments: 4 });
    expect(path).toContain("50% 0%");
    expect(path).toContain("calc(100% - 50%)");
  });

  it("suit les tokens par défaut", () => {
    const path = squircleClipPath("1rem");
    expect(countPoints(path)).toBe(4 * (squircle.segments + 1));
  });
});

describe("insetRadius", () => {
  it("retranche l'épaisseur de bordure d'un rayon absolu", () => {
    expect(insetRadius("1rem", "0.0625rem")).toBe("calc(1rem - 0.0625rem)");
  });

  it("laisse un rayon en pourcentage intact, la boîte étant déjà rétrécie", () => {
    expect(insetRadius("50%", "0.0625rem")).toBe("50%");
  });
});

describe("bornage du rayon", () => {
  it("clampe un rayon absolu à la moitié de la boîte, comme le fait border-radius", () => {
    const path = squircleClipPath("1rem", { segments: 2 });
    expect(path).toContain("min(1rem, 50%)");
    expect(path).not.toMatch(/calc\(100% - 1rem\)/);
  });

  it("laisse un rayon en pourcentage tel quel, déjà relatif à la boîte", () => {
    expect(squircleClipPath("50%", { segments: 2 })).not.toContain("min(");
  });
});

describe("squircleClipPath - coins nuls", () => {
  it("retombe sur l'angle vif sans produire de calcul invalide", () => {
    const chemin = squircleClipPath({ topLeft: "1.75rem", bottomLeft: "1.75rem" });

    expect(chemin).toContain("100% 0%");
    expect(chemin).toContain("100% 100%");
    expect(chemin).not.toMatch(/calc\([^)]*%\s*-\s*0\b/);
    expect(chemin).not.toMatch(/\b0\s*\*/);
  });

  it("ne laisse aucune coordonnee sans unite ni pourcentage", () => {
    const chemin = squircleClipPath({ topRight: "1rem" });
    const interieur = chemin.slice("polygon(".length, -1);

    let profondeur = 0;
    let courant = "";
    const points: string[] = [];
    for (const caractere of interieur) {
      if (caractere === "(") profondeur += 1;
      if (caractere === ")") profondeur -= 1;
      if (caractere === "," && profondeur === 0) {
        points.push(courant.trim());
        courant = "";
        continue;
      }
      courant += caractere;
    }
    points.push(courant.trim());

    const debuts = ["0%", "100%", "calc(", "min("];
    expect(points).toHaveLength(52);
    for (const point of points) {
      expect(debuts.some((debut) => point.startsWith(debut))).toBe(true);
      expect(point.includes("0 *")).toBe(false);
    }
  });
});

describe("squircleRingPath", () => {
  it("referme le contour exterieur puis parcourt l'interieur", () => {
    const anneau = squircleRingPath("1.5rem", "0.125rem");
    const points = anneau.slice("polygon(".length, -1).split(/,(?![^(]*\))/);

    expect(points).toHaveLength(52 + 1 + 52 + 1);
  });

  it("rejoint l'interieur par une couture de surface nulle", () => {
    const anneau = squircleRingPath("1.5rem", "0.125rem");
    const points = anneau
      .slice("polygon(".length, -1)
      .split(/,(?![^(]*\))/)
      .map((point) => point.trim());

    expect(points[52]).toBe(points[0]);
    expect(points[53]).toBe(points[points.length - 1]);
  });

  it("rentre le contour interieur de l'epaisseur demandee", () => {
    const anneau = squircleRingPath("1.5rem", "0.125rem");

    expect(anneau).toContain("calc(0.125rem + min(calc(1.5rem - 0.125rem), 50%)");
    expect(anneau).toContain("calc(100% - 0.125rem - min(calc(1.5rem - 0.125rem), 50%)");
  });
});
