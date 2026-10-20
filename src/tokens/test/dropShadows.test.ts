import { describe, expect, it } from "vitest";
import { dropShadowsDark, dropShadowsLight } from "../shadows";

const LEVELS = ["e1", "e2", "e3", "e4", "e5"] as const;

interface ShadowLayer {
  blur: number;
  alpha: number;
}

function parseLayers(filter: string): ShadowLayer[] {
  const layers = [...filter.matchAll(/drop-shadow\(([^)]*\([^)]*\)[^)]*|[^)]*)\)/g)];
  expect(layers.length).toBeGreaterThan(0);

  return layers.map((layer) => {
    const declaration = layer[1];
    const lengths = [...declaration.matchAll(/(-?[\d.]+)rem|(\b0\b)(?!\.)/g)];
    const blur = lengths.length >= 3 ? parseFloat(lengths[2][1] ?? "0") : 0;
    const alpha = Number(/rgba?\([^)]*?([\d.]+)\s*\)/.exec(declaration)?.[1] ?? "0");
    return { blur, alpha };
  });
}

describe.each([
  ["light", dropShadowsLight],
  ["dark", dropShadowsDark],
])("rampe de drop-shadow %s", (_mode, ramp) => {
  const measured = LEVELS.map((level) => {
    const layers = parseLayers(ramp[level]);
    return {
      level,
      blur: Math.max(...layers.map((layer) => layer.blur)),
      alpha: layers.reduce((total, layer) => total + layer.alpha, 0),
    };
  });

  it("n'utilise que des couches drop-shadow valides", () => {
    for (const level of LEVELS) {
      expect(ramp[level]).toMatch(/^drop-shadow\(/);
      expect(ramp[level]).not.toMatch(/\)\s*,/);
    }
  });

  it("gagne en opacité cumulée à chaque niveau", () => {
    for (let step = 1; step < measured.length; step += 1) {
      expect(
        measured[step].alpha,
        `${measured[step].level} doit être plus dense que ${measured[step - 1].level}`,
      ).toBeGreaterThan(measured[step - 1].alpha);
    }
  });

  it("gagne en étalement à chaque niveau", () => {
    for (let step = 1; step < measured.length; step += 1) {
      expect(
        measured[step].blur,
        `${measured[step].level} doit s'étaler plus que ${measured[step - 1].level}`,
      ).toBeGreaterThan(measured[step - 1].blur);
    }
  });

  it("relève l'opacité en même temps que le flou, la gaussienne diluant l'ombre", () => {
    const first = measured[0];
    const last = measured[measured.length - 1];
    expect(last.blur / first.blur).toBeGreaterThan(2);
    expect(last.alpha).toBeGreaterThan(first.alpha);
  });
});
