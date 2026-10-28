import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { CommandPalette } from "../CommandPalette";
import {
  elementsDecoupesEtOmbres,
  estDecoupeEnSquircle,
  porteUnDropShadow,
  valeursPortees,
} from "../../../test/squircleShadowKit";

const scrollIntoViewOriginal = HTMLElement.prototype.scrollIntoView;
const modes = ["light", "dark"] as const;

function ouvrirPalette(mode: (typeof modes)[number]) {
  render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider mode={mode}>
        <CommandPalette
          open
          onClose={vi.fn()}
          items={[
            { id: "new", label: "Nouveau", group: "Fichier" },
            { id: "settings", label: "Paramètres", group: "Compte" },
          ]}
        />
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
  const paper = screen.getByRole("dialog").closest(".MuiPaper-root") as HTMLElement;
  const conteneur = paper.closest(".MuiDialog-container") as HTMLElement;
  return { paper, conteneur };
}

describe.each(modes)("CommandPalette — ombre squircle en thème %s", (mode) => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    HTMLElement.prototype.scrollIntoView = scrollIntoViewOriginal;
  });

  it("porte le drop-shadow sur le conteneur de dialogue non découpé", () => {
    const { conteneur } = ouvrirPalette(mode);
    expect(conteneur).toBeInTheDocument();
    expect(porteUnDropShadow(conteneur)).toBe(true);
    expect(estDecoupeEnSquircle(conteneur)).toBe(false);
    expect(valeursPortees(conteneur, "overflow")).not.toContain("hidden");
  });

  it("découpe le Paper en squircle sans lui donner de filter", () => {
    const { paper } = ouvrirPalette(mode);
    expect(estDecoupeEnSquircle(paper)).toBe(true);
    expect(porteUnDropShadow(paper)).toBe(false);
    expect(valeursPortees(paper, "filter").every((valeur) => valeur === "none")).toBe(true);
  });

  it("ne cumule jamais découpe squircle et drop-shadow sur un même élément", () => {
    ouvrirPalette(mode);
    expect(elementsDecoupesEtOmbres()).toEqual([]);
  });
});
