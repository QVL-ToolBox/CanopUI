import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider, palette, paletteDark } from "../../../index";
import { contrastRatio } from "../../../test/contrastRatio";
import { derniereValeurDansLeGroupe, derniereValeurEmise } from "../../../test/cssRules";
import { IconActionButton, type CanopIconActionButtonVariant } from "../IconActionButton";

type Mode = "light" | "dark";

const FOND_ACCENT = "var(--canop-palette-accent-main)";
const GLYPHE_ACCENT = "var(--canop-palette-accent-contrasttext)";

function poserBouton(
  props: { disabled?: boolean; loading?: boolean; onClick?: () => void } = {},
  mode: Mode = "light",
) {
  render(
    <CanopThemeProvider mode={mode}>
      <IconActionButton icon="download" variant="accent" ariaLabel="Télécharger" {...props} />
    </CanopThemeProvider>,
  );
  return screen.getByRole("button", { name: "Télécharger" });
}

function poserVariante(
  variant: CanopIconActionButtonVariant,
  disabled = false,
  mode: Mode = "light",
) {
  render(
    <CanopThemeProvider mode={mode}>
      <IconActionButton icon="download" variant={variant} ariaLabel={variant} disabled={disabled} />
    </CanopThemeProvider>,
  );
  return screen.getByRole("button", { name: variant });
}

const fondAuRepos = (bouton: HTMLElement) =>
  derniereValeurEmise(bouton, "background-color", "::before");
const fondAuSurvol = (bouton: HTMLElement) =>
  derniereValeurDansLeGroupe(bouton, "background-color", ":hover::before");
const fondAuFocusClavier = (bouton: HTMLElement) =>
  derniereValeurDansLeGroupe(bouton, "background-color", ".Mui-focusVisible::before");
const SANS_ANNEAU = /^(|none|0(px)?)$/;
const couleurDuGlyphe = (bouton: HTMLElement) => derniereValeurEmise(bouton, "color").toLowerCase();

describe("AC3 - IconActionButton variante accent : fond et glyphe", () => {
  it("expose accent parmi les variantes publiques", () => {
    expectTypeOf<"accent">().toMatchTypeOf<CanopIconActionButtonVariant>();
  });

  it.each(["light", "dark"] as const)("pose un fond accent.main en mode %s", (mode) => {
    expect(fondAuRepos(poserBouton({}, mode))).toBe(FOND_ACCENT);
  });

  it.each(["light", "dark"] as const)(
    "peint le glyphe en accent.contrastText en mode %s",
    (mode) => {
      expect(couleurDuGlyphe(poserBouton({}, mode))).toBe(GLYPHE_ACCENT);
    },
  );

  it("transmet la couleur du glyphe a l'icone", () => {
    const bouton = poserBouton();
    const couleurCalculee = getComputedStyle(bouton.querySelector("svg") as SVGElement).color;
    expect(couleurCalculee.toLowerCase()).toBe(GLYPHE_ACCENT);
  });

  it("reste cliquable", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    await user.click(poserBouton({ onClick }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("AC3 - variante accent : survol, focus clavier, disabled, loading", () => {
  it("change de fond au survol vers un ton d'accent", () => {
    const fond = fondAuSurvol(poserBouton());
    expect(fond).toMatch(/var\(--canop-palette-accent-/);
    expect(fond).not.toBe(FOND_ACCENT);
  });

  it("reprend au focus clavier le fond de son survol", () => {
    const bouton = poserBouton();
    expect(fondAuFocusClavier(bouton)).toBe(fondAuSurvol(bouton));
  });

  it("ne porte aucun anneau de focus visible", () => {
    const bouton = poserBouton();
    expect(derniereValeurDansLeGroupe(bouton, "outline", ":focus-visible")).toMatch(SANS_ANNEAU);
  });

  it("recoit le focus au clavier", async () => {
    const user = userEvent.setup();
    const bouton = poserBouton();
    await user.tab();
    expect(bouton).toHaveFocus();
  });

  it("se desactive avec le meme rendu que la variante default desactivee", () => {
    const accent = poserVariante("accent", true);
    const reference = poserVariante("default", true);
    expect(accent).toBeDisabled();
    expect(fondAuRepos(accent)).toBe(fondAuRepos(reference));
    expect(couleurDuGlyphe(accent)).toBe(couleurDuGlyphe(reference));
  });

  it("ne garde pas le fond accent une fois desactive", () => {
    expect(fondAuRepos(poserBouton({ disabled: true }))).not.toBe(FOND_ACCENT);
  });

  it("ne declenche pas onClick une fois desactive", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    await user.click(poserBouton({ disabled: true, onClick }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("s'annonce occupe et affiche un indicateur en chargement", () => {
    const bouton = poserBouton({ loading: true });
    expect(bouton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("garde le fond accent.main en chargement", () => {
    expect(fondAuRepos(poserBouton({ loading: true }))).toBe(FOND_ACCENT);
  });

  it("peint l'indicateur de chargement en accent.contrastText", () => {
    const bouton = poserBouton({ loading: true });
    const indicateur = screen.getByRole("progressbar");
    expect(couleurDuGlyphe(bouton)).toBe(GLYPHE_ACCENT);
    expect(bouton).toHaveAttribute("aria-busy", "true");
    expect(indicateur.className).toContain("MuiCircularProgress-colorInherit");
  });

  it("ne declenche pas onClick en chargement", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    await user.click(poserBouton({ loading: true, onClick }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("AC5 - les variantes existantes d'IconActionButton ne changent pas", () => {
  it.each([
    ["default", "var(--canop-palette-primary-main)"],
    ["danger", "var(--canop-palette-error-main)"],
    ["secondary", "var(--canop-palette-secondary-dark)"],
  ] as const)("garde le fond de la variante %s", (variant, fond) => {
    expect(fondAuRepos(poserVariante(variant))).toBe(fond);
  });

  it.each(["default", "danger", "secondary"] as const)(
    "ne peint pas la variante %s en accent",
    (variant) => {
      const bouton = poserVariante(variant);
      expect(fondAuRepos(bouton)).not.toMatch(/accent/);
      expect(couleurDuGlyphe(bouton)).not.toMatch(/accent/);
    },
  );

  it("garde default comme variante par defaut", () => {
    render(
      <CanopThemeProvider>
        <IconActionButton icon="download" ariaLabel="Sans variante" />
      </CanopThemeProvider>,
    );
    expect(fondAuRepos(screen.getByRole("button", { name: "Sans variante" }))).toBe(
      "var(--canop-palette-primary-main)",
    );
  });
});

describe("AC3 - variante accent : contrastes sur les tokens", () => {
  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("tient 4.5:1 entre le glyphe et accent.main en %s", (_mode, jeu) => {
    expect(contrastRatio(jeu.accent.contrastText, jeu.accent.main)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("tient 4.5:1 entre le glyphe et accent.dark au survol en %s", (_mode, jeu) => {
    expect(contrastRatio(jeu.accent.contrastText, jeu.accent.dark)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("tient 3:1 pour l'anneau de focus sur background.default en %s", (_mode, jeu) => {
    expect(contrastRatio(jeu.primary.main, jeu.background.default)).toBeGreaterThanOrEqual(3);
  });
});

describe("Focus clavier - chaque variante reprend son survol", () => {
  it.each([
    ["default", "light"],
    ["default", "dark"],
    ["danger", "light"],
    ["danger", "dark"],
    ["secondary", "light"],
    ["secondary", "dark"],
    ["accent", "light"],
    ["accent", "dark"],
  ] as const)(
    "etant donne la variante %s en mode %s, quand elle recoit le focus clavier, alors son fond est celui du survol",
    async (variant, mode) => {
      const user = userEvent.setup();
      const bouton = poserVariante(variant, false, mode);

      await user.tab();

      expect(bouton).toHaveFocus();
      expect(fondAuFocusClavier(bouton)).not.toBe("");
      expect(fondAuFocusClavier(bouton)).toBe(fondAuSurvol(bouton));
    },
  );

  it.each([
    ["default", "light"],
    ["default", "dark"],
    ["danger", "light"],
    ["danger", "dark"],
    ["secondary", "light"],
    ["secondary", "dark"],
    ["accent", "light"],
    ["accent", "dark"],
  ] as const)(
    "etant donne la variante %s en mode %s, quand elle recoit le focus clavier, alors son fond ne prend pas action.focus",
    async (variant, mode) => {
      const user = userEvent.setup();
      const bouton = poserVariante(variant, false, mode);

      await user.tab();

      expect(fondAuFocusClavier(bouton)).not.toMatch(/action-focus/);
    },
  );

  it.each([
    ["default", "light"],
    ["default", "dark"],
    ["danger", "light"],
    ["danger", "dark"],
    ["secondary", "light"],
    ["secondary", "dark"],
    ["accent", "light"],
    ["accent", "dark"],
  ] as const)(
    "etant donne la variante %s en mode %s, quand elle recoit le focus clavier, alors elle ne porte aucun anneau",
    async (variant, mode) => {
      const user = userEvent.setup();
      const bouton = poserVariante(variant, false, mode);

      await user.tab();

      expect(derniereValeurDansLeGroupe(bouton, "outline", ":focus-visible")).toMatch(SANS_ANNEAU);
      expect(derniereValeurDansLeGroupe(bouton, "outline", ".Mui-focusVisible")).toMatch(
        SANS_ANNEAU,
      );
    },
  );
});
