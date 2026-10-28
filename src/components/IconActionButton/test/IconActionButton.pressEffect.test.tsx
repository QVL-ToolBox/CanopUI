import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { IconActionButton } from "../IconActionButton";
import type { CanopIconActionButtonVariant } from "../IconActionButton";
import {
  DECOUPE_PAR_LE_SQUIRCLE,
  ECHELLE_JUSQU_AUX_COINS,
  decoupeDuRipple,
  decoupeVue,
  echelleDeLOnde,
  estUnSquircle,
  contourExterieurDuFondEstLaDecoupe,
  poserDansLeTheme,
} from "../../../test/pressEffectKit";

const VARIANTES: CanopIconActionButtonVariant[] = ["default", "danger", "secondary", "accent"];
const MODES = ["light", "dark"] as const;
const CAS = MODES.flatMap((mode) => VARIANTES.map((variante) => [variante, mode] as const));

function boutonRendu(): HTMLElement {
  return screen.getByRole("button", { name: "Supprimer" });
}

describe("AC3 - IconActionButton : ripple squircle et onde agrandie", () => {
  it.each(CAS)(
    "given un IconActionButton %s en theme %s, when il est presse, then son ripple est decoupe par son squircle",
    (variante, mode) => {
      poserDansLeTheme(
        <IconActionButton icon="trash" ariaLabel="Supprimer" variant={variante} />,
        mode,
      );
      const bouton = boutonRendu();
      expect(estUnSquircle(decoupeVue(bouton))).toBe(true);
      expect(decoupeDuRipple(bouton)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it.each(VARIANTES)(
    "given un IconActionButton %s, when il est rendu, then le squircle du ripple est le contour dessine du bouton",
    (variante) => {
      poserDansLeTheme(<IconActionButton icon="trash" ariaLabel="Supprimer" variant={variante} />);
      expect(contourExterieurDuFondEstLaDecoupe(boutonRendu())).toBe(true);
    },
  );

  it.each(CAS)(
    "given un IconActionButton %s en theme %s, when il est presse, then l'onde centree est agrandie d'environ racine de deux",
    async (variante, mode) => {
      poserDansLeTheme(
        <IconActionButton icon="trash" ariaLabel="Supprimer" variant={variante} />,
        mode,
      );
      expect(await echelleDeLOnde(boutonRendu())).toBeCloseTo(ECHELLE_JUSQU_AUX_COINS, 3);
    },
  );

  it.each(["2rem", "2.5rem", "4rem"])(
    "given un IconActionButton de %s de cote, when il est presse, then son ripple suit son contour dessine",
    async (taille) => {
      poserDansLeTheme(<IconActionButton icon="trash" ariaLabel="Supprimer" size={taille} />);
      const bouton = boutonRendu();
      expect(estUnSquircle(decoupeVue(bouton))).toBe(true);
      expect(contourExterieurDuFondEstLaDecoupe(bouton)).toBe(true);
      expect(decoupeDuRipple(bouton)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
      expect(await echelleDeLOnde(bouton)).toBeCloseTo(ECHELLE_JUSQU_AUX_COINS, 3);
    },
  );
});
