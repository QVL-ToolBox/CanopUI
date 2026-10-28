import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { ConfirmDialog } from "../ConfirmDialog";
import {
  elementsDecoupesEtOmbres,
  resoudre,
  valeursPortees,
} from "../../../test/squircleShadowKit";

const noop = () => undefined;
const modes = ["light", "dark"] as const;

function ouvrirDialogue(mode: (typeof modes)[number]) {
  render(
    <CanopThemeProvider mode={mode}>
      <ConfirmDialog
        open
        title="Supprimer ?"
        message="Définitif."
        onConfirm={noop}
        onCancel={noop}
      />
    </CanopThemeProvider>,
  );
  const paper = screen.getByRole("dialog").closest(".MuiPaper-root") ?? screen.getByRole("dialog");
  return paper as HTMLElement;
}

const resoutEnAucun = (valeur: string) =>
  valeur === "" ||
  resoudre(valeur)
    .split(" | ")
    .every((partie) => partie === "none");

describe.each(modes)("ConfirmDialog — ombre squircle en thème %s", (mode) => {
  it("rend le Paper MUI en élévation 0", () => {
    const paper = ouvrirDialogue(mode);
    expect(paper).toHaveClass("MuiPaper-root", "MuiPaper-elevation0");
    expect(
      Array.from(paper.classList).filter((classe) => /^MuiPaper-elevation\d+$/.test(classe)),
    ).toEqual(["MuiPaper-elevation0"]);
  });

  it("ne projette aucune box-shadow d'élévation", () => {
    const paper = ouvrirDialogue(mode);
    expect(resoutEnAucun(paper.style.getPropertyValue("--Paper-shadow"))).toBe(true);
    const ombres = valeursPortees(paper, "box-shadow").filter(
      (valeur) => valeur !== "var(--Paper-shadow)",
    );
    expect(ombres.every(resoutEnAucun)).toBe(true);
  });

  it("ne pose aucun voile d'élévation en background-image", () => {
    const paper = ouvrirDialogue(mode);
    expect(resoutEnAucun(paper.style.getPropertyValue("--Paper-overlay"))).toBe(true);
    const voiles = valeursPortees(paper, "background-image").filter(
      (valeur) => valeur !== "var(--Paper-overlay)",
    );
    expect(voiles.every(resoutEnAucun)).toBe(true);
  });

  it("ne cumule jamais découpe squircle et drop-shadow sur un même élément", () => {
    ouvrirDialogue(mode);
    expect(elementsDecoupesEtOmbres()).toEqual([]);
  });
});
