import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Box from "@mui/material/Box";
import {
  CanopThemeProvider,
  hoverOrKeyboardFocus,
  keyboardFocus,
  withoutFocusRing,
} from "../../index";
import { reglesEmises } from "../../test/cssRules";

const selecteurs = (groupe: string) => groupe.split(",").map((selecteur) => selecteur.trim());

function poserBoite(sx: object) {
  render(
    <CanopThemeProvider>
      <Box component="button" sx={sx}>
        Cible
      </Box>
    </CanopThemeProvider>,
  );
  return screen.getByRole("button", { name: "Cible" });
}

function valeurPour(element: HTMLElement, etat: string, propriete: string): string {
  const classe = Array.from(element.classList).find((nom) => nom.startsWith("css-")) ?? "";
  return (
    reglesEmises(element)
      .filter((regle) => selecteurs(regle.selecteur).includes(`.${classe}${etat}`))
      .map((regle) => regle.style.getPropertyValue(propriete))
      .filter((valeur) => valeur !== "")
      .at(-1) ?? ""
  );
}

describe("AC4 - keyboardFocus", () => {
  it("cible le focus clavier natif et celui de MUI", () => {
    expect(selecteurs(keyboardFocus())).toEqual(["&:focus-visible", "&.Mui-focusVisible"]);
  });

  it("propage un suffixe a chaque selecteur", () => {
    expect(selecteurs(keyboardFocus("::before"))).toEqual([
      "&:focus-visible::before",
      "&.Mui-focusVisible::before",
    ]);
  });

  it("ne cible jamais le focus souris ni le survol", () => {
    for (const selecteur of selecteurs(keyboardFocus())) {
      expect(selecteur).not.toMatch(/:focus(?![-\w])|Mui-focused|:hover/);
    }
  });
});

describe("AC4 - hoverOrKeyboardFocus", () => {
  it("groupe le survol et les deux formes de focus clavier", () => {
    expect(selecteurs(hoverOrKeyboardFocus())).toEqual([
      "&:hover",
      "&:focus-visible",
      "&.Mui-focusVisible",
    ]);
  });

  it("propage un suffixe a chaque selecteur", () => {
    expect(selecteurs(hoverOrKeyboardFocus(" .icone"))).toEqual([
      "&:hover .icone",
      "&:focus-visible .icone",
      "&.Mui-focusVisible .icone",
    ]);
  });

  it("ne cible jamais le focus souris", () => {
    for (const selecteur of selecteurs(hoverOrKeyboardFocus())) {
      expect(selecteur).not.toMatch(/:focus(?![-\w])|Mui-focused/);
    }
  });

  it("donne au focus clavier exactement la valeur du survol une fois emis", () => {
    const element = poserBoite({ [hoverOrKeyboardFocus()]: { backgroundColor: "rgb(1, 2, 3)" } });

    expect({
      survol: valeurPour(element, ":hover", "background-color"),
      focusVisible: valeurPour(element, ":focus-visible", "background-color"),
      focusVisibleMui: valeurPour(element, ".Mui-focusVisible", "background-color"),
      focusSouris: valeurPour(element, ":focus", "background-color"),
    }).toEqual({
      survol: "rgb(1, 2, 3)",
      focusVisible: "rgb(1, 2, 3)",
      focusVisibleMui: "rgb(1, 2, 3)",
      focusSouris: "",
    });
  });
});

describe("AC4 - withoutFocusRing", () => {
  it("retire l'outline au repos et au focus clavier", () => {
    expect(withoutFocusRing).toEqual({
      outline: "none",
      [keyboardFocus()]: { outline: "none" },
    });
  });

  it("n'emet aucun anneau une fois applique", () => {
    const element = poserBoite(withoutFocusRing);

    expect({
      repos: valeurPour(element, "", "outline"),
      focusVisible: valeurPour(element, ":focus-visible", "outline"),
      focusVisibleMui: valeurPour(element, ".Mui-focusVisible", "outline"),
      boxShadowAuFocus: valeurPour(element, ":focus-visible", "box-shadow"),
    }).toEqual({
      repos: "none",
      focusVisible: "none",
      focusVisibleMui: "none",
      boxShadowAuFocus: "",
    });
  });
});
