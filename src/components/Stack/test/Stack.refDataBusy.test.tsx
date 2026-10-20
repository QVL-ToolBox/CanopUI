import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Stack } from "../../../index";
import { poser } from "../../../test/cardTestKit";

describe("AC5 - ref et data-* sur Stack", () => {
  it.each([undefined, "form", "nav", "section"] as const)(
    "donne l'element rendu a la ref avec as=%s",
    (as) => {
      const ref = createRef<HTMLElement>();
      poser(
        <Stack as={as} ref={ref} data-testid="pile">
          <span>Contenu</span>
        </Stack>,
      );
      const rendu = screen.getByText("Contenu").parentElement;
      expect(ref.current).toBe(rendu);
      expect(rendu?.tagName.toLowerCase()).toBe(as ?? "div");
    },
  );

  it("pose les attributs data-* sur l'element rendu", () => {
    poser(
      <Stack as="nav" data-testid="pile" data-zone="principale">
        <span>Contenu</span>
      </Stack>,
    );
    const rendu = screen.getByText("Contenu").parentElement;
    expect(screen.getByTestId("pile")).toBe(rendu);
    expect(rendu).toHaveAttribute("data-zone", "principale");
  });
});

describe("Ajout - Stack ariaBusy", () => {
  it.each([true, false])("pose aria-busy=%s", (occupe) => {
    poser(
      <Stack ariaBusy={occupe}>
        <span>Contenu</span>
      </Stack>,
    );
    expect(screen.getByText("Contenu").parentElement).toHaveAttribute("aria-busy", String(occupe));
  });

  it("n'a pas d'attribut aria-busy sans la prop", () => {
    poser(
      <Stack>
        <span>Contenu</span>
      </Stack>,
    );
    expect(screen.getByText("Contenu").parentElement).not.toHaveAttribute("aria-busy");
  });
});
