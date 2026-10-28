import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Menu } from "../Menu";
import {
  elementsDecoupesEtOmbres,
  resoudre,
  valeursPortees,
} from "../../../test/squircleShadowKit";

const modes = ["light", "dark"] as const;

function ouvrirMenu(mode: (typeof modes)[number]) {
  render(
    <CanopThemeProvider mode={mode}>
      <Menu
        open
        onClose={vi.fn()}
        ariaLabel="Actions"
        items={[{ label: "Renommer" }, { label: "Supprimer", danger: true }]}
      />
    </CanopThemeProvider>,
  );
  return screen.getByRole("menu", { name: "Actions" }).closest(".MuiPaper-root") as HTMLElement;
}

const resoutEnAucun = (valeur: string) =>
  valeur === "" ||
  resoudre(valeur)
    .split(" | ")
    .every((partie) => partie === "none");

describe.each(modes)("Menu — ombre squircle en thème %s", (mode) => {
  it("rend le Paper MUI en élévation 0", () => {
    const paper = ouvrirMenu(mode);
    expect(paper).toHaveClass("MuiPaper-elevation0");
    expect(
      Array.from(paper.classList).filter((classe) => /^MuiPaper-elevation\d+$/.test(classe)),
    ).toEqual(["MuiPaper-elevation0"]);
  });

  it("ne projette aucune box-shadow d'élévation", () => {
    const paper = ouvrirMenu(mode);
    expect(resoutEnAucun(paper.style.getPropertyValue("--Paper-shadow"))).toBe(true);
    const ombres = valeursPortees(paper, "box-shadow").filter(
      (valeur) => valeur !== "var(--Paper-shadow)",
    );
    expect(ombres.every(resoutEnAucun)).toBe(true);
  });

  it("ne pose aucun voile d'élévation en background-image", () => {
    const paper = ouvrirMenu(mode);
    expect(resoutEnAucun(paper.style.getPropertyValue("--Paper-overlay"))).toBe(true);
    const voiles = valeursPortees(paper, "background-image").filter(
      (valeur) => valeur !== "var(--Paper-overlay)",
    );
    expect(voiles.every(resoutEnAucun)).toBe(true);
  });

  it("ne cumule jamais découpe squircle et drop-shadow sur un même élément", () => {
    ouvrirMenu(mode);
    expect(elementsDecoupesEtOmbres()).toEqual([]);
  });
});
