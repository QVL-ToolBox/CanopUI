import { describe, expect, it } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { ThemeToggle } from "../ThemeToggle";
import { LanguageSelector } from "../../LanguageSelector";
import { Navbar } from "../../Navbar";
import type { CanopThemeMode } from "../../../theme";
import {
  VIEWPORTS,
  classesEmotionDuSousArbre,
  reglesBrutesDesElements,
  reglesBrutesDuSousArbre,
  rendreTonal,
  simulerViewport,
} from "../../../test/navbarToneKit";

const MODES: CanopThemeMode[] = ["light", "dark"];
const FORMATS = Object.entries(VIEWPORTS) as [
  keyof typeof VIEWPORTS,
  (requete: string) => boolean,
][];
const VARIABLE_NAVBAR = "--canop-navbar-";

function ancetres(element: Element): Element[] {
  const chaine: Element[] = [];
  for (let courant = element.parentElement; courant; courant = courant.parentElement) {
    chaine.push(courant);
  }
  return chaine;
}

function pastillesFlottantes() {
  return (
    <Navbar items={[{ label: "Dashboard", href: "/dashboard" }]} actions={<ThemeToggle />}>
      Contenu
    </Navbar>
  );
}

describe.each(MODES)("AC4 - perimetre de la Navbar tonale, mode %s", (mode) => {
  it("le ThemeToggle seul ne lit aucune variable --canop-navbar", () => {
    rendreTonal(<ThemeToggle />, mode);
    expect(reglesBrutesDuSousArbre(screen.getByRole("switch")).join("\n")).not.toContain(
      VARIABLE_NAVBAR,
    );
  });

  it("le LanguageSelector seul ne lit aucune variable --canop-navbar", () => {
    const { container } = rendreTonal(<LanguageSelector />, mode);
    expect(reglesBrutesDuSousArbre(container).join("\n")).not.toContain(VARIABLE_NAVBAR);
  });

  describe.each(FORMATS)("pastilles flottantes de la page en format %s", (_format, viewport) => {
    it("rendent le ThemeToggle a l'identique de sa version seule", () => {
      simulerViewport(viewport);
      rendreTonal(<ThemeToggle />, mode);
      const seule = classesEmotionDuSousArbre(screen.getByRole("switch"));
      cleanup();
      rendreTonal(pastillesFlottantes(), mode);
      for (const bascule of screen.getAllByRole("switch")) {
        expect(classesEmotionDuSousArbre(bascule)).toEqual(seule);
      }
    });

    it("ne recoivent aucune variable --canop-navbar de leurs conteneurs", () => {
      simulerViewport(viewport);
      rendreTonal(pastillesFlottantes(), mode);
      for (const bascule of screen.getAllByRole("switch")) {
        const reglesDesConteneurs = reglesBrutesDesElements(ancetres(bascule)).join("\n");
        expect(reglesDesConteneurs).not.toContain(VARIABLE_NAVBAR);
      }
    });
  });
});
