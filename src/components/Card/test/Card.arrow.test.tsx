import { beforeEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Card } from "../Card";
import { CARD_TRANSFORM_TRANSITION } from "../cardTransitions";
import { declarationsDe } from "../../../test/cssRules";
import { mockReducedMotion } from "../../../motion/test/presenceTestKit";

function renderCard(ui: React.ReactElement): HTMLElement {
  const { container } = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  return container;
}

function arrowOf(container: HTMLElement): Element | null {
  return container.querySelector(".CanopCard-arrow");
}

function reglesDeLaFleche(container: HTMLElement): CSSStyleRule[] {
  const card = container.querySelector(".MuiCard-root") as HTMLElement;
  const classesDeLaCarte = Array.from(card.classList).filter((classe) => classe.startsWith("css-"));
  const regles: CSSStyleRule[] = [];
  const parcourir = (liste: CSSRuleList) => {
    for (const regle of Array.from(liste)) {
      if (regle instanceof CSSMediaRule) parcourir(regle.cssRules);
      if (!(regle instanceof CSSStyleRule)) continue;
      if (!regle.selectorText.includes(".CanopCard-arrow")) continue;
      if (classesDeLaCarte.some((classe) => regle.selectorText.includes(`.${classe}`))) {
        regles.push(regle);
      }
    }
  };
  for (const feuille of Array.from(document.styleSheets)) parcourir(feuille.cssRules);
  return regles;
}

function valeurs(container: HTMLElement, propriete: string): string[] {
  return reglesDeLaFleche(container)
    .map((regle) => regle.style.getPropertyValue(propriete))
    .filter((valeur) => valeur !== "");
}

beforeEach(() => {
  mockReducedMotion(false);
});

describe("Card - fleche", () => {
  it("place une fleche svg dans la zone d'action de l'en-tete", () => {
    const container = renderCard(
      <Card title="Revenus" variant="interactive" onClick={() => undefined} arrow>
        Contenu
      </Card>,
    );
    const arrow = arrowOf(container);
    expect(arrow?.tagName.toLowerCase()).toBe("svg");
    expect(arrow?.closest(".MuiCardHeader-action")).not.toBeNull();
  });

  it("affiche un en-tete portant la fleche meme sans titre", () => {
    const container = renderCard(
      <Card variant="interactive" onClick={() => undefined} arrow>
        Contenu
      </Card>,
    );
    expect(container.querySelector(".MuiCardHeader-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiCardHeader-action .CanopCard-arrow")).toBeInTheDocument();
  });

  it("cache la fleche decorative aux technologies d'assistance", () => {
    const container = renderCard(
      <Card variant="interactive" onClick={() => undefined} arrow>
        Contenu
      </Card>,
    );
    expect(arrowOf(container)).toHaveAttribute("aria-hidden", "true");
  });

  it("n'affiche ni fleche ni en-tete sans arrow et sans titre", () => {
    const container = renderCard(<Card>Contenu</Card>);
    expect(arrowOf(container)).toBeNull();
    expect(container.querySelector(".MuiCardHeader-root")).not.toBeInTheDocument();
  });

  it("n'ajoute pas de zone d'action a un en-tete titre sans arrow", () => {
    const container = renderCard(<Card title="Revenus">Contenu</Card>);
    expect(arrowOf(container)).toBeNull();
    expect(container.querySelector(".MuiCardHeader-action")).not.toBeInTheDocument();
  });

  it("rend exactement la meme carte avec arrow a false que sans la prop", () => {
    const sans = renderCard(
      <Card title="Revenus" variant="interactive" onClick={() => undefined}>
        Contenu
      </Card>,
    ).innerHTML;
    const avecFalse = renderCard(
      <Card title="Revenus" variant="interactive" onClick={() => undefined} arrow={false}>
        Contenu
      </Card>,
    ).innerHTML;
    expect(avecFalse).toBe(sans);
  });
});

describe("Card - fleche hors variante interactive", () => {
  it.each(["surface", "floating", "stat"] as const)(
    "n'affiche ni fleche ni en-tete en variante %s",
    (variant) => {
      const container = renderCard(
        <Card variant={variant} arrow>
          Contenu
        </Card>,
      );
      expect(arrowOf(container)).toBeNull();
      expect(container.querySelector(".MuiCardHeader-root")).not.toBeInTheDocument();
    },
  );

  it.each(["surface", "floating", "stat"] as const)(
    "rend la carte %s avec arrow exactement comme sans arrow",
    (variant) => {
      const avec = renderCard(
        <Card variant={variant} arrow>
          Contenu
        </Card>,
      ).innerHTML;
      const sans = renderCard(<Card variant={variant}>Contenu</Card>).innerHTML;
      expect(avec).toBe(sans);
    },
  );
});

describe("Card - micro-mouvement de la fleche", () => {
  it("anime la fleche d'une carte interactive au survol", () => {
    const container = renderCard(
      <Card variant="interactive" onClick={() => undefined} arrow>
        Contenu
      </Card>,
    );
    expect(valeurs(container, "transition")).toContain(CARD_TRANSFORM_TRANSITION);
    expect(
      reglesDeLaFleche(container).some(
        (regle) =>
          regle.selectorText.includes(":hover") &&
          regle.style.getPropertyValue("transform").startsWith("translate"),
      ),
    ).toBe(true);
  });

  it("partage la transition de transform de la carte interactive", () => {
    const container = renderCard(
      <Card variant="interactive" onClick={() => undefined} arrow>
        Contenu
      </Card>,
    );
    const card = container.querySelector(".MuiCard-root") as HTMLElement;
    const transitionsDeLaCarte = declarationsDe(card, "transition")
      .filter((entree) => entree.condition === "")
      .map((entree) => entree.valeur);
    expect(transitionsDeLaCarte.some((valeur) => valeur.includes(CARD_TRANSFORM_TRANSITION))).toBe(
      true,
    );
  });

  it("n'applique ni transition ni transform a la fleche en mouvement reduit", () => {
    mockReducedMotion(true);
    const container = renderCard(
      <Card variant="interactive" onClick={() => undefined} arrow>
        Contenu
      </Card>,
    );
    expect(arrowOf(container)).toBeInTheDocument();
    expect(valeurs(container, "transition")).toEqual([]);
    expect(valeurs(container, "transform")).toEqual([]);
  });
});
