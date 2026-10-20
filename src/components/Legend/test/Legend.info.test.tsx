import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Legend, palette, paletteDark } from "../../../index";
import { valeurFixe } from "../../../test/cssRules";
import { contrastRatio } from "../../../test/contrastRatio";
import { poser } from "../../../test/cardTestKit";

describe("AC2 - ton info de Legend", () => {
  it("peint la pastille de legende info en info-main", () => {
    poser(<Legend items={[{ tone: "info", label: "A relire" }]} />);
    const entree = screen.getByRole("listitem");
    expect(valeurFixe(entree.firstElementChild as HTMLElement, "background-color")).toBe(
      "var(--canop-palette-info-main)",
    );
  });

  it("distingue la pastille info de celles des autres tons", () => {
    poser(
      <Legend
        items={[
          { tone: "neutral", label: "N" },
          { tone: "success", label: "S" },
          { tone: "warning", label: "W" },
          { tone: "error", label: "E" },
          { tone: "info", label: "I" },
        ]}
      />,
    );
    const pastilles = screen
      .getAllByRole("listitem")
      .map((entree) => valeurFixe(entree.firstElementChild as HTMLElement, "background-color"));
    expect(new Set(pastilles).size).toBe(5);
  });

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("garde la pastille info visible sur background.paper en mode %s", (_mode, jeu) => {
    expect(contrastRatio(jeu.info.main, jeu.background.paper)).toBeGreaterThanOrEqual(3);
  });
});
