import { describe, expect, it } from "vitest";
import {
  stepShapeBodies,
  syncShapeBodies,
  type ContainerSize,
  type ShapeBody,
  type ShapeMeasurement,
} from "../floating";

const CONTAINER: ContainerSize = { width: 200, height: 200 };
const WIDE_CONTAINER: ContainerSize = { width: 400, height: 400 };

function body(overrides: Partial<ShapeBody> = {}): ShapeBody {
  return {
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    radius: 10,
    homeX: 100,
    homeY: 100,
    ...overrides,
  };
}

function measurement(overrides: Partial<ShapeMeasurement> = {}): ShapeMeasurement {
  return { homeX: 100, homeY: 100, radius: 10, ...overrides };
}

function speedOf(target: ShapeBody): number {
  return Math.hypot(target.vx, target.vy);
}

describe("syncShapeBodies - creation des corps", () => {
  it("cree un corps par mesure quand aucun n'existe encore", () => {
    const bodies = syncShapeBodies([], [measurement(), measurement({ homeX: 50 })], CONTAINER);
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).not.toBe(bodies[1]);
  });

  it("ancre un corps neuf sur sa position de repos", () => {
    const [created] = syncShapeBodies([], [measurement({ homeX: 60, homeY: 70 })], CONTAINER);
    expect(created).toMatchObject({ homeX: 60, homeY: 70, x: 60, y: 70 });
  });

  it("ramene dans le conteneur un corps neuf ancre au-dela du bord", () => {
    const [created] = syncShapeBodies(
      [],
      [measurement({ homeX: 500, homeY: -80, radius: 10 })],
      CONTAINER,
    );
    expect(created.x).toBe(190);
    expect(created.y).toBe(10);
  });

  it("centre un corps neuf plus large que le conteneur", () => {
    const [created] = syncShapeBodies([], [measurement({ radius: 150 })], CONTAINER);
    expect(created.x).toBe(100);
    expect(created.y).toBe(100);
  });

  it("lance chaque corps neuf a une vitesse contenue", () => {
    const bodies = syncShapeBodies(
      [],
      [measurement(), measurement(), measurement(), measurement()],
      CONTAINER,
    );
    for (const created of bodies) {
      expect(speedOf(created)).toBeGreaterThanOrEqual(6);
      expect(speedOf(created)).toBeLessThanOrEqual(13);
    }
  });
});

describe("syncShapeBodies - mise a jour des corps existants", () => {
  it("conserve le corps existant et actualise son ancrage", () => {
    const existing = body();
    const [synced] = syncShapeBodies(
      [existing],
      [measurement({ homeX: 40, homeY: 55 })],
      CONTAINER,
    );
    expect(synced).toBe(existing);
    expect(synced).toMatchObject({ homeX: 40, homeY: 55 });
  });

  it("adopte le nouveau rayon mesure", () => {
    const existing = body();
    const [synced] = syncShapeBodies([existing], [measurement({ radius: 25 })], CONTAINER);
    expect(synced.radius).toBe(25);
  });

  it("preserve la vitesse acquise par un corps existant", () => {
    const existing = body({ vx: 7, vy: -4 });
    const [synced] = syncShapeBodies([existing], [measurement()], CONTAINER);
    expect(synced.vx).toBe(7);
    expect(synced.vy).toBe(-4);
  });

  it("replace un corps existant devenu trop proche du bord", () => {
    const existing = body({ x: 195, y: 3 });
    const [synced] = syncShapeBodies([existing], [measurement({ radius: 20 })], CONTAINER);
    expect(synced.x).toBe(180);
    expect(synced.y).toBe(20);
  });

  it("centre un corps existant devenu plus large que le conteneur", () => {
    const existing = body({ x: 10, y: 190 });
    const [synced] = syncShapeBodies([existing], [measurement({ radius: 150 })], CONTAINER);
    expect(synced.x).toBe(100);
    expect(synced.y).toBe(100);
  });

  it("ne cree que les corps manquants quand la liste s'allonge", () => {
    const existing = body();
    const bodies = syncShapeBodies([existing], [measurement(), measurement()], CONTAINER);
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).toBe(existing);
    expect(bodies[1]).not.toBe(existing);
  });

  it("abandonne les corps en trop quand la liste raccourcit", () => {
    const first = body();
    const second = body({ x: 50 });
    const bodies = syncShapeBodies([first, second], [measurement()], CONTAINER);
    expect(bodies).toEqual([first]);
  });

  it("rend une liste vide quand plus aucune forme n'est mesuree", () => {
    expect(syncShapeBodies([body()], [], CONTAINER)).toEqual([]);
  });
});

describe("stepShapeBodies - deplacement et rebonds", () => {
  it("avance chaque corps selon sa vitesse et le temps ecoule", () => {
    const moving = body({ vx: 20, vy: -20 });
    stepShapeBodies([moving], CONTAINER, 0.5);
    expect(moving.x).toBe(110);
    expect(moving.y).toBe(90);
  });

  it("laisse filer un corps qui reste loin des bords", () => {
    const moving = body({ vx: 20, vy: 20 });
    stepShapeBodies([moving], CONTAINER, 1);
    expect(moving.vx).toBe(20);
    expect(moving.vy).toBe(20);
  });

  it("renvoie vers la droite un corps qui atteint le bord gauche", () => {
    const moving = body({ x: 12, vx: -20 });
    stepShapeBodies([moving], CONTAINER, 1);
    expect(moving.x).toBe(10);
    expect(moving.vx).toBe(20);
  });

  it("renvoie vers la gauche un corps qui atteint le bord droit", () => {
    const moving = body({ x: 185, vx: 20 });
    stepShapeBodies([moving], CONTAINER, 1);
    expect(moving.x).toBe(190);
    expect(moving.vx).toBe(-20);
  });

  it("renvoie vers le bas un corps qui atteint le bord haut", () => {
    const moving = body({ y: 12, vy: -20 });
    stepShapeBodies([moving], CONTAINER, 1);
    expect(moving.y).toBe(10);
    expect(moving.vy).toBe(20);
  });

  it("renvoie vers le haut un corps qui atteint le bord bas", () => {
    const moving = body({ y: 185, vy: 20 });
    stepShapeBodies([moving], CONTAINER, 1);
    expect(moving.y).toBe(190);
    expect(moving.vy).toBe(-20);
  });

  it("immobilise au centre un corps plus large que le conteneur", () => {
    const oversized = body({ radius: 150, vx: 20, vy: 20 });
    stepShapeBodies([oversized], CONTAINER, 1);
    expect(oversized).toMatchObject({ x: 100, y: 100, vx: 0, vy: 0 });
  });

  it("traverse un pas de duree nulle sans rien deplacer", () => {
    const moving = body({ vx: 20, vy: 20 });
    stepShapeBodies([moving], CONTAINER, 0);
    expect(moving.x).toBe(100);
    expect(moving.y).toBe(100);
  });

  it("accepte une scene sans aucun corps", () => {
    expect(() => stepShapeBodies([], CONTAINER, 1)).not.toThrow();
  });
});

describe("stepShapeBodies - collisions entre formes", () => {
  it("separe deux corps qui se chevauchent en se rapprochant", () => {
    const left = body({ x: 100, radius: 20, vx: 10 });
    const right = body({ x: 110, radius: 20, vx: -10 });
    stepShapeBodies([left, right], WIDE_CONTAINER, 0);
    expect(right.x - left.x).toBeCloseTo(40);
  });

  it("inverse les vitesses de deux corps qui se percutent", () => {
    const left = body({ x: 100, radius: 20, vx: 10 });
    const right = body({ x: 110, radius: 20, vx: -10 });
    stepShapeBodies([left, right], WIDE_CONTAINER, 0);
    expect(left.vx).toBeCloseTo(-10);
    expect(right.vx).toBeCloseTo(10);
  });

  it("separe sans freiner deux corps qui s'ecartent deja", () => {
    const left = body({ x: 100, radius: 20, vx: -10 });
    const right = body({ x: 110, radius: 20, vx: 10 });
    stepShapeBodies([left, right], WIDE_CONTAINER, 0);
    expect(right.x - left.x).toBeCloseTo(40);
    expect(left.vx).toBe(-10);
    expect(right.vx).toBe(10);
  });

  it("laisse intacts deux corps qui se touchent sans se penetrer", () => {
    const left = body({ x: 100, radius: 20, vx: 5 });
    const right = body({ x: 140, radius: 20, vx: -5 });
    stepShapeBodies([left, right], WIDE_CONTAINER, 0);
    expect(left.x).toBe(100);
    expect(right.x).toBe(140);
    expect(left.vx).toBe(5);
    expect(right.vx).toBe(-5);
  });

  it("laisse intacts deux corps eloignes l'un de l'autre", () => {
    const left = body({ x: 100, radius: 10 });
    const right = body({ x: 300, radius: 10 });
    stepShapeBodies([left, right], WIDE_CONTAINER, 0);
    expect(left.x).toBe(100);
    expect(right.x).toBe(300);
  });

  it("reste stable quand deux corps occupent exactement la meme position", () => {
    const first = body({ x: 100, y: 100, radius: 20 });
    const second = body({ x: 100, y: 100, radius: 20 });
    stepShapeBodies([first, second], WIDE_CONTAINER, 0);
    for (const target of [first, second]) {
      expect(Number.isNaN(target.x)).toBe(false);
      expect(Number.isNaN(target.y)).toBe(false);
      expect(Number.isNaN(target.vx)).toBe(false);
      expect(Number.isNaN(target.vy)).toBe(false);
    }
  });

  it("resout les collisions en diagonale", () => {
    const first = body({ x: 100, y: 100, radius: 20, vx: 10, vy: 10 });
    const second = body({ x: 110, y: 110, radius: 20, vx: -10, vy: -10 });
    stepShapeBodies([first, second], WIDE_CONTAINER, 0);
    expect(Math.hypot(second.x - first.x, second.y - first.y)).toBeCloseTo(40);
  });
});
