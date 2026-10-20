import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import CarouselDoc from "../CarouselDoc";

// Les demonstrations du carrousel etaient muettes : leurs cartes venaient d'un
// composant enveloppe, et `Children.toArray` n'aplatit ni un composant ni un
// fragment. Le carrousel n'en comptait donc **qu'une**, ce qui masque les
// fleches et les barres -- les deux exigent plus d'une carte -- annule les
// transitions, et pose les trois cartes cote a cote dans l'unique diapositive.
// Rien ne le signalait : pas d'erreur, pas de test, et la page paraissait
// simplement etre restee dans sa version d'avant.
function monte(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

// Monter la page entiere du carrousel coute plusieurs secondes -- trois
// carrousels, leurs cartes et la coloration syntaxique des extraits -- et
// depassait la limite de 5 s par defaut sous la charge de la suite complete,
// une fois sur plusieurs executions. C'etait un echec de duree, pas de
// comportement : la limite est donc dite ici plutot que subie.
const RENDU_LENT = 20_000;

describe("page Carousel de la vitrine", () => {
  it(
    "montre des fleches, donc compte bien plus d'une carte",
    () => {
      monte(<CarouselDoc />);

      // Une seule carte comptee, et il n'y aurait aucune fleche dans la page.
      expect(screen.getAllByRole("button", { name: "Élément précédent" }).length).toBeGreaterThan(
        0,
      );
      expect(screen.getAllByRole("button", { name: "Élément suivant" }).length).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );

  it(
    "montre des barres de navigation, meme raison",
    () => {
      monte(<CarouselDoc />);

      expect(
        screen.getAllByRole("button", { name: /Aller à la diapositive/ }).length,
      ).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );
});
