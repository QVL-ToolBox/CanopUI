import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import * as bibliotheque from "../../../index";
import { ShapeBackground } from "..";
import type { CanopShapeBackgroundProps, CanopShapeVariant } from "../../../index";
import {
  coucheDecorative,
  installerEnvironnementLave,
  lueurs,
  quitterEnvironnementLave,
  rendreAvecTheme,
} from "./lavaTestKit";

const VARIANTES_CENTREES: CanopShapeVariant[] = ["hero", "ambient"];

function rendreFond(props: CanopShapeBackgroundProps = {}) {
  return rendreAvecTheme(
    <ShapeBackground {...props}>{props.children ?? <p>Contenu de page</p>}</ShapeBackground>,
  );
}

function racine(): HTMLElement {
  return coucheDecorative().parentElement as HTMLElement;
}

function zoneDeContenu(): HTMLElement {
  return screen.getByText("Contenu de page").parentElement as HTMLElement;
}

const DOSAGE_DE_TEINTE = /color-mix\([^,]*, var\([^)]*\) (-?[\d.]+)%/;

function eclats(): number[] {
  return lueurs().map((lueur) => {
    const dosage = DOSAGE_DE_TEINTE.exec(getComputedStyle(lueur).backgroundImage);
    return dosage ? Number(dosage[1]) / 100 : Number.NaN;
  });
}

function opacites(): number[] {
  return [...lueurs().map((lueur) => Number(lueur.style.opacity)), ...eclats()];
}

function eclatTotal(): number {
  return eclats().reduce((somme, valeur) => somme + valeur, 0);
}

function teintesDesLueurs(): string {
  return lueurs()
    .map((lueur) => getComputedStyle(lueur).backgroundImage)
    .join(" ");
}

describe("ShapeBackground — contrat public", () => {
  beforeEach(() => {
    installerEnvironnementLave();
  });

  afterEach(() => {
    quitterEnvironnementLave();
  });

  it("expose ShapeBackground depuis le point d'entrée de la librairie", () => {
    expect(bibliotheque.ShapeBackground).toBe(ShapeBackground);
  });

  it("rend le contenu au-dessus d'un fond décoratif masqué aux technologies d'assistance", () => {
    rendreFond();
    const fond = coucheDecorative();
    expect(fond).toHaveAttribute("aria-hidden", "true");
    expect(getComputedStyle(fond).pointerEvents).toBe("none");
    expect(fond).not.toContainElement(screen.getByText("Contenu de page"));
    expect(Number(getComputedStyle(zoneDeContenu()).zIndex)).toBeGreaterThan(
      Number(getComputedStyle(fond).zIndex),
    );
  });

  it("ne rend aucun élément interactif dans le fond", () => {
    rendreFond();
    expect(coucheDecorative().querySelectorAll("a, button, input, [tabindex]")).toHaveLength(0);
  });

  it.each(VARIANTES_CENTREES)(
    "centre le contenu sur toute la hauteur d'écran avec un padding de 1rem en variante %s",
    (variant) => {
      rendreFond({ variant });
      const style = getComputedStyle(racine());
      expect(style.minHeight).toBe("100vh");
      expect(style.padding).toBe("1rem");
      expect(style.justifyContent).toBe("center");
    },
  );

  it("utilise la variante hero par défaut", () => {
    rendreFond();
    expect(getComputedStyle(racine()).minHeight).toBe("100vh");
    expect(getComputedStyle(racine()).justifyContent).toBe("center");
  });

  it("place le contenu en haut sans hauteur minimale en variante edge", () => {
    rendreFond({ variant: "edge" });
    const style = getComputedStyle(racine());
    expect(style.justifyContent).toBe("flex-start");
    expect(["", "auto", "0", "0px"]).toContain(style.minHeight);
  });

  it.each([
    [320, "320px"],
    ["50vh", "50vh"],
  ])("respecte la hauteur minimale fournie %s", (minHeight, attendu) => {
    rendreFond({ minHeight });
    expect(getComputedStyle(racine()).minHeight).toBe(attendu);
  });

  it("rend la racine avec la balise demandée par component", () => {
    rendreFond({ component: "section" });
    expect(racine().tagName).toBe("SECTION");
  });

  it("applique sx à la racine et contentSx à la zone de contenu", () => {
    rendreFond({ sx: { marginTop: "13px" }, contentSx: { marginBottom: "19px" } });
    expect(getComputedStyle(racine()).marginTop).toBe("13px");
    expect(getComputedStyle(zoneDeContenu()).marginBottom).toBe("19px");
  });

  it("affiche dix masses par défaut", () => {
    rendreFond();
    expect(lueurs()).toHaveLength(10);
  });

  it.each([
    [4, 4],
    [1, 1],
    [10, 10],
    [0, 1],
    [-3, 1],
    [15, 10],
    [1000, 10],
  ])("borne la densité %s à %s masses", (density, attendu) => {
    rendreFond({ density });
    expect(lueurs()).toHaveLength(attendu);
  });

  it("garde des opacités entre 0 et 1 avec l'intensité par défaut", () => {
    rendreFond();
    opacites().forEach((opacite) => {
      expect(opacite).toBeGreaterThanOrEqual(0);
      expect(opacite).toBeLessThanOrEqual(1);
    });
  });

  it.each([0, 0.3, 5, 1000, -4])(
    "borne les opacités entre 0 et 1 pour une intensité de %s",
    (intensity) => {
      rendreFond({ intensity });
      expect(opacites().length).toBeGreaterThan(0);
      opacites().forEach((opacite) => {
        expect(Number.isNaN(opacite)).toBe(false);
        expect(opacite).toBeGreaterThanOrEqual(0);
        expect(opacite).toBeLessThanOrEqual(1);
      });
    },
  );

  it("éteint l'éclat des masses avec une intensité nulle", () => {
    rendreFond({ intensity: 0 });
    eclats().forEach((eclat) => expect(eclat).toBe(0));
  });

  it("multiplie l'éclat des masses selon l'intensité", () => {
    const { unmount } = rendreFond({ intensity: 0.3 });
    const reduit = eclatTotal();
    unmount();
    const parDefaut = rendreFond();
    const normal = eclatTotal();
    parDefaut.unmount();
    rendreFond({ intensity: 3 });
    const renforce = eclatTotal();
    expect(reduit).toBeGreaterThan(0);
    expect(reduit).toBeLessThan(normal);
    expect(renforce).toBeGreaterThan(normal);
  });

  it("colore les masses en primary par défaut", () => {
    rendreFond();
    expect(teintesDesLueurs()).toContain("--canop-palette-primary-main");
  });

  it.each(["secondary", "secondary.main"])("accepte la couleur %s", (color) => {
    rendreFond({ color });
    expect(teintesDesLueurs()).toContain("--canop-palette-secondary-main");
    expect(teintesDesLueurs()).not.toContain("--canop-palette-primary-main");
  });

  it.each(["inconnue", "", "rouge.vif", "#ff0000"])(
    "retombe sur primary pour la couleur %s",
    (color) => {
      rendreFond({ color });
      expect(teintesDesLueurs()).toContain("--canop-palette-primary-main");
    },
  );

  it.each(["light", "dark"] as const)("se rend sans erreur en thème %s", (mode) => {
    rendreAvecTheme(
      <ShapeBackground>
        <p>Contenu de page</p>
      </ShapeBackground>,
      mode,
    );
    expect(screen.getByText("Contenu de page")).toBeInTheDocument();
    expect(lueurs()).toHaveLength(10);
  });
});
