import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const AUTORISES = new Set(["components/Slider/Slider.tsx"]);

const SRC = "src";

const RACINES = ["components", "theme"];

function sources(): string[] {
  return RACINES.flatMap((racine) =>
    readdirSync(`${SRC}/${racine}`, { recursive: true, encoding: "utf8" })
      .map((chemin) => `${racine}/${chemin.replace(/\\/g, "/")}`)
      .filter((chemin) => /\.tsx?$/.test(chemin) && !chemin.includes("/test/")),
  );
}

describe("forme et ombre se decident au meme endroit", () => {
  it("aucun composant ne combine un decoupage squircle et une ombre debordante", () => {
    const coupables = sources().filter((chemin) => {
      if (AUTORISES.has(chemin)) return false;
      const source = readFileSync(`${SRC}/${chemin}`, "utf8");
      if (!/squircleClip|squircleClipPath/.test(source)) return false;
      return /boxShadow:(?!\s*["'`]?\s*(?:inset|none))/.test(source);
    });

    expect(coupables).toEqual([]);
  });

  it("voit bien les fichiers qu'il est cense inspecter", () => {
    const trouves = sources();
    expect(trouves.length).toBeGreaterThan(50);
    expect(trouves).toContain("components/Slider/Slider.tsx");
    expect(trouves).toContain("components/DataTable/DataTable.tsx");
    expect(trouves).toContain("theme/mapChrome.ts");
  });
});
