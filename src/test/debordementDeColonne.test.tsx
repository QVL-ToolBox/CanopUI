import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../theme";
import { Card } from "../components/Card/Card";
import { CardGrid } from "../components/CardGrid/CardGrid";
import { Heading } from "../components/Heading/Heading";
import { Stack } from "../components/Stack/Stack";
import { Text } from "../components/Text/Text";
import { valeurFixe } from "./cssRules";

function rendu(ui: React.ReactElement): HTMLElement {
  const { container } = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  return container.firstElementChild as HTMLElement;
}

const MOT_LONG = "Entrainement";

describe("debordement de colonne — les boites cedent", () => {
  it("la grille laisse ses enfants passer sous leur contenu", () => {
    const grille = rendu(
      <CardGrid>
        <span>Atlas</span>
      </CardGrid>,
    );
    const enfant = grille.firstElementChild as HTMLElement;

    expect(getComputedStyle(enfant).minWidth).toBe("0px");
  });

  it("la carte cede, posee en element de grille", () => {
    const carte = rendu(<Card variant="surface">Atlas</Card>);

    expect(valeurFixe(carte, "min-width")).toBe("0px");
  });

  it("le bloc cede, pose dans une ligne flex", () => {
    const bloc = rendu(<Stack direction="row">Atlas</Stack>);

    expect(valeurFixe(bloc, "min-width")).toBe("0px");
  });
});

describe("debordement de colonne — le mot se coupe", () => {
  it("un titre coupe un mot trop long plutot que de deborder", () => {
    const titre = rendu(<Heading>{MOT_LONG}</Heading>);

    expect(valeurFixe(titre, "overflow-wrap")).toBe("break-word");
  });

  it("un texte coupe un mot trop long plutot que de deborder", () => {
    const texte = rendu(<Text>{MOT_LONG}</Text>);

    expect(valeurFixe(texte, "overflow-wrap")).toBe("break-word");
  });

  it("la coupure ne touche pas au calcul du min-content", () => {
    const titre = rendu(<Heading>{MOT_LONG}</Heading>);

    expect(valeurFixe(titre, "overflow-wrap")).not.toBe("anywhere");
  });
});
