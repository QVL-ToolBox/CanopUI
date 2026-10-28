import { describe, expect, it, vi } from "vitest";
import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsMenu } from "../SettingsMenu";
import { ThemeToggle } from "../../ThemeToggle";
import {
  NAVBAR_FIELD_FILL,
  NAVBAR_FIELD_OUTLINE,
  NAVBAR_FIELD_OUTLINE_ENGAGED,
} from "../../Navbar/navbarTone";
import type { CanopThemeMode } from "../../../theme";
import {
  classesEmotionDuSousArbre,
  reglesBrutesDuSousArbre,
  reglesBrutesVisant,
  rendreTonal,
} from "../../../test/navbarToneKit";

const MODES: CanopThemeMode[] = ["light", "dark"];
const DEGRADE_DE_BARRE =
  "linear-gradient(180deg, var(--canop-navbar-bg-top) 0%, var(--canop-navbar-bg-bottom) 100%)";

function rendreLeMenu(mode: CanopThemeMode) {
  rendreTonal(
    <SettingsMenu onLogout={vi.fn()} footer={<span>Mentions</span>} infoHref="/cgu" />,
    mode,
  );
  return screen.getByLabelText("Ouvrir le menu");
}

async function ouvrirLeMenu(mode: CanopThemeMode) {
  const user = userEvent.setup();
  await user.click(rendreLeMenu(mode));
  await screen.findByRole("dialog", { name: "Ouvrir le menu" });
  return screen.getByRole("presentation");
}

function selecteur(regle: string) {
  return regle.split("{")[0];
}

function reglesDuMenu(menu: Element) {
  return reglesBrutesDuSousArbre(menu).join("\n");
}

function reglesDuChampDeLangue(menu: Element) {
  return reglesBrutesDuSousArbre(menu).filter((regle) =>
    selecteur(regle).includes(".MuiOutlinedInput-root"),
  );
}

describe.each(MODES)("SettingsMenu tonal - mode %s", (mode) => {
  it("AC3 - le bouton engrenage prend la teinte de la barre", () => {
    const regles = reglesBrutesVisant(rendreLeMenu(mode)).join("\n");
    expect(regles).toContain(DEGRADE_DE_BARRE);
    expect(regles).toContain("color:var(--canop-navbar-text);");
  });

  it("AC3 - le bouton engrenage se couvre d'un voile clair au survol comme au focus clavier", () => {
    const survols = reglesBrutesVisant(rendreLeMenu(mode)).filter(
      (regle) => selecteur(regle).includes(":hover") && regle.includes("--canop-navbar-hover-fill"),
    );
    expect(survols).not.toHaveLength(0);
    for (const regle of survols) {
      expect(selecteur(regle)).toContain(":focus-visible");
    }
  });

  it("AC3 - le popover prend le fond sombre de la barre", async () => {
    const menu = await ouvrirLeMenu(mode);
    expect(reglesDuMenu(menu)).toContain(DEGRADE_DE_BARRE);
    expect(reglesDuMenu(menu)).toContain("color:var(--canop-navbar-text)");
  });

  it("AC3 - la bascule de theme est adaptee depuis le parent", async () => {
    const menu = await ouvrirLeMenu(mode);
    const reglesDeBascule = reglesBrutesDuSousArbre(menu).filter((regle) =>
      selecteur(regle).includes('button[role="switch"]'),
    );
    expect(within(menu).getByRole("switch")).toBeInTheDocument();
    expect(reglesDeBascule.join("\n")).toMatch(/var\(--canop-navbar-[a-z-]+\)/);
  });

  it("AC3 - le champ de langue recoit un fond opaque teinte depuis le parent", async () => {
    const menu = await ouvrirLeMenu(mode);
    const fonds = reglesDuChampDeLangue(menu).filter((regle) =>
      selecteur(regle).includes("::after"),
    );
    expect(fonds.join("\n")).toContain(`background-color:${NAVBAR_FIELD_FILL};`);
    expect(fonds.join("\n")).not.toContain("transparent");
  });

  it("AC3 - le champ de langue recoit son contour depuis le parent", async () => {
    const menu = await ouvrirLeMenu(mode);
    const auRepos = reglesDuChampDeLangue(menu).filter(
      (regle) => !selecteur(regle).includes(":hover"),
    );
    expect(auRepos.join("\n")).toContain(`--canop-input-outline:${NAVBAR_FIELD_OUTLINE};`);
  });

  it("AC3 - le champ de langue renforce son contour au survol comme au focus clavier", async () => {
    const menu = await ouvrirLeMenu(mode);
    const engagees = reglesDuChampDeLangue(menu).filter((regle) =>
      regle.includes(`--canop-input-outline:${NAVBAR_FIELD_OUTLINE_ENGAGED};`),
    );
    expect(engagees).not.toHaveLength(0);
    for (const regle of engagees) {
      expect(selecteur(regle)).toContain(":hover");
      expect(selecteur(regle)).toContain(":focus-visible");
    }
  });

  it("AC6 - le separateur reste annonce et prend la teinte de la barre", async () => {
    const menu = await ouvrirLeMenu(mode);
    expect(within(menu).getByRole("separator")).toBeInTheDocument();
    expect(reglesDuMenu(menu)).toContain("var(--canop-navbar-separator)");
  });

  it("AC4 - la bascule du menu garde exactement le rendu propre du ThemeToggle", async () => {
    rendreTonal(<ThemeToggle />, mode);
    const seule = classesEmotionDuSousArbre(screen.getByRole("switch"));
    cleanup();
    const menu = await ouvrirLeMenu(mode);
    expect(classesEmotionDuSousArbre(within(menu).getByRole("switch"))).toEqual(seule);
  });
});
