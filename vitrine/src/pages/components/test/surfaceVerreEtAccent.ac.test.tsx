import { readFileSync } from "node:fs";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import CardDoc from "../CardDoc";
import IconActionButtonDoc from "../IconActionButtonDoc";

const RENDU_LENT = 20_000;

function monte(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function sectionVersion120(): string {
  const changelog = readFileSync("CHANGELOG.md", "utf8");
  const debut = changelog.indexOf("## [1.2.0]");
  const fin = changelog.indexOf("\n## [", debut + 1);
  return changelog.slice(debut, fin);
}

function rubriqueAjoute(section: string): string {
  const debut = section.indexOf("### Ajouté");
  const fin = section.indexOf("\n### ", debut + 1);
  return section.slice(debut, fin === -1 ? undefined : fin);
}

describe("AC4 - demonstration dans la vitrine", () => {
  it(
    "montre une Card frosted sur la page Card",
    () => {
      const { container } = monte(<CardDoc />);
      const verres = Array.from(container.querySelectorAll(".MuiCard-root")).filter(
        (carte) =>
          getComputedStyle(carte).getPropertyValue("backdrop-filter") ===
          "blur(0.25rem) saturate(1.8)",
      );
      expect(verres.length).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );

  it(
    "montre un IconActionButton accent sur la page IconActionButton",
    () => {
      monte(<IconActionButtonDoc />);
      const accents = screen
        .getAllByRole("button")
        .filter(
          (bouton) =>
            getComputedStyle(bouton).color.toLowerCase() ===
            "var(--canop-palette-accent-contrasttext)",
        );
      expect(accents.length).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );
});

describe("AC4 - entree CHANGELOG", () => {
  it("annonce les deux ajouts sous [1.2.0] > Ajouté avec la reference #88", () => {
    const ajouts = rubriqueAjoute(sectionVersion120());
    const entrees = ajouts.split("\n- ").filter((entree) => entree.includes("(#88)"));
    expect(entrees.some((entree) => /Card/.test(entree) && /frosted/.test(entree))).toBe(true);
    expect(entrees.some((entree) => /IconActionButton/.test(entree) && /accent/.test(entree))).toBe(
      true,
    );
  });
});
