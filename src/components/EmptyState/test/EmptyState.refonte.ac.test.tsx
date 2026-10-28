import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import type { CanopThemeMode } from "../../../theme";
import { EmptyState, type CanopEmptyStateProps, type CanopEmptyStateSize } from "../../../index";
import { reglesEmises, valeursEmises } from "../../../test/cssRules";
import { estDeCouleur, halosDuSousArbre, rendreNeon } from "../../../test/neonGlowKit";

const REQUETE_MOUVEMENT_REDUIT = "prefers-reduced-motion: reduce";
const FLOTTEMENT = "canop-empty-state-float";
const DELAI_MAX_CASCADE_MS = 4000;

type Etape = "pastille" | "titre" | "description" | "action";

const ORDRE_DE_LA_CASCADE: Etape[] = ["pastille", "titre", "description", "action"];

const matchMediaOrigine = window.matchMedia;

function poser(props: Partial<CanopEmptyStateProps> = {}, mode: CanopThemeMode = "light") {
  return rendreNeon(
    <EmptyState
      title="Aucun fichier"
      description="Importez votre premier document."
      icon={<span data-testid="illustration" />}
      action={<button type="button">Importer</button>}
      {...props}
    />,
    mode,
  );
}

function rendreAvec(ui: ReactElement) {
  return rendreNeon(ui, "light");
}

function declareUnSquircle(element: Element): boolean {
  return reglesEmises(element).some(
    (regle) => regle.style.getPropertyValue("--canop-squircle-clip") !== "",
  );
}

function pastille(): HTMLElement {
  let element = screen.getByTestId("illustration").parentElement;
  while (element && !declareUnSquircle(element)) {
    element = element.parentElement;
  }
  if (!element) throw new Error("pastille introuvable");
  return element;
}

function racineDeLEtatVide(): HTMLElement {
  let element = screen.getByRole("heading", { name: "Aucun fichier" }).parentElement;
  while (element && ["", "auto"].includes(getComputedStyle(element).minHeight)) {
    element = element.parentElement;
  }
  if (!element) throw new Error("racine introuvable");
  return element;
}

function ascendantsJusquALaRacine(element: HTMLElement): HTMLElement[] {
  const racine = racineDeLEtatVide();
  const chaine: HTMLElement[] = [];
  for (let courant: HTMLElement | null = element; courant; courant = courant.parentElement) {
    chaine.push(courant);
    if (courant === racine) break;
  }
  return chaine;
}

function fondsEmis(element: Element, pseudo: RegExp = /.*/): string[] {
  return reglesEmises(element)
    .filter((regle) => pseudo.test(regle.selecteur))
    .flatMap((regle) => [
      regle.style.getPropertyValue("background"),
      regle.style.getPropertyValue("background-image"),
      regle.style.getPropertyValue("background-color"),
    ])
    .filter((valeur) => valeur !== "");
}

function animationsDe(element: Element, sousMouvementReduit: boolean) {
  return reglesEmises(element)
    .filter(
      (regle) =>
        regle.conditions.some((condition) => condition.includes(REQUETE_MOUVEMENT_REDUIT)) ===
        sousMouvementReduit,
    )
    .map((regle) => ({
      selecteur: regle.selecteur,
      valeur:
        regle.style.getPropertyValue("animation") || regle.style.getPropertyValue("animation-name"),
    }))
    .filter((animation) => animation.valeur !== "");
}

function animationsActivesDuSousArbre(racine: Element) {
  return [racine, ...Array.from(racine.querySelectorAll("*"))].flatMap((element) =>
    animationsDe(element, false)
      .filter((animation) => !animation.valeur.trim().startsWith("none"))
      .map((animation) => ({ element, ...animation })),
  );
}

function flottementDuSousArbre(racine: Element) {
  return animationsActivesDuSousArbre(racine).filter((animation) =>
    animation.valeur.includes(FLOTTEMENT),
  );
}

function opaciteEffective(element: HTMLElement): number {
  let opacite = 1;
  for (let courant: HTMLElement | null = element; courant; courant = courant.parentElement) {
    if (courant.style.opacity !== "") opacite *= Number(courant.style.opacity);
  }
  return opacite;
}

function elementsDeLaCascade(): Record<Etape, HTMLElement> {
  return {
    pastille: screen.getByTestId("illustration"),
    titre: screen.getByRole("heading", { name: "Aucun fichier" }),
    description: screen.getByText("Importez votre premier document."),
    action: screen.getByRole("button", { name: "Importer" }),
  };
}

function opacites(): Record<Etape, number> {
  const elements = elementsDeLaCascade();
  return Object.fromEntries(
    ORDRE_DE_LA_CASCADE.map((etape) => [etape, opaciteEffective(elements[etape])]),
  ) as Record<Etape, number>;
}

async function premieresApparitions(): Promise<Record<Etape, number>> {
  const apparitions: Partial<Record<Etape, number>> = {};
  const debut = performance.now();
  while (Object.keys(apparitions).length < ORDRE_DE_LA_CASCADE.length) {
    if (performance.now() - debut > DELAI_MAX_CASCADE_MS) throw new Error("cascade inachevée");
    const instant = performance.now() - debut;
    const courantes = opacites();
    for (const etape of ORDRE_DE_LA_CASCADE) {
      if (apparitions[etape] === undefined && courantes[etape] > 0) apparitions[etape] = instant;
    }
    await act(() => new Promise((resolve) => setTimeout(resolve, 8)));
  }
  return apparitions as Record<Etape, number>;
}

function simulerMouvementReduit() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((requete: string) => ({
      matches: requete.includes(REQUETE_MOUVEMENT_REDUIT),
      media: requete,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function remEnNombre(valeur: string): number {
  const [, nombre] = valeur.match(/^([\d.]+)rem$/) ?? [];
  if (nombre === undefined) throw new Error(`valeur en rem attendue : ${valeur}`);
  return Number(nombre);
}

function taillePosee(size: CanopEmptyStateSize | undefined) {
  const rendu = poser({ size });
  const mesure = {
    hauteurMinimale: getComputedStyle(racineDeLEtatVide()).minHeight,
    pastille: remEnNombre(getComputedStyle(pastille()).minWidth),
    titre: remEnNombre(
      valeursEmises(screen.getByRole("heading", { name: "Aucun fichier" }), "font-size").at(0) ??
        "",
    ),
  };
  rendu.unmount();
  return mesure;
}

afterEach(() => {
  window.matchMedia = matchMediaOrigine;
});

describe("AC4 - pastille squircle teintée primary entourée d'un halo", () => {
  it.each(["ambient", "plain"] as const)(
    "place l'illustration dans une pastille découpée en squircle en surface %s",
    (surface) => {
      poser({ surface });
      const forme = pastille();
      expect(forme).toContainElement(screen.getByTestId("illustration"));
      expect(getComputedStyle(forme).getPropertyValue("--canop-squircle-clip")).toMatch(
        /^polygon\(/,
      );
      expect(["", "0", "0px"]).toContain(getComputedStyle(forme).borderRadius);
    },
  );

  it("teinte la pastille avec la couleur primary", () => {
    poser();
    expect(fondsEmis(pastille()).some((fond) => fond.includes("--canop-palette-primary"))).toBe(
      true,
    );
  });

  it("entoure la pastille d'un halo radial primary", () => {
    poser();
    const halos = ascendantsJusquALaRacine(pastille())
      .flatMap((element) => fondsEmis(element, /::(before|after)$/))
      .filter(
        (fond) => fond.includes("radial-gradient") && fond.includes("--canop-palette-primary"),
      );
    expect(halos.length).toBeGreaterThan(0);
  });

  it("rend aussi une pastille pour une illustration riche passée en icône", () => {
    poser({ icon: <svg data-testid="illustration" /> });
    expect(pastille()).toContainElement(screen.getByTestId("illustration"));
  });
});

describe("AC5 - néon de la pastille en thème sombre uniquement", () => {
  it.each(["ambient", "plain"] as const)(
    "allume la pastille d'un halo néon primary en sombre en surface %s",
    (surface) => {
      poser({ surface }, "dark");
      const halos = halosDuSousArbre(pastille());
      expect(halos.length).toBeGreaterThan(0);
      expect(halos.every((halo) => estDeCouleur(halo, "primary"))).toBe(true);
    },
  );

  it.each(["ambient", "plain"] as const)(
    "ne pose aucun néon sur la pastille en clair en surface %s",
    (surface) => {
      poser({ surface }, "light");
      expect(halosDuSousArbre(pastille())).toEqual([]);
    },
  );
});

describe("AC6 - apparition en cascade et flottement", () => {
  it(
    "fait apparaître la pastille, puis le titre, la description et l'action dans cet ordre",
    async () => {
      poser();
      expect(Object.values(opacites())).toEqual([0, 0, 0, 0]);
      const apparitions = await premieresApparitions();
      const instants = ORDRE_DE_LA_CASCADE.map((etape) => apparitions[etape]);
      expect(instants).toEqual([...instants].sort((a, b) => a - b));
      expect(apparitions.action).toBeGreaterThan(apparitions.pastille);
    },
    DELAI_MAX_CASCADE_MS + 2000,
  );

  it("fait flotter la pastille par défaut", () => {
    poser();
    const flottements = flottementDuSousArbre(racineDeLEtatVide());
    expect(flottements.length).toBeGreaterThan(0);
    flottements.forEach(({ element }) =>
      expect(element.contains(screen.getByTestId("illustration"))).toBe(true),
    );
  });

  it.each(["light", "dark"] as const)(
    "rend tout immobile et visible d'emblée avec animated false en %s",
    (mode) => {
      poser({ animated: false, surface: "plain" }, mode);
      expect(Object.values(opacites())).toEqual([1, 1, 1, 1]);
      expect(animationsActivesDuSousArbre(racineDeLEtatVide())).toEqual([]);
    },
  );

  it("coupe le flottement avec animated false en surface ambient", () => {
    poser({ animated: false });
    expect(flottementDuSousArbre(racineDeLEtatVide())).toEqual([]);
  });

  it("affiche tout d'emblée sans cascade sous prefers-reduced-motion", () => {
    simulerMouvementReduit();
    poser();
    expect(Object.values(opacites())).toEqual([1, 1, 1, 1]);
  });

  it.each(["light", "dark"] as const)(
    "neutralise sous prefers-reduced-motion toute animation de l'état vide en %s",
    (mode) => {
      poser({ surface: "plain" }, mode);
      const actives = animationsActivesDuSousArbre(racineDeLEtatVide());
      expect(actives.length).toBeGreaterThan(0);
      actives.forEach(({ element, selecteur }) => {
        const neutralisees = animationsDe(element, true).filter(
          (animation) =>
            animation.selecteur === selecteur && animation.valeur.trim().startsWith("none"),
        );
        expect(neutralisees, selecteur).not.toEqual([]);
      });
    },
  );
});

describe("AC7 - taille sm, md et lg", () => {
  it("expose le type CanopEmptyStateSize avec sm, md et lg", () => {
    expectTypeOf<"sm" | "md" | "lg">().toEqualTypeOf<CanopEmptyStateSize>();
  });

  it("utilise md par défaut, avec une hauteur minimale de 22rem", () => {
    const parDefaut = taillePosee(undefined);
    expect(parDefaut).toEqual(taillePosee("md"));
    expect(parDefaut.hauteurMinimale).toBe("22rem");
  });

  it("fait croître hauteur minimale, pastille et titre de sm à md puis lg", () => {
    const [sm, md, lg] = (["sm", "md", "lg"] as const).map(taillePosee);
    const hauteurs = [sm, md, lg].map((mesure) => remEnNombre(mesure.hauteurMinimale));
    expect(hauteurs[0]).toBeLessThan(hauteurs[1]);
    expect(hauteurs[1]).toBeLessThan(hauteurs[2]);
    expect(sm.pastille).toBeLessThan(md.pastille);
    expect(md.pastille).toBeLessThan(lg.pastille);
    expect(sm.titre).toBeLessThan(md.titre);
    expect(md.titre).toBeLessThan(lg.titre);
  });
});

describe("AC8 - pas de rupture d'API", () => {
  it.each(["sm", "md", "lg"] as const)(
    "laisse minHeight l'emporter sur la hauteur de la taille %s",
    (size) => {
      poser({ size, minHeight: "10rem" });
      expect(getComputedStyle(racineDeLEtatVide()).minHeight).toBe("10rem");
    },
  );

  it("accepte headingLevel, description riche et action avec toutes les tailles et surfaces", () => {
    rendreAvec(
      <EmptyState
        title="Aucun fichier"
        headingLevel={3}
        size="lg"
        surface="plain"
        animated={false}
        description={
          <ul>
            <li>Importer un fichier</li>
          </ul>
        }
        action={<button type="button">Importer</button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Aucun fichier" })).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("Importer un fichier");
    expect(screen.getByRole("listitem").closest("p")).toBeNull();
    expect(screen.getByRole("button", { name: "Importer" })).toBeInTheDocument();
  });
});
