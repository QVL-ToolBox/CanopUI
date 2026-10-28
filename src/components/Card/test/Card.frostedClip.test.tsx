import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Card, CanopThemeProvider, radius, type CanopCardProps } from "../../../index";
import { racineDeCarte } from "../../../test/cardTestKit";
import {
  blocsBrutsDe,
  derniereValeurEmise,
  reglesEmises,
  valeursEmises,
} from "../../../test/cssRules";

const CONTOUR_SQUIRCLE = "var(--canop-squircle-clip)";
const FLOU_DU_HEROS = "blur(0.25rem) saturate(1.8)";
const SANS_ARRONDI = ["", "0", "0px"];
const ELEVATIONS = ["sm", "md", "lg"] as const;
const VARIANTES_NON_GIVREES = ["surface", "interactive", "floating", "stat"] as const;

function poserCarte(props: Partial<CanopCardProps> = {}) {
  const { container } = render(
    <CanopThemeProvider>
      <Card variant="frosted" title="Bonjour" {...props}>
        Trois revues vous attendent.
      </Card>
    </CanopThemeProvider>,
  );
  return racineDeCarte(container);
}

const sansCondition = (racine: HTMLElement) =>
  reglesEmises(racine).filter((regle) => regle.conditions.length === 0);

function selecteursPortant(racine: HTMLElement, propriete: string): string[] {
  return sansCondition(racine)
    .filter((regle) => regle.style.getPropertyValue(propriete) !== "")
    .map((regle) => regle.selecteur);
}

function decoupesSquircleDe(racine: HTMLElement): string[] {
  return reglesEmises(racine)
    .map((regle) => regle.style.getPropertyValue("clip-path"))
    .filter((valeur) => valeur === CONTOUR_SQUIRCLE);
}

function decoupeAuSelecteur(racine: HTMLElement, selecteur: string): string {
  return (
    sansCondition(racine)
      .filter((regle) => regle.selecteur === selecteur)
      .map((regle) => regle.style.getPropertyValue("clip-path"))
      .filter((valeur) => valeur !== "")
      .at(-1) ?? ""
  );
}

describe("AC3 - le verre d'une carte frosted sans elevation epouse le squircle", () => {
  it("decoupe l'element qui porte le backdrop-filter selon le contour squircle", () => {
    const racine = poserCarte();
    const porteurs = selecteursPortant(racine, "backdrop-filter");
    expect(porteurs.length).toBeGreaterThan(0);
    porteurs.forEach((selecteur) => {
      expect(decoupeAuSelecteur(racine, selecteur)).toBe(CONTOUR_SQUIRCLE);
    });
  });

  it("decoupe l'hote de la carte selon le contour squircle", () => {
    const racine = poserCarte();
    expect(derniereValeurEmise(racine, "clip-path")).toBe(CONTOUR_SQUIRCLE);
  });

  it("definit la variable de contour squircle sur la meme carte", () => {
    const racine = poserCarte();
    const contours = reglesEmises(racine)
      .map((regle) => regle.style.getPropertyValue("--canop-squircle-clip"))
      .join(" ");
    expect(contours).toMatch(/polygon\(/);
  });

  it.each(["2xl", "lg", "md"] as const)(
    "decoupe aussi selon le squircle avec radius=%s",
    (rayon) => {
      const racine = poserCarte({ radius: rayon });
      expect(derniereValeurEmise(racine, "clip-path")).toBe(CONTOUR_SQUIRCLE);
      expect(SANS_ARRONDI).toContain(derniereValeurEmise(racine, "border-radius"));
    },
  );

  it("decoupe la teinte du verre selon le squircle", () => {
    const racine = poserCarte();
    const teintes = sansCondition(racine).filter((regle) =>
      regle.style.getPropertyValue("background").includes("linear-gradient(150deg"),
    );
    expect(teintes.length).toBeGreaterThan(0);
    teintes.forEach((regle) =>
      expect(regle.style.getPropertyValue("clip-path")).toMatch(/polygon\(/),
    );
  });

  it("ne pose aucun arrondi circulaire sur l'hote ni sur ses pseudo-elements", () => {
    const racine = poserCarte();
    sansCondition(racine)
      .map((regle) => regle.style.getPropertyValue("border-radius"))
      .filter((valeur) => valeur !== "")
      .forEach((valeur) => expect(SANS_ARRONDI).toContain(valeur));
  });

  it("decoupe aussi selon le squircle en theme sombre", () => {
    const { container } = render(
      <CanopThemeProvider mode="dark">
        <Card variant="frosted">Contenu</Card>
      </CanopThemeProvider>,
    );
    expect(derniereValeurEmise(racineDeCarte(container), "clip-path")).toBe(CONTOUR_SQUIRCLE);
  });
});

describe("AC4 - une carte frosted avec elevation garde son ombre", () => {
  it.each(ELEVATIONS)("ne decoupe pas l'hote avec elevation=%s", (elevation) => {
    const racine = poserCarte({ elevation });
    expect(valeursEmises(racine, "clip-path")).toEqual([]);
    expect(decoupesSquircleDe(racine)).toEqual([]);
  });

  it.each(ELEVATIONS)("conserve l'ombre avec elevation=%s", (elevation) => {
    const racine = poserCarte({ elevation });
    expect(derniereValeurEmise(racine, "filter")).toMatch(/drop-shadow/);
  });

  it.each(ELEVATIONS)("garde le flou avec elevation=%s", (elevation) => {
    const racine = poserCarte({ elevation });
    expect(derniereValeurEmise(racine, "backdrop-filter")).toBe(FLOU_DU_HEROS);
    expect(blocsBrutsDe(racine).join("")).toContain(`-webkit-backdrop-filter:${FLOU_DU_HEROS}`);
  });

  it.each(ELEVATIONS)("conserve l'arrondi au rayon xl avec elevation=%s", (elevation) => {
    expect([radius.xl, "var(--canop-radius-xl)"]).toContain(
      derniereValeurEmise(poserCarte({ elevation }), "border-radius"),
    );
  });
});

describe("AC6 - les variantes non givrees ne recoivent aucun clip-path", () => {
  it.each(VARIANTES_NON_GIVREES)("laisse l'hote de la variante %s sans clip-path", (variant) => {
    const racine = poserCarte({ variant });
    expect(valeursEmises(racine, "clip-path")).toEqual([]);
    expect(decoupesSquircleDe(racine)).toEqual([]);
  });

  it.each(VARIANTES_NON_GIVREES)(
    "laisse l'hote de la variante %s sans clip-path avec une elevation explicite",
    (variant) => {
      const racine = poserCarte({ variant, elevation: "md" });
      expect(valeursEmises(racine, "clip-path")).toEqual([]);
      expect(decoupesSquircleDe(racine)).toEqual([]);
    },
  );
});

describe("AC1 - recette du verre liquide frosted", () => {
  it("floute en blur 0.25rem saturate 1.8", () => {
    expect(derniereValeurEmise(poserCarte(), "backdrop-filter")).toBe(FLOU_DU_HEROS);
  });

  it("emet la forme prefixee -webkit-backdrop-filter", () => {
    expect(blocsBrutsDe(poserCarte()).join("")).toContain(
      `-webkit-backdrop-filter:${FLOU_DU_HEROS}`,
    );
  });

  it("declare le repli sous @supports not backdrop-filter", () => {
    const conditions = reglesEmises(poserCarte())
      .flatMap((regle) => regle.conditions)
      .filter((condition) => /^not\b/.test(condition.trim()))
      .join(" ");
    expect(conditions).toContain("backdrop-filter");
    expect(conditions).toContain("-webkit-backdrop-filter");
  });

  it("porte le rayon xl par defaut dans le contour squircle", () => {
    const contour = reglesEmises(poserCarte())
      .map((regle) => regle.style.getPropertyValue("--canop-squircle-clip"))
      .join(" ");
    expect(contour).toContain("var(--canop-radius-xl)");
  });
});
