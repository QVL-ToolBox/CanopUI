import { describe, expect, it } from "vitest";
import { paletteGradient, sheenGradient } from "../paletteGradient";

describe("paletteGradient", () => {
  it("reprend les trois teintes de la famille demandee", () => {
    expect(paletteGradient("accent")).toBe(
      "linear-gradient(90deg, var(--canop-palette-accent-light) 0%," +
        " var(--canop-palette-accent-main) 55%," +
        " var(--canop-palette-accent-dark) 100%)",
    );
  });

  it("accepte un autre angle", () => {
    expect(paletteGradient("primary", { angle: "180deg" })).toContain("linear-gradient(180deg,");
  });

  it("n'eclaircit rien par defaut", () => {
    expect(paletteGradient("primary")).not.toContain("color-mix");
  });

  it("eclaircit son extremite claire quand on le demande", () => {
    expect(paletteGradient("primary", { lift: 45 })).toContain(
      "color-mix(in srgb, var(--canop-palette-primary-light) 55%, #fff) 0%",
    );
  });

  it("garde ses arrets aux memes positions, eclairci ou non", () => {
    const positions = (valeur: string) =>
      Array.from(valeur.replace(/color-mix\([^#]*#fff\)/g, "C").matchAll(/(\d+)%/g)).map((t) =>
        Number.parseFloat(t[1]),
      );
    expect(positions(paletteGradient("primary"))).toEqual([0, 55, 100]);
    expect(positions(paletteGradient("primary", { lift: 45 }))).toEqual([0, 55, 100]);
  });
});

describe("sheenGradient", () => {
  it("ne porte qu'un seul point clair, au centre", () => {
    const reflet = sheenGradient();
    const arrets = reflet.match(/rgba\(255, 255, 255, [\d.]+\)/g) ?? [];
    expect(arrets).toHaveLength(3);
    expect(reflet).toContain("rgba(255, 255, 255, 0.55) 50%");
    expect(reflet.startsWith("linear-gradient(90deg, rgba(255, 255, 255, 0) 0%")).toBe(true);
    expect(reflet.endsWith("rgba(255, 255, 255, 0) 100%)")).toBe(true);
  });

  it("est blanc et non colore, donc valable sur toute teinte et les deux themes", () => {
    expect(sheenGradient()).not.toContain("--canop-palette");
  });
});
