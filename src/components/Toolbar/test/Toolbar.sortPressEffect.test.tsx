import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Toolbar } from "../Toolbar";
import { derniereValeurEmise, reglesDe } from "../../../test/cssRules";
import {
  DECOUPE_PAR_LE_SQUIRCLE,
  contourExterieurDuFondEstLaDecoupe,
  decoupeDuRipple,
  decoupeVue,
  estUnSquircle,
  formeDuFond,
  poserDansLeTheme,
} from "../../../test/pressEffectKit";

type Mode = "light" | "dark";

const MODES: Mode[] = ["light", "dark"];
const OPTIONS = [
  { id: "nom", label: "Nom" },
  { id: "date", label: "Date" },
];

function boutonDeTri(mode: Mode = "light"): HTMLElement {
  poserDansLeTheme(
    <Toolbar sort={{ options: OPTIONS, value: "nom", onChange: () => undefined }} />,
    mode,
  );
  return screen.getByRole("button", { name: "Trier" });
}

function rayonDuSquircle(decoupe: string): string {
  return /^polygon\(0%\s*min\((.+?),\s*50%\)/.exec(decoupe)?.[1] ?? "";
}

function estUnePilule(element: HTMLElement): boolean {
  const rayon = rayonDuSquircle(decoupeVue(element));
  if (rayon === "var(--canop-radius-pill)") return true;
  const hauteur =
    derniereValeurEmise(element, "height") || derniereValeurEmise(element, "min-height");
  return rayon.endsWith("rem") && parseFloat(rayon) * 2 >= parseFloat(hauteur);
}

function estUnSelecteurDeRacine(selecteur: string): boolean {
  return !["::", ">", "+", "~", " "].some((marque) => selecteur.includes(marque));
}

describe("AC4 - Toolbar : bouton de tri en pilule", () => {
  it.each(MODES)(
    "given le bouton de tri en theme %s, when il est presse, then son ripple est decoupe par son squircle",
    (mode) => {
      const bouton = boutonDeTri(mode);
      expect(estUnSquircle(decoupeVue(bouton))).toBe(true);
      expect(decoupeDuRipple(bouton)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it("given le bouton de tri, when il est rendu, then son squircle est une pilule", () => {
    expect(estUnePilule(boutonDeTri())).toBe(true);
  });

  it("given le bouton de tri, when il est survole, then son fond de survol a le contour pilule du ripple", () => {
    const bouton = boutonDeTri();
    expect(formeDuFond(bouton)).not.toBe("");
    expect(contourExterieurDuFondEstLaDecoupe(bouton)).toBe(true);
    const survolDuFond = reglesDe(bouton, "background-color").filter(
      (regle) => regle.selecteur.includes(":hover") && regle.selecteur.includes("::before"),
    );
    expect(survolDuFond).not.toHaveLength(0);
  });

  it.each(MODES)(
    "given le bouton de tri en theme %s, when il change d'etat, then sa racine ne peint aucun fond rectangulaire",
    (mode) => {
      const fondsDeLaRacine = reglesDe(boutonDeTri(mode), "background-color").filter((regle) =>
        estUnSelecteurDeRacine(regle.selecteur),
      );
      expect(fondsDeLaRacine).not.toHaveLength(0);
      for (const regle of fondsDeLaRacine) expect(regle.valeur).toBe("transparent");
    },
  );
});
