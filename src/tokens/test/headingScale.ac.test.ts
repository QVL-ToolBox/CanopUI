import { describe, expect, it } from "vitest";
import { typography } from "../index";

const echelleAvantLeSixiemePalier = {
  h1: {
    fontSize: "4.21rem",
    fontFamily: "'Titan One', 'Chivo', system-ui, sans-serif",
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.035em",
  },
  h2: {
    fontSize: "3.158rem",
    fontFamily: "'Titan One', 'Chivo', system-ui, sans-serif",
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.028em",
  },
  h3: {
    fontSize: "2.369rem",
    fontFamily: "'Titan One', 'Chivo', system-ui, sans-serif",
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.022em",
  },
  h4: {
    fontSize: "1.777rem",
    fontFamily: "'Titan One', 'Chivo', system-ui, sans-serif",
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.016em",
  },
  h5: {
    fontSize: "1.333rem",
    fontFamily: "'Titan One', 'Chivo', system-ui, sans-serif",
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.011em",
  },
} as const;

const raisonModulaire = 1.333;

const heading = typography.heading as Record<
  string,
  {
    fontSize: string;
    fontFamily: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: string;
  }
>;

describe("échelle de titres — les cinq premiers paliers", () => {
  it("rend chaque palier existant à l'identique de la version précédente", () => {
    for (const [nom, attendu] of Object.entries(echelleAvantLeSixiemePalier)) {
      expect(heading[nom]).toEqual(attendu);
    }
  });

  it("n'ajoute qu'un seul palier à l'échelle", () => {
    expect(Object.keys(heading)).toEqual(["h1", "h2", "h3", "h4", "h5", "h6"]);
  });
});

describe("échelle de titres — le sixième palier", () => {
  it("expose les cinq propriétés typographiques", () => {
    expect(Object.keys(heading.h6).sort()).toEqual(
      ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight"].sort(),
    );
  });

  it("mesure 1rem", () => {
    expect(heading.h6.fontSize).toBe("1rem");
  });

  it("garde la famille, la graisse et l'interligne de ses voisins", () => {
    expect(heading.h6.fontFamily).toBe(heading.h5.fontFamily);
    expect(heading.h6.fontWeight).toBe(heading.h5.fontWeight);
    expect(heading.h6.lineHeight).toBe(heading.h5.lineHeight);
  });

  it("prolonge la gamme modulaire de raison 1,333 depuis h5", () => {
    const rapport = parseFloat(heading.h5.fontSize) / parseFloat(heading.h6.fontSize);
    expect(rapport).toBeCloseTo(raisonModulaire, 3);
  });

  it("n'est pas plus resserré que les paliers plus grands", () => {
    const crenage = (nom: string) => parseFloat(heading[nom].letterSpacing);
    for (const nom of ["h1", "h2", "h3", "h4", "h5"]) {
      expect(crenage(nom)).toBeLessThanOrEqual(crenage("h6"));
    }
  });
});
