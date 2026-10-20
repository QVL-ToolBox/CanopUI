import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Heading } from "../Heading";
import { declarationsDe, valeurAuPalier, valeurFixe } from "../../../test/cssRules";

function titre(nom: string) {
  return screen.getByRole("heading", { name: nom });
}

function renderHeading(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Heading — taille par point de rupture", () => {
  it("change de taille et de crénage au palier demandé", () => {
    renderHeading(
      <Heading level={2} size={{ xs: 5, md: 3 }}>
        Entraînement
      </Heading>,
    );
    const heading = titre("Entraînement");
    expect(valeurAuPalier(heading, "font-size", 0)).toBe("1.333rem");
    expect(valeurAuPalier(heading, "font-size", 64)).toBe("2.369rem");
    expect(valeurAuPalier(heading, "letter-spacing", 0)).not.toBe(
      valeurAuPalier(heading, "letter-spacing", 64),
    );
  });

  it("retombe sur la taille du niveau en dessous du premier palier renseigné", () => {
    renderHeading(
      <Heading level={4} size={{ md: 2 }}>
        Réglages
      </Heading>,
    );
    const heading = titre("Réglages");
    expect(valeurAuPalier(heading, "font-size", 0)).toBe("1.777rem");
    expect(valeurAuPalier(heading, "font-size", 64)).toBe("3.158rem");
  });

  it("rend une taille fixe, sans aucun palier, avec size numérique", () => {
    renderHeading(
      <Heading level={2} size={4}>
        Fixe
      </Heading>,
    );
    const heading = titre("Fixe");
    expect(declarationsDe(heading, "font-size")).toEqual([{ condition: "", valeur: "1.777rem" }]);
  });

  it("rend la taille du niveau, sans aucun palier, sans prop size", () => {
    renderHeading(<Heading level={3}>Sans taille</Heading>);
    const heading = titre("Sans taille");
    expect(declarationsDe(heading, "font-size")).toEqual([{ condition: "", valeur: "2.369rem" }]);
  });

  it("ne pose famille, graisse et interligne qu'une seule fois", () => {
    renderHeading(
      <Heading level={2} size={{ xs: 5, md: 3 }}>
        Une seule fois
      </Heading>,
    );
    const heading = titre("Une seule fois");
    for (const propriete of ["font-family", "font-weight", "line-height"]) {
      expect(declarationsDe(heading, propriete)).toHaveLength(1);
      expect(valeurFixe(heading, propriete)).not.toBe("");
    }
  });
});
