import { describe, expect, it } from "vitest";
import { squirclePath, superellipseCorner } from "../superellipse";
import { squircle } from "../../tokens/squircle";

function coordinates(path: string): [number, number][] {
  return path
    .replace(/^M /, "")
    .replace(/ Z$/, "")
    .split(" L ")
    .map((pair) => {
      const [x, y] = pair.split(" ").map(Number);
      return [x, y] as [number, number];
    });
}

describe("squirclePath", () => {
  it("produit un tracé fermé de quatre coins", () => {
    const path = squirclePath(200, 100, 20, { segments: 4 });
    expect(path.startsWith("M ")).toBe(true);
    expect(path.endsWith(" Z")).toBe(true);
    expect(coordinates(path)).toHaveLength(4 * 5);
  });

  it("reste dans la boîte demandée", () => {
    for (const [x, y] of coordinates(squirclePath(200, 100, 24))) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(200);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
  });

  it("touche les quatre arêtes", () => {
    const points = coordinates(squirclePath(200, 100, 24));
    expect(points.some(([x]) => x === 0)).toBe(true);
    expect(points.some(([x]) => x === 200)).toBe(true);
    expect(points.some(([, y]) => y === 0)).toBe(true);
    expect(points.some(([, y]) => y === 100)).toBe(true);
  });

  it("borne le rayon à la moitié du plus petit côté", () => {
    const genereux = coordinates(squirclePath(200, 40, 500));
    const borne = coordinates(squirclePath(200, 40, 20));
    expect(genereux).toEqual(borne);
  });

  it("refuse de sortir de la boîte avec un rayon négatif", () => {
    for (const [x, y] of coordinates(squirclePath(120, 60, -30))) {
      expect(x === 0 || x === 120).toBe(true);
      expect(y === 0 || y === 60).toBe(true);
    }
  });

  it("suit la même géométrie que le clip-path", () => {
    const corner = superellipseCorner(squircle.exponent.rectangle, squircle.segments);
    const [firstX, firstY] = coordinates(squirclePath(200, 100, 20))[0];
    expect(firstX).toBeCloseTo(corner[0][0] * 20, 3);
    expect(firstY).toBeCloseTo(corner[0][1] * 20, 3);
  });
});
