import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Button } from "../Button";
import type { CanopButtonSize, CanopButtonVariant } from "../Button";
import {
  DECOUPE_PAR_LE_SQUIRCLE,
  decoupeDuRipple,
  decoupeVue,
  estUnSquircle,
  contourExterieurDuFondEstLaDecoupe,
  poserDansLeTheme,
} from "../../../test/pressEffectKit";

const VARIANTES: CanopButtonVariant[] = [
  "primary",
  "secondary",
  "accent",
  "danger",
  "tonal",
  "ghost",
  "text",
];
const TAILLES: CanopButtonSize[] = ["small", "medium", "large"];
const MODES = ["light", "dark"] as const;

const CAS = MODES.flatMap((mode) => VARIANTES.map((variante) => [variante, mode] as const));

function boutonRendu(nom: string): HTMLElement {
  return screen.getByRole("button", { name: nom });
}

describe("AC2 - Button : le ripple suit le squircle du bouton", () => {
  it.each(CAS)(
    "given un Button %s en theme %s, when il est rendu, then il pose lui-meme son squircle",
    (variante, mode) => {
      poserDansLeTheme(<Button variant={variante}>Valider</Button>, mode);
      expect(estUnSquircle(decoupeVue(boutonRendu("Valider")))).toBe(true);
    },
  );

  it.each(CAS)(
    "given un Button %s en theme %s, when il est presse, then son ripple est decoupe par ce squircle",
    (variante, mode) => {
      poserDansLeTheme(<Button variant={variante}>Valider</Button>, mode);
      expect(decoupeDuRipple(boutonRendu("Valider"))).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it.each(VARIANTES)(
    "given un Button %s, when il est rendu, then le squircle du ripple est exactement le contour dessine du bouton",
    (variante) => {
      poserDansLeTheme(<Button variant={variante}>Valider</Button>);
      expect(contourExterieurDuFondEstLaDecoupe(boutonRendu("Valider"))).toBe(true);
    },
  );

  it.each(TAILLES)(
    "given un Button de taille %s, when il est presse, then son ripple reste decoupe par son squircle",
    (taille) => {
      poserDansLeTheme(<Button size={taille}>Valider</Button>);
      const bouton = boutonRendu("Valider");
      expect(estUnSquircle(decoupeVue(bouton))).toBe(true);
      expect(decoupeDuRipple(bouton)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it("given un Button pleine largeur avec icones, when il est presse, then son ripple reste decoupe par son squircle", () => {
    poserDansLeTheme(
      <Button fullWidth startIcon={<span>a</span>} endIcon={<span>b</span>}>
        Valider
      </Button>,
    );
    const bouton = boutonRendu("a Valider b");
    expect(estUnSquircle(decoupeVue(bouton))).toBe(true);
    expect(decoupeDuRipple(bouton)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
  });

  it("given deux Button imbriques dans un ancetre squircle, when ils sont rendus, then chacun garde le sien", () => {
    poserDansLeTheme(
      <div style={{ ["--canop-squircle-clip" as string]: "polygon(0% 0%, 100% 0%, 100% 100%)" }}>
        <Button variant="primary">Un</Button>
        <Button variant="text">Deux</Button>
      </div>,
    );
    expect(decoupeVue(boutonRendu("Un"))).not.toBe("polygon(0% 0%, 100% 0%, 100% 100%)");
    expect(estUnSquircle(decoupeVue(boutonRendu("Deux")))).toBe(true);
  });
});
