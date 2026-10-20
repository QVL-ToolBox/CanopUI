import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Card } from "../../../index";
import { poser, racineDeCarte } from "../../../test/cardTestKit";

describe("AC5 - ref et data-* sur Card", () => {
  it("donne la racine .MuiCard-root a la ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = poser(<Card ref={ref}>Contenu</Card>);
    expect(ref.current).toBe(racineDeCarte(container));
  });

  it("pose les attributs data-* sur la racine", () => {
    const { container } = poser(
      <Card data-testid="carte-test" data-section="facturation">
        Contenu
      </Card>,
    );
    const racine = racineDeCarte(container);
    expect(screen.getByTestId("carte-test")).toBe(racine);
    expect(racine).toHaveAttribute("data-section", "facturation");
  });

  it("rend une Card fill identique avec ou sans attribut data-*", () => {
    const sans = racineDeCarte(poser(<Card fill>Contenu</Card>).container).className;
    const avec = racineDeCarte(
      poser(
        <Card fill data-zone="a">
          Contenu
        </Card>,
      ).container,
    ).className;
    expect(avec).toBe(sans);
  });
});
