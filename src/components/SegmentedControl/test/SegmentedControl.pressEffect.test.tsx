import { describe, expect, it } from "vitest";
import { SegmentedControl } from "../SegmentedControl";
import type { CanopSegmentedControlSize } from "../SegmentedControl";
import {
  DECOUPE_PAR_LE_SQUIRCLE,
  decoupeDuRipple,
  decoupeVue,
  estUnSquircle,
  poserDansLeTheme,
} from "../../../test/pressEffectKit";

type Mode = "light" | "dark";

const MODES: Mode[] = ["light", "dark"];
const TAILLES: CanopSegmentedControlSize[] = ["small", "medium"];
const CAS = MODES.flatMap((mode) => TAILLES.map((taille) => [taille, mode] as const));

function optionsRendues(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(".MuiButtonBase-root"));
}

function poserAvecLibelles(taille: CanopSegmentedControlSize, mode: Mode) {
  return poserDansLeTheme(
    <SegmentedControl
      ariaLabel="Vue"
      size={taille}
      options={[
        { value: "grille", label: "Grille" },
        { value: "liste", label: "Liste" },
      ]}
      value="grille"
      onChange={() => undefined}
    />,
    mode,
  );
}

function poserIconesSeules(taille: CanopSegmentedControlSize, mode: Mode) {
  return poserDansLeTheme(
    <SegmentedControl
      iconOnly
      ariaLabel="Vue"
      size={taille}
      options={[
        { value: "grille", label: "Grille", icon: "apps" },
        { value: "liste", label: "Liste", icon: "menu" },
      ]}
      value="grille"
      onChange={() => undefined}
    />,
    mode,
  );
}

function attendreUnRippleAuRayon(option: HTMLElement, rayon: string) {
  const decoupe = decoupeVue(option);
  expect(estUnSquircle(decoupe)).toBe(true);
  expect(decoupe).toContain(rayon);
  expect(decoupeDuRipple(option)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
}

describe("AC4 - SegmentedControl : ripple decoupe a la forme de l'option", () => {
  it.each(CAS)(
    "given des options avec libelle %s en theme %s, when chacune est pressee, then son ripple suit un squircle au rayon md",
    (taille, mode) => {
      const options = optionsRendues(poserAvecLibelles(taille, mode).container);
      expect(options).toHaveLength(2);
      for (const option of options) attendreUnRippleAuRayon(option, "var(--canop-radius-md)");
    },
  );

  it.each(CAS)(
    "given des options iconOnly %s en theme %s, when chacune est pressee, then son ripple suit un squircle pill",
    (taille, mode) => {
      const options = optionsRendues(poserIconesSeules(taille, mode).container);
      expect(options).toHaveLength(2);
      for (const option of options) attendreUnRippleAuRayon(option, "var(--canop-radius-pill)");
    },
  );

  it("given une option non selectionnee, when elle est rendue, then son contour de ripple est celui de l'option selectionnee", () => {
    const [selectionnee, autre] = optionsRendues(poserAvecLibelles("medium", "light").container);
    expect(decoupeVue(autre)).toBe(decoupeVue(selectionnee));
  });
});
