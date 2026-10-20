import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Heading, type CanopHeadingLevel, type CanopHeadingSize } from "../Heading";
import { declarationsDe, valeurAuPalier } from "../../../test/cssRules";

const taillesAttendues: Record<CanopHeadingSize, string> = {
  1: "4.21rem",
  2: "3.158rem",
  3: "2.369rem",
  4: "1.777rem",
  5: "1.333rem",
  6: "1rem",
};

const crenagesAttendus: Record<CanopHeadingSize, string> = {
  1: "-0.035em",
  2: "-0.028em",
  3: "-0.022em",
  4: "-0.016em",
  5: "-0.011em",
  6: "-0.006em",
};

function renderHeading(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function titre(nom: string) {
  return screen.getByRole("heading", { name: nom });
}

describe("Heading — les paliers 1 à 5 ne bougent pas", () => {
  it.each([1, 2, 3, 4, 5] as const)("rend le palier %i comme avant l'ajout du sixième", (size) => {
    renderHeading(
      <Heading level={2} size={size}>
        {`Palier ${size}`}
      </Heading>,
    );
    const heading = titre(`Palier ${size}`);
    expect(declarationsDe(heading, "font-size")).toEqual([
      { condition: "", valeur: taillesAttendues[size] },
    ]);
    expect(declarationsDe(heading, "letter-spacing")).toEqual([
      { condition: "", valeur: crenagesAttendus[size] },
    ]);
  });

  it.each([1, 2, 3, 4] as const)(
    "rend la taille du niveau %i quand aucune taille n'est demandée",
    (level) => {
      renderHeading(<Heading level={level}>{`Niveau ${level}`}</Heading>);
      const heading = titre(`Niveau ${level}`);
      expect(declarationsDe(heading, "font-size")).toEqual([
        { condition: "", valeur: taillesAttendues[level] },
      ]);
    },
  );
});

describe("Heading — sixième palier", () => {
  it("rend 1rem sans aucun point de rupture avec size={6}", () => {
    renderHeading(
      <Heading level={3} size={6}>
        Titre minuscule
      </Heading>,
    );
    const heading = titre("Titre minuscule");
    expect(declarationsDe(heading, "font-size")).toEqual([{ condition: "", valeur: "1rem" }]);
  });

  it("garde le niveau sémantique demandé", () => {
    renderHeading(
      <Heading level={2} size={6}>
        Sémantique intacte
      </Heading>,
    );
    expect(titre("Sémantique intacte").tagName).toBe("H2");
  });

  it("rend 1rem sous md et 1.777rem au-delà avec size={{ xs: 6, md: 4 }}", () => {
    renderHeading(
      <Heading level={2} size={{ xs: 6, md: 4 }}>
        Titre responsive
      </Heading>,
    );
    const heading = titre("Titre responsive");
    expect(valeurAuPalier(heading, "font-size", 0)).toBe("1rem");
    expect(valeurAuPalier(heading, "font-size", 64)).toBe("1.777rem");
  });
});

describe("Heading — level et size restent indépendants", () => {
  it("n'accepte pas un niveau au-delà de 4", () => {
    const niveauValide: CanopHeadingLevel = 4;
    expect(niveauValide).toBe(4);
    // @ts-expect-error CanopHeadingLevel ne va pas au-dela de 4
    const niveauInterdit: CanopHeadingLevel = 6;
    expect(niveauInterdit).toBe(6);
  });

  it.each([1, 2, 3, 4] as const)(
    "ne retombe jamais sur le sixième palier sous le premier point de rupture renseigné (niveau %i)",
    (level) => {
      renderHeading(
        <Heading level={level} size={{ md: 2 }}>
          {`Repli ${level}`}
        </Heading>,
      );
      const heading = titre(`Repli ${level}`);
      expect(valeurAuPalier(heading, "font-size", 0)).toBe(taillesAttendues[level]);
      expect(valeurAuPalier(heading, "font-size", 0)).not.toBe("1rem");
    },
  );
});
