import { describe, expect, expectTypeOf, it } from "vitest";
import { render } from "@testing-library/react";
import {
  Card,
  CanopThemeProvider,
  palette,
  paletteDark,
  radius,
  spacing,
  type CanopCardProps,
  type CanopCardVariant,
} from "../../../index";
import { racineDeCarte } from "../../../test/cardTestKit";
import { contrastRatio, mixSrgb } from "../../../test/contrastRatio";
import {
  blocsBrutsDe,
  declarationsDe,
  derniereValeurEmise,
  reglesEmises,
  valeurAuPalier,
  type CanopRegleEmise,
} from "../../../test/cssRules";

const PALIER_MD = 64;
const PALIER_SM = 37.5;

const DEGRADE_DU_HEROS =
  /linear-gradient\(\s*150deg\s*,\s*color-mix\(in srgb,\s*var\(--canop-palette-primary-light\)\s+22%,\s*transparent\)\s*,\s*color-mix\(in srgb,\s*var\(--canop-palette-accent-light\)\s+18%,\s*transparent\)\s*\)/;
const VOILE_DU_HEROS =
  /color-mix\(in srgb,\s*var\(--canop-palette-surface-base\)\s+33%,\s*transparent\)/;
const FLOU_DU_HEROS = "blur(0.35rem) saturate(1.3)";

type Mode = "light" | "dark";

function poserCarte(props: Partial<CanopCardProps> = {}, mode: Mode = "light") {
  const { container } = render(
    <CanopThemeProvider mode={mode}>
      <Card variant="frosted" title="Bonjour" {...props}>
        Trois revues vous attendent.
      </Card>
    </CanopThemeProvider>,
  );
  const racine = racineDeCarte(container);
  return {
    racine,
    contenu: racine.querySelector(".MuiCardContent-root") as HTMLElement,
    entete: racine.querySelector(".MuiCardHeader-root") as HTMLElement,
  };
}

function fondsDe(regles: CanopRegleEmise[]): string {
  return regles
    .flatMap((regle) => [
      regle.style.getPropertyValue("background"),
      regle.style.getPropertyValue("background-image"),
      regle.style.getPropertyValue("background-color"),
    ])
    .filter((valeur) => valeur !== "")
    .join(" ; ");
}

const sansCondition = (regles: CanopRegleEmise[]) =>
  regles.filter((regle) => regle.conditions.length === 0);

const sousRepli = (regles: CanopRegleEmise[]) =>
  regles.filter((regle) =>
    regle.conditions.some(
      (condition) => /^not\b/.test(condition.trim()) && condition.includes("backdrop-filter"),
    ),
  );

const conditionsDeRepli = (regles: CanopRegleEmise[]) =>
  [...new Set(sousRepli(regles).flatMap((regle) => regle.conditions))].filter((condition) =>
    condition.includes("backdrop-filter"),
  );

const coucheDuBas = (fond: string) =>
  fond
    .split(/,(?![^(]*\))/)
    .at(-1)
    ?.trim() ?? "";

function paliersDePadding(element: HTMLElement) {
  return declarationsDe(element, "padding");
}

describe("AC1 - Card variant frosted : surface verre depoli du heros du Hub", () => {
  it("expose frosted parmi les variantes publiques de Card", () => {
    expectTypeOf<"frosted">().toMatchTypeOf<CanopCardVariant>();
  });

  it("pose le degrade a 150 degres de primary-light 22 % vers accent-light 18 %", () => {
    const { racine } = poserCarte();
    expect(fondsDe(sansCondition(reglesEmises(racine)))).toMatch(DEGRADE_DU_HEROS);
  });

  it("pose le voile surface-base a 33 % sous le degrade", () => {
    const { racine } = poserCarte();
    const fond = fondsDe(sansCondition(reglesEmises(racine)));
    expect(fond).toMatch(VOILE_DU_HEROS);
  });

  it("floute le fond en blur 0.35rem saturate 1.3", () => {
    const { racine } = poserCarte();
    expect(derniereValeurEmise(racine, "backdrop-filter")).toBe(FLOU_DU_HEROS);
  });

  it("emet aussi la forme prefixee -webkit-backdrop-filter avec les memes valeurs", () => {
    const { racine } = poserCarte();
    expect(blocsBrutsDe(racine).join("")).toContain(`-webkit-backdrop-filter:${FLOU_DU_HEROS}`);
  });

  it("arrondit la surface au rayon xl", () => {
    const { racine } = poserCarte();
    expect([radius.xl, "var(--canop-radius-xl)"]).toContain(
      derniereValeurEmise(racine, "border-radius"),
    );
  });

  it("decoupe la surface en squircle sur le rayon xl", () => {
    const { racine } = poserCarte();
    const decoupes = reglesEmises(racine)
      .flatMap((regle) => [
        regle.style.getPropertyValue("--canop-squircle-clip"),
        regle.style.getPropertyValue("clip-path"),
      ])
      .join(" ");
    expect(decoupes).toMatch(/polygon\(/);
    expect(decoupes).toContain("var(--canop-radius-xl)");
  });

  it("garde les memes valeurs de verre en theme sombre", () => {
    const { racine } = poserCarte({}, "dark");
    const fond = fondsDe(sansCondition(reglesEmises(racine)));
    expect(fond).toMatch(DEGRADE_DU_HEROS);
    expect(fond).toMatch(VOILE_DU_HEROS);
    expect(derniereValeurEmise(racine, "backdrop-filter")).toBe(FLOU_DU_HEROS);
  });
});

describe("AC1 - repli opaque sans backdrop-filter", () => {
  it("declare un repli sous @supports not backdrop-filter", () => {
    const { racine } = poserCarte();
    expect(sousRepli(reglesEmises(racine)).length).toBeGreaterThan(0);
  });

  it("comprend la forme prefixee -webkit- dans la condition du repli", () => {
    const { racine } = poserCarte();
    const conditions = conditionsDeRepli(reglesEmises(racine)).join(" ");
    expect(conditions).toMatch(/(?<!-webkit-)backdrop-filter/);
    expect(conditions).toContain("-webkit-backdrop-filter");
  });

  it("pose un fond opaque surface-base dans le repli", () => {
    const { racine } = poserCarte();
    const fond = fondsDe(sousRepli(reglesEmises(racine)));
    expect(coucheDuBas(fond)).toBe("var(--canop-palette-surface-base)");
    expect(fond).not.toMatch(VOILE_DU_HEROS);
  });

  it("garde le degrade du heros par-dessus le fond opaque du repli", () => {
    const { racine } = poserCarte();
    expect(fondsDe(sousRepli(reglesEmises(racine)))).toMatch(DEGRADE_DU_HEROS);
  });
});

describe("AC1 - rembourrage md puis xl a partir du point de rupture md", () => {
  const MD = [spacing.md, "var(--canop-spacing-md)"];
  const XL = [spacing.xl, "var(--canop-spacing-xl)"];

  it("rembourre le contenu en md sous le point de rupture md", () => {
    const { contenu } = poserCarte();
    expect(MD).toContain(valeurAuPalier(contenu, "padding", 0));
  });

  it("ne change pas de rembourrage au palier sm", () => {
    const { contenu } = poserCarte();
    expect(["", ...MD]).toContain(valeurAuPalier(contenu, "padding", PALIER_SM));
  });

  it("rembourre le contenu en xl a partir du point de rupture md", () => {
    const { contenu } = poserCarte();
    expect(XL).toContain(valeurAuPalier(contenu, "padding", PALIER_MD));
  });

  it("rembourre l'en-tete en md puis xl comme le contenu", () => {
    const { entete } = poserCarte();
    expect(MD).toContain(valeurAuPalier(entete, "padding", 0));
    expect(XL).toContain(valeurAuPalier(entete, "padding", PALIER_MD));
  });

  it("rembourre une carte sans en-tete en md puis xl", () => {
    const { contenu } = poserCarte({ title: undefined });
    expect(MD).toContain(valeurAuPalier(contenu, "padding", 0));
    expect(XL).toContain(valeurAuPalier(contenu, "padding", PALIER_MD));
  });
});

describe("AC1 - les props explicites restent honorees en frosted", () => {
  function poserSurface(props: Partial<CanopCardProps>) {
    const { container } = render(
      <CanopThemeProvider>
        <Card variant="surface" title="Bonjour" {...props}>
          Trois revues vous attendent.
        </Card>
      </CanopThemeProvider>,
    );
    const racine = racineDeCarte(container);
    return { racine, contenu: racine.querySelector(".MuiCardContent-root") as HTMLElement };
  }

  it.each(["2xl", "lg", "md"] as const)("honore radius=%s", (rayon) => {
    const { racine } = poserCarte({ radius: rayon });
    expect([radius[rayon], `var(--canop-radius-${rayon})`]).toContain(
      derniereValeurEmise(racine, "border-radius"),
    );
  });

  it("decoupe le squircle sur le rayon explicite", () => {
    const { racine } = poserCarte({ radius: "2xl" });
    const decoupes = reglesEmises(racine)
      .map((regle) => regle.style.getPropertyValue("--canop-squircle-clip"))
      .join(" ");
    expect(decoupes).toContain("var(--canop-radius-2xl)");
    expect(decoupes).not.toContain("var(--canop-radius-xl)");
  });

  it.each(["sm", "md", "lg"] as const)(
    "honore elevation=%s avec la meme ombre qu'une carte surface",
    (elevation) => {
      const attendue = derniereValeurEmise(poserSurface({ elevation }).racine, "filter");
      const { racine } = poserCarte({ elevation });
      expect(attendue).not.toBe("");
      expect(derniereValeurEmise(racine, "filter")).toBe(attendue);
    },
  );

  it.each(["comfortable", "standard", "dense"] as const)(
    "honore density=%s avec le meme rembourrage qu'une carte surface",
    (density) => {
      const attendu = paliersDePadding(poserSurface({ density }).contenu);
      const { contenu } = poserCarte({ density });
      expect(paliersDePadding(contenu)).toEqual(attendu);
    },
  );

  it("garde le verre quand elevation, radius et density sont explicites", () => {
    const { racine } = poserCarte({ elevation: "md", radius: "lg", density: "dense" });
    expect(fondsDe(sansCondition(reglesEmises(racine)))).toMatch(DEGRADE_DU_HEROS);
    expect(derniereValeurEmise(racine, "backdrop-filter")).toBe(FLOU_DU_HEROS);
  });
});

describe("AC5 - les variantes existantes de Card ne prennent pas le verre", () => {
  it.each(["surface", "interactive", "floating", "stat"] as const)(
    "laisse la variante %s sans degrade du heros ni flou",
    (variant) => {
      const { racine } = poserCarte({ variant });
      expect(fondsDe(reglesEmises(racine))).not.toMatch(DEGRADE_DU_HEROS);
      expect(derniereValeurEmise(racine, "backdrop-filter")).not.toBe(FLOU_DU_HEROS);
    },
  );

  it("garde surface comme variante par defaut", () => {
    const { container } = render(
      <CanopThemeProvider>
        <Card>Contenu</Card>
      </CanopThemeProvider>,
    );
    expect(fondsDe(reglesEmises(racineDeCarte(container)))).not.toMatch(DEGRADE_DU_HEROS);
  });
});

describe("AC2 - lisibilite en clair et en sombre", () => {
  const POSITIONS_DU_DEGRADE = Array.from({ length: 21 }, (_, index) => index / 20);

  type JeuDeCouleurs = typeof palette | typeof paletteDark;

  function verreSur(jeu: JeuDeCouleurs, dessous: string, position: number): string {
    const partPrimaire = (1 - position) * 0.22;
    const partAccent = position * 0.18;
    const opacite = partPrimaire + partAccent;
    const teinte = mixSrgb(jeu.primary.light, partPrimaire / opacite, jeu.accent.light);
    return mixSrgb(teinte, opacite, dessous);
  }

  const reposeSurReplis = (jeu: JeuDeCouleurs) =>
    POSITIONS_DU_DEGRADE.map((position) => verreSur(jeu, jeu.surface.base, position));

  const reposeSurFondParDefaut = (jeu: JeuDeCouleurs) => {
    const voile = mixSrgb(jeu.surface.base, 0.33, jeu.background.default);
    return POSITIONS_DU_DEGRADE.map((position) => verreSur(jeu, voile, position));
  };

  const pireContraste = (texte: string, fonds: string[]) =>
    Math.min(...fonds.map((fond) => contrastRatio(texte, fond)));

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("tient l'AA du texte primaire sur le repli opaque en %s", (_mode, jeu) => {
    expect(pireContraste(jeu.text.primary, reposeSurReplis(jeu))).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("tient l'AA du texte secondaire sur le repli opaque en %s", (_mode, jeu) => {
    expect(pireContraste(jeu.text.secondary, reposeSurReplis(jeu))).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)(
    "tient l'AA du texte primaire sur le verre pose sur background.default en %s",
    (_mode, jeu) => {
      expect(pireContraste(jeu.text.primary, reposeSurFondParDefaut(jeu))).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)(
    "tient l'AA du texte secondaire sur le verre pose sur background.default en %s",
    (_mode, jeu) => {
      expect(pireContraste(jeu.text.secondary, reposeSurFondParDefaut(jeu))).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );

  it.each(["light", "dark"] as const)("ecrit le texte en text.primary en mode %s", (mode) => {
    const { racine } = poserCarte({}, mode);
    expect(derniereValeurEmise(racine, "color")).toBe("var(--canop-palette-text-primary)");
  });

  it("ne joue aucune animation qui echapperait a reduced-motion", () => {
    const { racine } = poserCarte();
    const animations = reglesEmises(racine)
      .flatMap((regle) => [
        regle.style.getPropertyValue("animation"),
        regle.style.getPropertyValue("animation-name"),
      ])
      .filter((valeur) => valeur !== "" && valeur !== "none");
    expect(animations).toEqual([]);
  });
});
