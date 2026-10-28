import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Breadcrumb } from "../Breadcrumb";
import type { CanopBreadcrumbItem } from "../breadcrumbTypes";
import {
  DECOUPE_PAR_LE_SQUIRCLE,
  contourExterieurDuFondEstLaDecoupe,
  decoupeDuRipple,
  decoupeVue,
  estUnSquircle,
  poserDansLeTheme,
} from "../../../test/pressEffectKit";

const MODES = ["light", "dark"] as const;
const vide = () => undefined;

const LONG_CHEMIN: CanopBreadcrumbItem[] = [
  { id: "racine", label: "Accueil", onClick: vide },
  { id: "docs", label: "Documents", onClick: vide },
  { id: "annee", label: "2026", onClick: vide },
  { id: "rapports", label: "Rapports" },
];

function poserLeFil(mode: (typeof MODES)[number] = "light") {
  poserDansLeTheme(<Breadcrumb items={LONG_CHEMIN} maxItems={2} />, mode);
}

describe("AC4 - Breadcrumb : ripple decoupe a la forme du segment", () => {
  it.each(MODES)(
    "given un lien de fil d'Ariane en theme %s, when il est presse, then son ripple est decoupe par son squircle",
    (mode) => {
      poserLeFil(mode);
      const lien = screen.getByRole("button", { name: "Accueil" });
      expect(estUnSquircle(decoupeVue(lien))).toBe(true);
      expect(decoupeDuRipple(lien)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it.each(MODES)(
    "given le repli du fil d'Ariane en theme %s, when il est presse, then son ripple est decoupe par son squircle",
    (mode) => {
      poserLeFil(mode);
      const repli = screen.getByRole("button", { name: "Afficher le chemin complet" });
      expect(estUnSquircle(decoupeVue(repli))).toBe(true);
      expect(decoupeDuRipple(repli)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it.each(["Accueil", "Afficher le chemin complet"])(
    "given l'element %s du fil d'Ariane, when il est rendu, then le squircle du ripple est le contour de son fond",
    (nom) => {
      poserLeFil();
      expect(contourExterieurDuFondEstLaDecoupe(screen.getByRole("button", { name: nom }))).toBe(
        true,
      );
    },
  );

  it("given un fil d'Ariane sans repli, when un lien intermediaire est presse, then son ripple reste decoupe", () => {
    poserDansLeTheme(<Breadcrumb items={LONG_CHEMIN} />);
    const lien = screen.getByRole("button", { name: "Documents" });
    expect(estUnSquircle(decoupeVue(lien))).toBe(true);
    expect(decoupeDuRipple(lien)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
  });
});
